import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class ban implements IBotCommand {
    
    private readonly _command = "ban"

    help(): string {
        return "Bans the mentioned user";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {

        let mentionedUser = msgObject.mentions.users.first();
        let suppliedReason = args.slice(1).join(" ") || "";
        let banLog = `${msgObject.author.username}: ${suppliedReason}`;

        if(!msgObject.member.hasPermission("BAN_MEMBERS"))
        {
            msgObject.channel.send(`Hey, ${msgObject.author.username}, you are a normal cat so you can't ban members.`)
        }

        if(!mentionedUser)
        {
            msgObject.channel.send("You call me to ban that user? I could not find him.");
        }

        msgObject.delete(0);

        msgObject.guild.member(mentionedUser).ban(banLog)
        .then(console.log)
        .catch(console.error)
    }
}
