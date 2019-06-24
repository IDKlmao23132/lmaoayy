import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import {IBotCommand} from "./api";

const client: Discord.Client = new Discord.Client();

let commands: IBotCommand[] = [];

loadCommands(`${__dirname}/commands`)

client.on("ready", ()=>{

    //Let us know that the bot is online
    console.log("Ready to go now nigga.");
})

client.on("message", msg => {

    //Ingore the message if it was sent by the bot
    if (msg.author.bot) { return; }

    //Ingore messages that don't start with the prefix
    if(!msg.content.startsWith(ConfigFile.config.prefix)) { return; }

    //Handle Command
    handleCommand(msg);
})

async function handleCommand(msg: Discord.Message){

    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    //Loop through all of our loaded commands
    for(const commandsClass of commands){

        //Attempt to execute code but ready in case of a possible error
        try{

            //Check if our command class is the correct one 
            if(!commandsClass.isThisCommand(command)){

                //Go to the next iteration of the loop if this isn't the correct command class
                continue;
            }

            //Pause the execution whilst we run the command code
            await commandsClass.runCommand(args, msg, client);
        }
        catch(exception){

            //If there is  an error, then log the exception
            console.log(exception);
        }
    }
}

function loadCommands(commandsPath: string){

    //Exit if there are no commands
    if(!ConfigFile.config || (ConfigFile.config.commands as string[]).length === 0){ return; }

    //Loop through all of the commands in our config file
    for(const commandName of ConfigFile.config.commands as string[]) {

        //Load the command class
        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        //Cast our custom IBotCommand interface
        const command = new commandsClass() as IBotCommand;

        //Add to our commands list for later when commands are used
        commands.push(command);
    }
}

//Attempt to connect to Discord servers with our token
client.login(ConfigFile.config.token);