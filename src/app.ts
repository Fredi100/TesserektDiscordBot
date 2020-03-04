import 'reflect-metadata';
import { Discord, On, Client } from '@typeit/discord';
import { Message } from 'discord.js';
import { config } from 'dotenv';
import fs = require('fs');

@Discord
export class TesserektBot {
    private static _client: Client;
    private botName = 'TesserektBot';
    private botPic = 'https://cdn.discordapp.com/avatars/626697323057119244/dcefdb851b9cd88cc9cd19d6275cdbb8.png'; // Change to a general Pic


    static start(token: string) {
        this._client = new Client();
        this._client.login(token);
    }

    @On('ready')
    async onReady(client: Client) {
        console.log(`Logged in as ${client.user.tag}!`);
    }

    @On('message')
    async onMessage(message: Message, client: Client) {
        if (message.content.startsWith('!help')) {
            message.channel.sendMessage('Hier steht ne Hilfe Nachricht');
        }

        if (message.content === "!meshin") {
            var text = this.parseBuzzwordsJson().text;
            var buzzword = this.getRandomBuzzword();

            message.channel.send(text.concat("\n", buzzword));
        }
        if (message.content.startsWith('!sponge')) {
            this.commandMock(message.content, message.channel, message.author);
            message.delete();
        } else if (message.content.startsWith('!really')) {
            this.commandReally(message.content, message.channel, message.author);
            message.delete();
        } else if (message.content.endsWith('#technology')) {
            this.hashtagTechnology(message.channel);
        } else if (message.content.endsWith('#future')) {
            this.hashtagFuture(message.channel);
        } else if (message.content.endsWith('#imagination')) {
            this.hashtagImagination(message.channel);
        }
    }

    ////
    // MeshinBot
    ////

    public getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public parseBuzzwordsJson() {
        var contents = fs.readFileSync('buzzwords.json').toString();
        return JSON.parse(contents);
    }

    public getRandomBuzzword() {
        var jsonContent = this.parseBuzzwordsJson();

        var randomNumber = this.getRandomInt(0, jsonContent.amount);

        return jsonContent.buzzwords[randomNumber];
    }

    ////
    // SpongeBot
    ////

    // Takes a sentance as a String and mocks it
    public createMockingText(sentence: string) {
        var mockingText = "";
        var size = Math.random() < 0.5;
        for (let char of sentence) {
            if (size) {
                if (char === 'ß') {
                    mockingText += 'ẞ';
                } else {
                    mockingText += char.toUpperCase();
                }
                size = false;
            } else {
                mockingText += char;
                size = true;
            }
        }
        return mockingText;
    }

    // Takes a text, the user the bot should impersonate and the given webhook to send it to
    public sendWebhookText(text, user, webhook) {
        console.log('Trying to send message via webhook');
        return webhook.send(text, {
            username: user.username,
            avatarURL: user.avatarURL
        });
    }

    public async  commandReally(text, channel, user) {
        console.log('commandReally');
        var action = text.replace('!really ', '');
        var webhook = await channel.createWebhook(this.botName, this.botPic);
        await webhook.send('Ich würde gerne ' + action, { username: user.username, avatarURL: user.avatarURL });
        await channel.send('Wirklich?');
        await webhook.send('Nö', { username: user.username, avatarURL: user.avatarURL });
        webhook.delete('Not needed');
    }

    public async  commandMock(text, channel, user) {
        console.log('commandMock');
        var mockingText = this.createMockingText(text.replace('!sponge ', '').toLowerCase());
        var webhook = await channel.createWebhook(this.botName, this.botPic)
        await this.sendWebhookText(mockingText, user, webhook);
        webhook.delete();
    }

    public async  hashtagTechnology(channel) {
        console.log('hashtagTechnology');
        channel.send('', { files: ['./media/technology.gif'] });
    }

    public async  hashtagFuture(channel) {
        console.log('hashtagFuture');
        channel.send('', { files: ['./media/future.gif'] });
    }

    public async  hashtagImagination(channel) {
        console.log('hashtagImagination');
        channel.send('', { files: ['./media/imagination.gif'] });
    }

}

config();

TesserektBot.start(process.env.TOKEN);