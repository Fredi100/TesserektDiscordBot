const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

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

client.on('message', msg => {
    content = msg.content;
    channel = msg.channel;
    user = msg.author;
    //TODO Replace !sponge with bot mention
    if (content.startsWith('!sponge')) {
        var mockingText = createMockingText(content.replace('!sponge ','').toLowerCase());
        console.log('Trying to fetch webhooks...');
        channel.fetchWebhooks().then(webhooks => {
            console.log('Checking existing Webhooks');
            let hook;
            for(webhook of webhooks.values()){
                if(webhook.owner.id == client.user.id){
                    console.log('Found valid Webhook');
                    sendWebhookText(mockingText,user,webhook).then(msg.delete());
                    return;
                }
            }

            console.log('Creating new Webhook');
            channel.createWebhook('SpongeBot', botPic)
                .then(webhook => sendWebhookText(mockingText,user,webhook))
                .then(msg.delete()
            );
        }).catch(console.error);
    }else if(content.startsWith('!really')){
        //TODO Hier den text vom user lesen
        //TODO Danach 3 Nachrichten verschicken
        //TODO Erste Nachricht im Namen des Users
        // Ich würde gerne [action]
        //TODO Zweite Nachricht vom Bot selber
        // Wirklich?
        // TODO Dritte Nachricht im Namen des Users
        // Nein...
        // TODO Command selber wieder löschen
    }
});

client.login(token);
