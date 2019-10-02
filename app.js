const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

const botName = 'SpongeBot';
const botPic = 'https://cdn.discordapp.com/avatars/626697323057119244/dcefdb851b9cd88cc9cd19d6275cdbb8.png';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function createMockingText(sentence){
    var mockingText = "";
    var size = Math.random() < 0.5;
    for(char of sentence){
        if(size){
            if(char === 'ß'){
                mockingText += 'ẞ';
            } else {
                mockingText += char.toUpperCase();
            }
            size = false;
        }else{
            mockingText += char;
            size = true;
        }
    }
    return mockingText;
}

function sendWebhookText(text,user,webhook){
    console.log('Trying to send message via webhook');
    return webhook.send(text, {
        username:user.username,
        avatarURL:user.avatarURL
    });
}

async function commandReally(text,channel,user){
    console.log('commandReally');
    var action = text.replace('!really ','');
    var webhook = await channel.createWebhook(botName,botPic);
    await webhook.send('Ich würde gerne '+action,{username:user.username,avatarURL:user.avatarURL});
    await channel.send('Wirklich?');
    await webhook.send('Nö',{username:user.username,avatarURL:user.avatarURL});
    webhook.delete('Not needed');
}

async function commandMock(text,channel,user){
    console.log('commandMock');
    var mockingText = createMockingText(text.replace('!sponge ','').toLowerCase());
    var webhook = await channel.createWebhook(botName,botPic)
    await sendWebhookText(mockingText,user,webhook);
    webhook.delete();
}

async function hashtagTechnology(channel){
    console.log('hashtagTechnology');
    channel.send('',{files: ['./media/technology.gif']});
}

client.on('message', msg => {
    if (msg.content.startsWith('!sponge')) {
        commandMock(msg.content,msg.channel,msg.author);
        msg.delete();
    }else if(msg.content.startsWith('!really')){
        commandReally(msg.content,msg.channel,msg.author);
        msg.delete();
    }else if(msg.content.endsWith('#technology')){
        hashtagTechnology(msg.channel);
    }
});

client.login(token);
