import {DistubeEvent} from "../../structs/event.struct";

export default new DistubeEvent('playSong', (queue, song) => {
    console.log("Play song...")
});