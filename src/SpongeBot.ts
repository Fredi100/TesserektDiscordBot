import { IBotModule } from './IBotModule';
import { TextChannel, DMChannel, GroupDMChannel, Message, User } from 'discord.js';

export class SpongeBot extends IBotModule {

    private botName: string;
    private botPic: string;

    constructor(commandCharacter: string, botName: string, botPic: string) {
        super(commandCharacter);
        this.botName = botName;
        this.botPic = botPic;

        this.addCommand(this,'sponge',this.commandSponge);
        this.addCommand(this,'really', this.commandReally);
        this.addHashtag(this,'technology',this.hashtagTechnology);
        this.addHashtag(this,'future',this.hashtagFuture);
        this.addHashtag(this,'imagination',this.hashtagImagination);
    }

    // TODO Write MeshinBot Help text
    getHelpText() {
        return 'Insert MeshinBot help text';
    }


    // Takes a sentence as a String and mocks it
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

    /**
     * Command really
     * Takes the sentence of the user and makes a joke with it
     * 
     * @param message The message sent by the user
     */
    private async commandReally(message: Message) {
        let channel: TextChannel = <TextChannel>message.channel;
        let text: string = message.content;
        let user: User = message.author;

        message.delete();

        var action = text.replace('!really ', '');
        var webhook = await channel.createWebhook(this.botName, this.botPic);
        await webhook.send('Ich würde gerne ' + action, { username: user.username, avatarURL: user.avatarURL });
        await channel.send('Wirklich?');
        await webhook.send('Nö', { username: user.username, avatarURL: user.avatarURL });
        
        webhook.delete('Not needed');
    }

    /**
     * Command sponge
     * Takes the sentence of the user and mocks it
     * 
     * @param message The message sent by the user
     */
    private async commandSponge(message: Message) {
        let channel: TextChannel = <TextChannel> message.channel;
        let text: string = message.content;
        let user: User = message.author;

        message.delete();

        var mockingText = this.createMockingText(text.replace('!sponge ', '').toLowerCase());
        var webhook = await channel.createWebhook(this.botName, this.botPic)
        await this.sendWebhookText(mockingText, user, webhook);
        
        webhook.delete();
    }

    /**
     * Hashtag technology
     * Sends a technology gif
     * 
     * @param channel The message of the user
     */
    private hashtagTechnology(message: Message) {
        message.channel.send('', { files: ['./media/technology.gif'] });
    }

    /**
     * Hashtag future
     * Sends a future gif
     * 
     * @param channel The message of the user
     */
    private hashtagFuture(message: Message) {
        message.channel.send('', { files: ['./media/future.gif'] });
    }

    /**
     * Hashtag imagination
     * Sends an imagination gif
     * 
     * @param channel The message of the user
     */
    private hashtagImagination(message: Message) {
        message.channel.send('', { files: ['./media/imagination.gif'] });
    }

}