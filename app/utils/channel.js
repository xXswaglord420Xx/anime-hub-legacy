import {ipcRenderer} from "electron";

const pendingMessages = new Map();
const channels = new Map();

ipcRenderer.on('rpc:reply', (event, {channel, id, payload: {error, result, progress}}) => {
  console.log(`Logging reply for event at channel ${channel} of id ${id}`);
  const pendingMessage = pendingMessages.get(JSON.stringify({channel, id})); // jesus fuck why is javascript like this
  if (error) {
    pendingMessage.reject(error);
  } else if (result) {
    pendingMessage.resolve(result);
  } else if (progress) {
    if (pendingMessage.promise.onProgress) pendingMessage.promise.onProgress(progress);
  }
});

export default class Channel {
  constructor(channel) {
    if (channels.has(channel)) {
      return channels.get(channel);
    }
    this.channel = channel;
    channels.set(channel, this);
  }

  request(arg) {
    const key = {
      channel: this.channel,
      id: ++this.__seq_id
    };

    let val = {};

    const promise = new Promise((resolve, reject) => {
      console.log(`hte promis has ben sente`);
      val = {resolve, reject};
    });

    val = {...val, promise};

    pendingMessages.set(JSON.stringify(key) /* im just tempted to install a third party solution at this point */, val);
    console.log(pendingMessages);
    console.log(`THE KEY HAS BEEN SET AND THE RENDERER SHALL NOW BE INVOKENED`);

    ipcRenderer.send('rpc:request', {
      ...key,
      payload: arg
    });

    return promise;
  }

  __seq_id = 0;
}

