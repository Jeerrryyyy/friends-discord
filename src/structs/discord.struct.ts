import {ApplicationCommandDataResolvable, Client, ClientEvents, Collection} from "discord.js"
import {CommandType} from "../types/command.type";
import {promisify} from "util";
import {glob} from "glob";
import {RegisterCommandOptions} from "../types/client.type";
import {DistubeEvent, Event} from "./event.struct"
import DisTube, {TypedDisTubeEvents} from "distube";

const globPromise = promisify(glob)

export class DiscordClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    distube: DisTube = new DisTube(this, {
        searchSongs: 5,
        searchCooldown: 30,
        leaveOnEmpty: true,
        leaveOnFinish: false,
        leaveOnStop: true
    });

    constructor() {
        super({intents: 32767});
    }

    start() {
        this.registerModules().catch(result => console.log(result))
        this.login(process.env.botToken).catch(result => console.log(result));
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = []
        const commandFiles = await globPromise(`${__dirname}/../commands/*{.ts,.js}`)

        console.log("Loading commands", {commandFiles});

        for (const filePath of commandFiles) {
            const command: CommandType = await this.importFile(filePath);

            if (!command.name) {
                continue;
            }

            this.commands.set(command.name, command);
            slashCommands.push(command);
        }

        this.on('ready', () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });

            console.log("Bot ready... Commands are registered.")
        });

        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

        console.log("Loading events", {eventFiles});

        for (const filePath of eventFiles) {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        }

        const distubeEventFiles = await globPromise(`${__dirname}/../events/distube/*{.ts,.js}`);

        console.log("Loading distube events", {eventFiles});

        for (const filePath of distubeEventFiles) {
            const event: DistubeEvent<keyof TypedDisTubeEvents> = await this.importFile(filePath)
            this.distube.on(event.event, event.run)
        }
    }

    async registerCommands(registerCommandOptions: RegisterCommandOptions) {
        if (registerCommandOptions.guildId) {
            await this.guilds.cache.get(registerCommandOptions.guildId)?.commands.set(registerCommandOptions.commands);
            return;
        }

        await this.application?.commands.set(registerCommandOptions.commands);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
}