import Channel from "./channel";

const channel = new Channel('discord:rpc:remote');

const updatePresence = presence => channel.request({command: 'update-presence', presence});

export {updatePresence};
