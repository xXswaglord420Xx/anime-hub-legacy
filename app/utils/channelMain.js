import {ipcMain} from "electron";

class __A {
  constructor() {
    const handlers = new Map();
    this.handlers = handlers;
    ipcMain.on('rpc:request', async (event, {channel, id, payload}) => {
      const handler = handlers.get(channel);
      try {
        const res = handler(payload);
        const pf = progress => event.sender.send('rpc:reply', {channel, id, payload: {progress}});
        if (res.on && res.then && res.removeListener) {
          res.on('progress', pf)
        }

        const result = await res;
        if (res.removeListener) res.removeListener('progress', pf);
        console.log(`arrr sending thay response result`);
        console.log(result);
        event.sender.send('rpc:reply', {channel, id, payload: {result}});
      } catch (error) {
        console.error(`whoopty error gottened`);
        console.error(error);
        event.sender.send('rpc:reply', {channel, id, payload: {error}})
      }
    });
  }

  addHandler(channel, handler) {
    this.handlers.set(channel, handler)
  }
}

export default new __A();
