import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class kick implements IBotCommand {
    
    private readonly _command = "kick"

    help(): string {
        return "Kicks the mentioned user";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {

        let mentionedUser = msgObject.mentions.users.first();
        let suppliedReason = args.slice(1).join(" ") || "";
        let kickLog = `${msgObject.author.username}: ${suppliedReason}`;

        if(!msgObject.member.hasPermission("KICK_MEMBERS"))
        {
            msgObject.channel.send(`Hey, ${msgObject.author.username}, you are a normal cat so you can't kick out members.`)
        }

        if(!mentionedUser)
        {
            msgObject.channel.send(`You call me to kick a user? I could not find this user.`);
            return;
        }

        msgObject.delete(0);

        msgObject.guild.member(mentionedUser).kick(kickLog)
        .then(console.log)
        .catch(console.error)
    }
}
