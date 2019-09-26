const Discord = require('discord.js');
const client = new Discord.Client();
var token = require('./token.json');

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

client.on('message', msg => {
    content = msg.content;
    channel = msg.channel;
    user = msg.author;
    //TODO Replace !sponge with bot mention
    if (content.startsWith('!sponge')) {
        console.log('Trying to fetch webhooks...');
        hook = channel.fetchWebhooks()
            .then(webhooks => {
                console.log('Checking existing Webhooks');
                let hook;
                for(webhook of webhooks.values()){
                    if(webhook.owner.id == client.user.id){
                        console.log('Found valid Webhook');
                        hook = webhook;
                    }
                }
                if(hook==undefined){
                    console.log('Creating new Webhook');
                    //TODO Have to wait until webhook actually got created before using it
                    hook = channel.createWebhook('Example Webhook', 'https://i.imgur.com/p2qNFag.png');
                }
                console.log('Trying to send message via webhook');
                var mockingText = createMockingText(content.replace('!sponge ','').toLowerCase());
                hook.send(mockingText, {
                    username:user.username,
                    avatarURL:user.avatarURL
                });
                msg.delete();
            }
        ).catch(console.error);
    }
});

client.login(token.token);
