import {Command} from "../structs/command.struct";

export default new Command({
    name: 'ping',
    description: 'replies with the current discord gateway ping',
    run: (commandRunOptions) => {
        commandRunOptions.commandInteraction
            .followUp(`The current discord gateway ping is ${Math.round(commandRunOptions.discordClient.ws.ping)}ms🏓`)
            .catch(result => console.log(result));
    }
})