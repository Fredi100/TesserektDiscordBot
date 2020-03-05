import { IBotModule } from './IBotModule';
import { Message, Channel, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import fs = require('fs');

export class MeshinBot extends IBotModule {

    constructor(commandCharakter: string) {
        super(commandCharakter);

        this.addCommand(this,'meshin', this.commandMeshin);
    }

    executeHashtag(hashtag: string, message: Message): void {
        throw new Error("Module does not contain Hashtags");
    }

    // TODO Write MeshinBot Help text
    getHelpText() {
        return 'Insert MeshinBot help text';
    }

    public getRandomInt(min: number, max: number): number {
        console.log('Generating random number');
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Command meshin
     * Prints a randomly chosen buzzword
     * 
     * @param message The message of the user
     */
    private commandMeshin(message: Message) {
        let buffer: string = fs.readFileSync('buzzwords.json').toString();
        let jsonContent = JSON.parse(buffer);
        let text: string = jsonContent.text;

        let randomNumber: number = this.getRandomInt(0, jsonContent.amount);
        let buzzword: string = jsonContent.buzzwords[randomNumber];

        message.channel.send(text.concat("\n", buzzword));
    }
}