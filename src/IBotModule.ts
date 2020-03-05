import { Message } from 'discord.js';

export abstract class IBotModule{

    protected commandCharacter: string;
    private commands: Map<string,Function>;
    private hashtags: Map<string,Function>;

    constructor(commandCharacter: string){
        this.commandCharacter = commandCharacter;
        this.commands = new Map<string,Function>();
        this.hashtags = new Map<string,Function>();
    }

    protected addCommand(botModule: IBotModule,command: string, commandFunction: Function){
        this.commands.set(command, commandFunction.bind(botModule));
    }

    protected addHashtag(botModule: IBotModule,hashtag: string, hashtagFunction: Function){
        this.hashtags.set(hashtag, hashtagFunction.bind(botModule));
    }
    
    hasCommand(command: string): boolean{
        return this.commands.has(command);
    }

    hasHashtag(hashtag: string): boolean{
        return this.hashtags.has(hashtag);
    }

    /**
     * Tries to execute the given command
     * 
     * @param command The command invoked by the user
     * @param message The message which invoked the command
     */
    executeCommand(command: string, message: Message){
        this.commands.get(command)(message);
    }

    /**
     * Tries to execute the given hashtag
     * 
     * @param hashtag The hashtag invoked by the user
     * @param message The message which invoked the hashtag
     */
    executeHashtag(hashtag: string, message: Message){
        this.hashtags.get(hashtag)(message);
    }

    /**
     * Compiles a help message for this module
     */
    abstract getHelpText(): string;
}