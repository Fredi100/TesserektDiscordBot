const Discord = require('discord.js');
const client = new Discord.Client();
var token = require('./token.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith('!sponge')) {
        var sentence = msg.content.replace('!sponge ','').toLowerCase();
        var sponge_text = "";
        var size = Math.random() < 0.5;
        for(char of sentence){
            if(size){
                if(char === 'ß'){
                    sponge_text += 'ẞ';
                } else {
                    sponge_text += char.toUpperCase();
                }
                size = false;
            }else{
                sponge_text += char;
                size = true;
            }
        }
        //msg.edit(sponge_text);
        //TODO Replace user message with spongebob text
        msg.reply(sponge_text);
    }
});

client.login(token.token);
