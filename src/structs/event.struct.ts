import {ClientEvents} from "discord.js";
import {Awaitable, DisTubeEvents, TypedDisTubeEvents} from "distube";

export class Event<Key extends keyof ClientEvents> {

    constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => any
    ) {
    }
}

export class DistubeEvent<Key extends keyof TypedDisTubeEvents> {

    constructor(
        public event: Key,
        public run: (...args: DisTubeEvents[Key]) => any
    ) {
    }
}