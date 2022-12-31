import {Event} from "../structs/event.struct";
import {discordClient} from "../index";
import {CommandInteractionOptionResolver} from "discord.js";
import {ExtendedCommandInteraction} from "../types/command.type";

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        await interaction.deferReply();

        const command = discordClient.commands.get(interaction.commandName);

        if (!command) {
            return interaction.followUp("This command does not exist!")
        }

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            discordClient,
            commandInteraction: interaction as ExtendedCommandInteraction
        })
    }
})