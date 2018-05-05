const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
var Coinigy = require('node-coinigy');
var endOfLine = require('os').EOL;
const bot = new Discord.Client();
var request = require('request');
var dateTime = require('node-datetime');

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

bot.on('ready', () => {
        bot.user.setPresence({ game: { name: 'type !help for commands', type: 0 }});
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        console.log(formatted + ' >KJT Bot Ready....');
});

bot.on('guildMemberAdd', member => {
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.find('name', 'general');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        // Send the message, mentioning the member
        var welcomeMessage = "Welcome to the Dojo " + member.displayName + ". Type !help anytime for commands." + endOfLine +
                "Please make sure to read the #announcements channel for the latest news." + endOfLine;
        member.send(welcomeMessage);
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        console.log(formatted + ' > ' + member.displayName + ' has joined the server.');
  });

function btcTicker() {
        var request = require('request');
        var url = "https://api.coinmarketcap.com/v1/global/";

        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const embed = new Discord.RichEmbed()
                  .setTitle("Coinmarketcap.com Market Data")
                  .setURL("https://coinmarketcap.com")
                  .setColor(16764160)
                  .addField("Market Cap ($BN)", '```http\n$' + (body.total_market_cap_usd / 1000000000).toFixed(2) + ' B/USD```', true)
                  .addField("24h Volume ($BN)", '```http\n$' + (body.total_24h_volume_usd / 1000000000).toFixed(2) + ' B/USD```', true)
                  .addField("Active Currencies", '```c\n' + body.active_currencies.toLocaleString() + '```', true)
                  .addField("BTC Dominance", body.bitcoin_percentage_of_market_cap.toLocaleString() + '%', true)
                  .addField("BTC Market Cap", '$' + (body.bitcoin_percentage_of_market_cap * body.total_market_cap_usd / 100).toLocaleString(), true)
                  .addField("See on TradingView", '[BTC/USD](https://www.tradingview.com/symbols/BTCUSD/)' , true);
                bot.channels.find("name", "automation").send({embed});
                console.log("sending market data to #automation...");
            }
        })

}

setInterval(btcTicker, 3600000);

