import {CommandType} from "../types/command.type";

export class Command {

    constructor(commandType: CommandType) {
        Object.assign(this, commandType)
    }
}