import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver, GuildMember,
    PermissionResolvable
} from "discord.js";
import {DiscordClient} from "../structs/discord.struct";

interface CommandRunOptions {
    discordClient: DiscordClient,
    commandInteraction: ExtendedCommandInteraction,
    args: CommandInteractionOptionResolver
}

type CommandRunFunction = (commandRunOptions: CommandRunOptions) => any;

export interface ExtendedCommandInteraction extends CommandInteraction {
    member: GuildMember;
}

export type CommandType = {
    userPermissions?: PermissionResolvable[],
    run: CommandRunFunction
} & ChatInputApplicationCommandData