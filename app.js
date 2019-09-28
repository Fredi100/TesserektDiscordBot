const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

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

function sendMockingText(text,user,webhook){
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
        hook = channel.fetchWebhooks()
            .then(webhooks => {
                console.log('Checking existing Webhooks');
                let hook;
                for(webhook of webhooks.values()){
                    if(webhook.owner.id == client.user.id){
                        console.log('Found valid Webhook');
                        sendMockingText(mockingText,user,webhook).then(msg.delete());
                        return;
                    }
                }

                console.log('Creating new Webhook');
                channel.createWebhook('SpongeBot', 'https://i.imgur.com/p2qNFag.png')
                    .then(webhook => sendMockingText(mockingText,user,webhook))
                    .then(msg.delete()
                );
            }
        ).catch(console.error);
    }
});

client.login(token);
