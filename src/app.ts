import 'reflect-metadata';
import { Discord, On, Client } from '@typeit/discord';
import { Message } from 'discord.js';
import { config } from 'dotenv';
import { MeshinBot } from './MeshinBot';
import { SpongeBot } from './SpongeBot';
import { IBotModule } from './IBotModule';


@Discord
export class TesserektBot {
    private static _client: Client;
    private botName = 'TesserektBot';
    private botPic = 'https://cdn.discordapp.com/avatars/626697323057119244/dcefdb851b9cd88cc9cd19d6275cdbb8.png'; // Change to a general Pic
    private commandTrigger = '!';

    private modules: Set<IBotModule>;

    constructor(){
        this.modules = new Set<IBotModule>();
        this.modules.add(new MeshinBot(this.commandTrigger));
        this.modules.add(new SpongeBot(this.commandTrigger,this.botName, this.botPic));
    }

    static start(token: string) {
        this._client = new Client();
        this._client.login(token);
    }

    @On('ready')
    async onReady(client: Client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setStatus('online');
        client.user.setPresence({
            game: {
                name: 'GitHub',
                type: 'WATCHING',
                url: 'https://github.com/Fredi100/TesserektDiscordBot'
            }
        })
    }

    @On('message')
    async onMessage(message: Message, client: Client) {
        if (message.content.startsWith(this.commandTrigger+'hellp')) {
            message.channel.sendMessage('Hier steht ne Hilfe Nachricht');
        }else if (message.content.startsWith(this.commandTrigger+'help')) {
            // TODO Get all help message from all the bot modules
        }else if(message.content.startsWith(this.commandTrigger)){ //Message is a command
            let commandEnd: number = message.content.indexOf(' ');
            if(commandEnd == -1) commandEnd = message.content.length;
            let command: string = message.content.substring(1,commandEnd);

            this.modules.forEach(module => {
                if(module.hasCommand(command)) module.executeCommand(command, message);
            });
        }else if(message.content.includes('#')){ //Message has a hashtag
            let hashtagBegin: number = message.content.indexOf('#');
            let hashtagEnd: number = message.content.indexOf(' ', hashtagBegin);
            if(hashtagEnd == -1) hashtagEnd = message.content.length;
            let hashtag: string = message.content.substring(hashtagBegin+1,hashtagEnd);

            console.log('Hashtag found: '.concat(hashtag));

            for(let module of this.modules){
                if(module.hasHashtag(hashtag)){
                    module.executeHashtag(hashtag, message);
                }
            }
        }
    }
}

config();

TesserektBot.start(process.env.TOKEN);