bot.on('message',function(message) {

    // Ignore other bots.
    if(message.author.bot) return;

    // ignore any message that does not start with the bot's prefix,
    // which is set in the configuration file.

    var command = message.content.split(" ")[0].slice(0).toLocaleLowerCase()
    var args = message.content.split(" ").slice(1);

    var msgBody = args.join(' ');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    if(message.content.indexOf(botconfig.prefix) == 0) {
        console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
    }

/////////////// ADMIN COMMANDS ////////////////////////

    if(command === '!count') {
        if (message.member.roles.find('name', 'Admin')) {
            message.channel.send('Members :' + message.guild.memberCount);
        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
    }

    if(command === '!rules') {
        if (message.member.roles.find('name', 'Admin')) {
            const embed = new Discord.RichEmbed()
                .setTitle("`Before we start...`")
                .setDescription("Please take a few minutes to read through our rules and disclaimer." + endOfLine +
                        "_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-" + endOfLine)
                .setColor(16764160)
                .setThumbnail("https://pbs.twimg.com/profile_images/977718128733052929/EIeC3Skv_400x400.jpg")
                .setAuthor("Welcome to the Korean Jew Trading Discord Server")
                .addField("```RULES:```",
                        "* Do not be afraid to ask questions. We’re all here to learn and different people have different strengths." + endOfLine + endOfLine +
                        "* Check the announcements and signals channels regularly. Important information will be posted and updated regularly there." + endOfLine + endOfLine +
                        "* Familiarize yourselves with the different channels in this group and try your best to keep discussions in the appropriate channels." + endOfLine + endOfLine +
                        "* Keep the research documents and signals to yourselves. We work hard to give everybody in this channel a head start and it only takes a few people to ruin it for the rest of us." + endOfLine + endOfLine +
                        "* Your safety matters. Please refrain from posting any personal information, as well as personal referral links or codes." + endOfLine + endOfLine +
                        "* Decency matters. Please refrain from posting explicit/offensive content." + endOfLine + endOfLine +
                        "* Lastly, please fasten your seatbelts and prepare for liftoff. Mild turbulence is expected, however, we will shortly be on our way to the moon." + endOfLine + endOfLine +
                        "_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-" + endOfLine)
                .addField("```Zero Tolerance for:```",
                        "a. Sexism, Racism, Discrimination, Witch hunting" + endOfLine + endOfLine +
                        "a. Illegal discussions (i.e. Tax Evasion)" + endOfLine + endOfLine +
                        "b. Pump and Dumps" + endOfLine + endOfLine +
                        "c. Doxing or any type of social engineering towards another member" + endOfLine + endOfLine)
             message.guild.channels.find("name", args[0]).send({embed});
        } else {
            message.channel.send('Sorry, you can\'t use that command');
        }
    }


///////////////////////////////////////////////////////


    if(command === '!ping') {
        message.channel.send('Ping time from me to you: ' + message.author.client.ping);
    }

    if(command === '!terms' || command === '!t') {
        const fs = require("fs");
        fs.readFile("glossary.txt", "utf8", function (err, data) {
            message.author.send(data.toString());
        });
    }

    if(command === '!help' || command === '!?') {
        var fs = require("fs");
        fs.readFile("help.txt", "utf8", function (err, data) {
            message.author.send(data.toString());
        });
    }

    if(command === '!delve' || command === '!d') {
        if(args[0] == null) {
            message.channel.send('incorrect parameters. See !help');
            return;
        }
        passable = args[0];

        var request = require('request');
        request({
          method: 'GET',
          url: 'https://www.cryptocompare.com/api/data/coinlist/',
          headers: {
            'Content-Type': 'application/json'
          }
        }, function (error, response, body) {
            dataset = JSON.parse(body).Data;
            for(var exKey in dataset) {
                if(exKey == args[0].toUpperCase()){
                    delveResponse = "Full Name   : " + dataset[exKey].FullName + endOfLine +
                    "Proof Type  : " + dataset[exKey].ProofType + endOfLine +
                    "Total Supply: " + dataset[exKey].TotalCoinSupply.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + endOfLine;
                    if(dataset[exKey].FullyPremined) {
                       delveResponse = delveResponse + "FullPreMined: True" + endOfLine;
                    } else {
                       delveResponse = delveResponse + "FullPreMined: False" + endOfLine;
                    }
                    delveResponse = delveResponse + "Algorithm   : " + dataset[exKey].Algorithm + endOfLine
                    //console.log(delveResponse);
                    message.channel.send(delveResponse)

                }
            }
          });
      }

    if(command === '!ticker' || command === '!x') {
        if(args[0] == null) {
            message.channel.send('incorrect parameters. See !help');
            return;
        }
        var request = require('request');
          var url = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var arguments = args[0];
                var arrFound = body.filter(function(arguments) {
                        return arguments.symbol == (args[0]).toUpperCase();
                });
                var ethValue = body.filter(function(arguments) {
                    return arguments.symbol == ('ETH');
                });
        if(arrFound.length < 1){
            var arrFound = body.filter(function(arguments) {
                return arguments.name.toUpperCase() == (args[0]).toUpperCase();
          });
        }

            if(arrFound.length < 1){
                message.channel.send('Unknown token. Please make sure the token ticker is properly spelled and exists on CoinMarketCap.com');
                return;
            }
                var ethPrice = ethValue[0].price_btc;
                var ticker = arrFound[0].symbol;
                var id = arrFound[0].id;
                var name = arrFound[0].name;
                var rank = arrFound[0].rank;
                var usdPrice = arrFound[0].price_usd * 1;
                var btcPrice = arrFound[0].price_btc.toString().toLocaleString();
                var eth = btcPrice / ethPrice;
                var marketCap = (arrFound[0].market_cap_usd * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                var availSupply = arrFound[0].available_supply; //.toLocaleString();
                var totalSupply = arrFound[0].total_supply; //.toLocaleString();
                var change_24 = arrFound[0].percent_change_24h.toLocaleString();
                var change_1 = arrFound[0].percent_change_1h.toLocaleString();
                var change_7 = arrFound[0].percent_change_7d.toLocaleString();

                const embed = new Discord.RichEmbed()
                  .setTitle(name + " (" + ticker + ") - Rank #" + rank + ' - Market Cap: $' + marketCap)
                  .setURL("https://coinmarketcap.com/currencies/" + id)
                  .setColor(6999039)
                  .addField("BTC Price", '```http\n' + btcPrice + ' BTC```', true)
                  .addField("USD Price", '```http\n$' + usdPrice.toFixed(2) + ' USD```', true)
                  .addField("ETH price", '```http\n' + eth.toFixed(8) + ' ETH```', true)
                  .addField("1h Change", change_1 + ' %', true)
                  .addField("24h Change",  change_24 + ' %', true)
                  .addField("7d Change",  change_7 + ' %', true);
                message.channel.send({embed});
            } else {
                message.channel.send('Unknown token. Please make sure the token ticker is properly spelled and exists on CoinMarketCap.com');
            }
        })

    }

    if(command === '!market' || command ==='!m') {
        var request = require('request');
        var url = "https://api.coinmarketcap.com/v1/global/";

        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const embed = new Discord.RichEmbed()
                  .setTitle("Coinmarketcap.com Market Data")
                  .setURL("https://coinmarketcap.com")
                  .setColor(16764160)
                  .addField("Market Cap ($BN)", '```http\n$' + (body.total_market_cap_usd / 1000000000).toFixed(2) + ' B/USD```', true)
                  .addField("24h Volume ($BN)", '```http\n$' + (body.total_24h_volume_usd / 1000000000).toFixed(2) + ' B/USD```', true)
                  .addField("Active Currencies", '```c\n' + body.active_currencies.toLocaleString() + '```', true)
                  .addField("BTC Dominance", body.bitcoin_percentage_of_market_cap.toLocaleString() + '%', true)
                  .addField("BTC Market Cap", '$' + (body.bitcoin_percentage_of_market_cap * body.total_market_cap_usd / 100).toLocaleString(), true)
                  .addField("See on TradingView", '[BTC/USD](https://www.tradingview.com/symbols/BTCUSD/)' , true);
               message.channel.send({embed});

            }
        })
    }


    if(command === '!btc') {
        var request = require('request');
        request({
          method: 'POST',
          url: 'https://api.coinigy.com/api/v1/ticker',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'd53cd5192343ad55f3d7d23d0b25c253',
            'X-API-SECRET': '20937bc2770b66f642ac990b0426bffe'
          },
          body: "{  \"exchange_code\": \"BTRX\",  \"exchange_market\": \"BTC/USDT\"}"
        }, function (error, response, body) {
          dataset = JSON.parse(body).data;
          var fixedPrice = parseFloat(dataset[0].last_trade).toFixed(2);
          var hiTrade = parseFloat(dataset[0].high_trade).toFixed(2);
          message.channel.send('Current BTC price: $' + fixedPrice + ' USD' );
          message.channel.send('Highest today: $' + hiTrade + ' USD' );
        });
    }

    if(command === '!usd2btc' || command === '!$') {
        var request = require('request');
        request({
          method: 'POST',
          url: 'https://api.coinigy.com/api/v1/ticker',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'd53cd5192343ad55f3d7d23d0b25c253',
            'X-API-SECRET': '20937bc2770b66f642ac990b0426bffe'
          },
          body: "{  \"exchange_code\": \"BTRX\",  \"exchange_market\": \"BTC/USDT\"}"
        }, function (error, response, body) {
          dataset = JSON.parse(body).data;
          var fixedPrice = (args[0]/parseFloat(dataset[0].last_trade)).toFixed(8);
          message.channel.send(args[0] + ' USD = ' + fixedPrice + ' BTC');
        });
    }

    if(command === '!btc2usd' || command === '!b') {
        var request = require('request');
        request({
          method: 'POST',
          url: 'https://api.coinigy.com/api/v1/ticker',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'd53cd5192343ad55f3d7d23d0b25c253',
            'X-API-SECRET': '20937bc2770b66f642ac990b0426bffe'
          },
          body: "{  \"exchange_code\": \"BTRX\",  \"exchange_market\": \"BTC/USDT\"}"
        }, function (error, response, body) {
          dataset = JSON.parse(body).data;
          var fixedPrice = (args[0]*parseFloat(dataset[0].last_trade)).toFixed(2);
          message.channel.send(args[0] + ' BTC = ' + fixedPrice + ' USD');
        });
    }

    if(command === '!percent' || command === '!%') {
        if(args[0] == null || args[1] == null){
            message.channel.send('you need to provide arguments!');
            message.channel.send('Usage:   !percent buy sell');
            message.channel.send('Example: **__!percent 0.080 0.092__** or **__!% 0.080 0.092__**');
            return;
        }
            var buyNum = args[0];
            var sellNum = args[1];

            var percentage = (((sellNum-buyNum)/buyNum)*100).toFixed(2);
          message.channel.send('Result: ' + percentage + '%');
        }

    if(command === '!links' || command === '!l') {
        var fs = require("fs");
        fs.readFile("links.txt", "utf8", function (err, data) {
            if (err) throw err;
            message.author.send(data.toString());
        });
    }

