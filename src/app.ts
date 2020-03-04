import 'reflect-metadata';
import { Discord,On,Client } from '@typeit/discord';
import { Message } from 'discord.js';
import { config } from 'dotenv';

@Discord
export class TesserektBot {
    private static _client: Client;

    static start(token: string){
        this._client = new Client();
        this._client.login(token);
    }

    @On('message')
    async onMessage(message: Message, client: Client){
        if(message.content.startsWith('!help')){
            message.channel.sendMessage('Hier steht ne Hilfe Nachricht');
        }
    }

}

config();

TesserektBot.start(process.env.TOKEN);