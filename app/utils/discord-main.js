import rpc from 'discord-rpc'
import ipc from "./channelMain";

if (process.type !== 'browser') {
  throw new Error("This can only be imported in the main process heck u and ur children");
}

let __initialised = false;

export default async (clientId) => {
  if (__initialised === true) {
    throw new Error('please dont do this my love');
  }

  const instance = new rpc.Client({transport: 'ipc'});

  for (let i = 0; i < 5; ++i) { // not sure why but sometimes it times out even though im connected to discord so lets give it a couple tries i guess
    try {
      await instance.login({clientId});
      break;
    } catch (ignored) {
      console.error(`Failed to connect with attempt ${i + 1} of 5`)
    }
  }

  const updatePresence = presence => instance.setActivity(presence);

  ipc.addHandler('discord:rpc:remote', async payload => {
    switch (payload.command) {
      case 'update-presence':
        return updatePresence(payload['presence']);
      case 'bake-cookies':
        return 'cookies';
      default:
        return 'uwu'
    }
  });

  __initialised = true;
};
