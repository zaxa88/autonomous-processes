const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const tweetConfig = require('./tweetconfig.json');
const tweet = require('twit')
var endOfLine = require('os').EOL;
const bot = new Discord.Client();
var request = require('request');
const privMsg = false;
const T = new tweet(require('./config.js'));

var stream = T.stream('statuses/filter', { follow: ['950433246113869824','957704053605232645'] })
//comma delimited filters like this: { track|follow: ['@JewKorean', '#trading', '$crypto'] })

stream.on('tweet', function (tweet) {
  try {
        if(tweet.text.indexOf("@") == -1) {  //filter out retweets and @mentions as we don't need it for this.
                bot.channels.find("name", "coin-listings").send(tweet.text);
        }
        console.log(tweet.text);
  } catch(e){
      console.log(e);
  }
})

bot.on('ready', () => {
        bot.user.setGame('autorefresh');
        console.log(' > ' + bot.user.username + ' ready.');
});


bot.login(botconfig.token);
