require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
//const TOKEN = process.env.TOKEN;

// TODO Maybe not necessary to save this as I don't work with webhooks this time
const botName = 'MeshinBot';
// TODO Find fitting Pic
const botPic = '';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function parseBuzzwordsJson(){
    var contents = fs.readFileSync('buzzwords.json');
    return JSON.parse(contents);
}

function getRandomBuzzword(){
    var jsonContent = parseBuzzwordsJson();

    var randomNumber = getRandomInt(0,jsonContent.amount);

    return jsonContent.buzzwords[randomNumber];
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', msg => {
    if(msg.content === "!meshin"){
        var text = parseBuzzwordsJson().text;
        var buzzword = getRandomBuzzword();

        msg.channel.send(text.concat("\n",buzzword));
    }
})

client.login(TOKEN);
