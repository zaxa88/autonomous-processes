const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
var endOfLine = require('os').EOL;
const bot = new Discord.Client();
var request = require('request');
const fs = require('fs');
var schedule = require('node-schedule');
var dateTime = require('node-datetime');


process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

  bot.on('ready', () => {
      //bot.user.setGame('type !help for commands');
      var dt = dateTime.create();
      var formatted = dt.format('Y-m-d H:M:S');
      console.log(formatted + ' >Scraper Bot Ready....');
  });


  bot.on('guildMemberAdd', member => {
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.find('name', 'general');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;

        // Send the message, mentioning the member
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        console.log(formatted + ' > ' + member.displayName + ' has joined the server.');

        // Check if he's on the new members list. If he is, add him to members.
        const fs = require("fs");
        fs.readFile("newlist.txt", "utf8", function (err, data) {
            SearchData = data.toLocaleUpperCase()
            searchString = member.user.tag.toLocaleUpperCase();
            if(SearchData.search(searchString) > -1) {
                member.addRole(member.guild.roles.find('name', 'Members'))
                console.log(member.displayName + " added to Members.");
                bot.channels.find("name", "bot-spam").send(member.displayName + " added to Members.");
            }
        });
    });

bot.on('message',function(message) {
        var adminCommand = false; //reset variable to check if admin command = true
        // Ignore other bots.
        if(message.author.bot) return;

        // ignore any message that does not start with the bot's prefix,
        // which is set in the configuration file.
    // if(message.content.indexOf(botconfig.prefix) !== 0) return;


        var command = message.content.split(" ")[0].slice(0).toLocaleLowerCase()
        var args = message.content.split(" ").slice(1);

        var msgBody = args.join(' ');
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        //console.log(message.content.indexOf(botconfig.prefix));
    if(message.content.indexOf(botconfig.prefix) == 0) {
        console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
    }

    if(command === '~id') {
        if (message.member.roles.find('name', 'Admin')) {
            message.member.send(message.member.displayName + " / " + message.member.user.tag)
        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
    }

    if(command === '~list') {
        if (message.member.roles.find('name', 'Admin')) {
            var userlist = message.guild.members; // Saving userlist to a variable
            var usersRendered = "";
            userlist.forEach(function(user){
                message.author.send(user.user.tag);
            });
        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
  }

  if(command === '~prune') {
        if(args[0] == null) {
            message.channel.send("argument list empty." + endOfLine + "use: ~prune list|warn|exec");
            return;
        }
        var warningMessage = "We have noticed that you didn't renew. We hope you got everything you wanted" +
        " out of the Dojo and wish you the best of luck in your trades ahead!" + endOfLine + endOfLine +
        "if however you believe this is a mistake, please send a DM as soon as possible to @chris." + endOfLine +
        "Good luck on your journey and we hope to see you again soon!" + endOfLine +
        "***The KJ Crypto Dojo Team***";

        var kickMessage = "We are sorry to see you go! We hope you got everything you wanted" +
        " out of the Dojo and wish you the best of luck in your trades ahead!" + endOfLine + endOfLine +
        "Good luck on your journey and we hope to see you again soon!" + endOfLine +
        "***The KJ Crypto Dojo Team***";

        var renewMessage = "```" + endOfLine + "Dojo Renewal" + endOfLine + "```" + endOfLine + endOfLine +
        "Greetings Dojo Member!" + endOfLine + endOfLine +
        "In order to keep numbers manageable and keep the information, tutorials and webinars at the highest level quality possible, please use the form in #announcements to renew before the 17th of this month." + endOfLine +
        "This helps us evaluate member numbers so we can keep them at a reasonable level before we open it up to the general public." + endOfLine + endOfLine +
        "We look forward to seeing you again in the next month!" + endOfLine +
        "**- The KJ Crypto Dojo team**" + endOfLine;

        if (message.member.roles.find('name', 'Admin')) {
            var userlist = message.guild.members; // Save userlist to a variable
            var usersRendered = "";
            const fs = require("fs");
            if(args[0] == "help") {
                message.channel.send("~prune list|warn|renew|exec");
                return;
            }
            fs.readFile("keeplist.txt", "utf8", function (err, data) {
                SearchData = data.toLocaleUpperCase()
                //console.log(SearchData);
                userlist.forEach(function(user){
                    searchString = user.user.tag.toLocaleUpperCase();
                    if(SearchData.search(searchString) < 0 &
                        !(user.roles.find('name', "Admin")) &
                        !(user.roles.find('name', "Analysts")) &
                        !(user.roles.find('name', "Contributors")) &
                        !(user.roles.find('name', "Automation"))) {
                        console.log(user.user.tag);
                        if(args[0] == "list") {
                            message.author.send(user.user.tag + " ==> PRUNE");
                        }
                        if(args[0] == "warn") {
                            message.author.send(user.user.tag + " ==> WARNED");
                            user.send(warningMessage);
                        }
                        if(args[0] == "renew") {
                            message.author.send(user.user.tag + " ==> SENT");
                            user.send(renewMessage);
                        }
                        if(args[0] == "exec") {
                            message.author.send(user.user.tag + " ==> KICKED");
                            user.send(kickMessage);
                            user.kick();
                        }
                    }
                });
                console.log(usersRendered); // This should log every user
            });

        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
  }

  if(command === '~confirm') {
        var confirmMessage = "```" + endOfLine + "Dojo Renewal Confirmation" + endOfLine + "```" + endOfLine + endOfLine +
        "We are glad you decided to stay! This is your confirmation message for the next month." + endOfLine + endOfLine +
        "PLEASE make sure you don't change your discord name before renewal or at the very least, change it back to the name you put in the form before the last day of this month." + endOfLine +
        "It's important to have the same name as you entered on the form on both the last day of the month and the first day of the following one." + endOfLine + endOfLine +
        "See you in the Dojo!" + endOfLine +
        "**The KJ CryptoDojo Team**" + endOfLine;

        if (message.member.roles.find('name', 'Admin')) {
            var userlist = message.guild.members; // Save userlist to a variable
            var usersRendered = "";
            const fs = require("fs");
            fs.readFile("confirmlist.txt", "utf8", function (err, data) {
                SearchData = data.toLocaleUpperCase()
                //console.log(SearchData);
                userlist.forEach(function(user){
                    searchString = user.user.tag.toLocaleUpperCase();
                    if(SearchData.search(searchString) > -1 &
                        !(user.roles.find('name', "Admin")) &
                        !(user.roles.find('name', "Analysts")) &
                        !(user.roles.find('name', "Contributors")) &
                        !(user.roles.find('name', "Automation"))) {
                                        console.log(user.user.tag);
                            message.author.send(user.user.tag + " ==> confirmed");
                            user.send(confirmMessage);
                        };
                });
                //console.log(usersRendered); // This should log every user
            });

        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
  }
   
  if(command === '~send') {
        if (message.member.roles.find('name', 'Admin')) {
            var userlist = message.guild.members; // Save userlist to a variable
            var usersRendered = "";
            const fs = require("fs");
            fs.readFile("sendlist.txt", "utf8", function (err, data) {
                SearchData = data.toLocaleUpperCase()
                //console.log(SearchData);
                userlist.forEach(function(user){
                    searchString = user.user.tag.toLocaleUpperCase();
                    if(SearchData.search(searchString) > -1 &
                        !(user.roles.find('name', "Admin")) &
                        !(user.roles.find('name', "Analysts")) &
                        !(user.roles.find('name', "Contributors")) &
                        !(user.roles.find('name', "Automation"))) {
                                        console.log(user.user.tag);
                            message.author.send(user.user.tag + " ==> confirmed");
                            user.send(confirmMessage);
                        };
                });
                //console.log(usersRendered); // This should log every user
            });

        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
    }

  if(command === '~status'){
        if (message.member.roles.find('name', 'Admin')) {
            bot.user.setPresence({ game: { name: args.join(' '), type: 0 }});
        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
        adminCommand = true;
    }

    if(message.content.indexOf(botconfig.prefix) == 0 & adminCommand) {
        console.log(formatted + ' ADMIN> ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
  }

});

bot.login(botconfig.token);
