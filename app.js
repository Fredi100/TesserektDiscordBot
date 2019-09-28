const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //Here we can do inital stuff that may be needed for other functions
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

function sendMockingText(text,user,webhook){
    console.log('Trying to send message via webhook');
    webhook.send(text, {
        username:user.username,
        avatarURL:user.avatarURL
    });
}

client.on('message', msg => {
    content = msg.content;
    channel = msg.channel;
    user = msg.author;
    //TODO seperate different commands into different modules
    if (content.startsWith('!sponge')) {
        text = createMockingText(content.replace('!sponge ','').toLowerCase());
        console.log('Trying to fetch webhooks...');
        channel.fetchWebhooks()
            .then(webhooks => {
                console.log('Checking existing Webhooks');
                let needHook = true;
                for(webhook of webhooks.values()){
                    if(webhook.owner.id == client.user.id){
                        needHook = false;
                        console.log('Found valid Webhook');
                        sendMockingText(text,user,webhook);
                    }
                }
                if(needHook){
                    console.log('Creating new Webhook');
                    channel.createWebhook('SpongeBot', 'https://i.imgur.com/p2qNFag.png')
                        .then(webhook =>{
                            sendMockingText(text,user,webhook)
                        });
                }
            }
        ).catch(console.error);
        msg.delete();
    }
});

console.log('Logging in...');
client.login(token).catch(console.error);