///////////////////////////////// AI SECTION //////////////////////////////
    var phraseString = command + ' ' + msgBody;
//    if((phraseString.indexOf('what') > -1 || phraseString.indexOf('where') > -1) && phraseString.indexOf('signals') > -1) {
//      message.channel.send(message.author.username + ', if you are asking for signals, simply go to the #signals channel.');
//      console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
//    }
    if(phraseString.indexOf('what') > -1 && phraseString.indexOf('tp') > -1 && (phraseString.indexOf('mean') > -1 || phraseString.indexOf('meaning') > -1)) {
        message.channel.send(message.author.username + ', if you are asking what TP means, it stands for Take Profit. You can always do !t for a full list of terms used in crypto trading.');
        console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
    }
//    if((phraseString.indexOf('spreadsheet') > -1 || phraseString.indexOf('tool') > -1) && (phraseString.indexOf('coins') > -1 || phraseString.indexOf('tokens') > -1 || phraseString.indexOf('portfolio') > -1)) {
//        message.channel.send(message.author.username + ', if you are asking for tools to help with trading, simply type !links or !l and I will DM the info to you. You can always type !help for a list of commands.');
//        console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
//    }
//    if(phraseString.indexOf('Ver') > -1) {
//        message.channel.send(message.author.username + ', You kiss your momma with that mouth? Please keep it clean. Thanks.');
//        console.log(formatted + ' > ' + message.author.username + ' wrote: ' + command + ' ' + msgBody);
//    }

})

bot.login(botconfig.token);
