require("dotenv").config();
import {DiscordClient} from "./structs/discord.struct";

export const discordClient = new DiscordClient();
discordClient.start();