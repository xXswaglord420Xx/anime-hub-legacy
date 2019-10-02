import WebTorrent from "webtorrent";
import {BrowserWindow, ipcMain, app} from "electron";
import {join} from "path";
import {readFile, writeFile} from "fs";
import Ref from "./ref";


export default class TorrentClient {
  constructor(windowRef: Ref<BrowserWindow>, listenIpc = true) {
    this.windowRef = windowRef;
    this.client = new WebTorrent();
    this.torrents = [];

    this.windowRef.on('change', win => win&& this.updateWindowState(win));

    this.reviveTorrents().catch(console.error);

    if (listenIpc) {
      ipcMain.on('torrent:request', this.updateWindowState(windowRef.get()));
      ipcMain.on('torrent:modify', async (event, {type, id, resourceId, path}) => {
        switch (type) {
          case 'new':
            for await (const torrent of this.pushTorrent(resourceId, path)) {
              this.updateTorrent(torrent);
            }
            break;
          case 'remove':
            this.removeTracked(id);
            break;

          default:
            console.log(`Unknown type ${type}`);
        }
      })
    }
  }

  reviveTorrents() {
    return new Promise((resolve, reject) => {
      try {
        const path = join(app.getPath("userData"), "torrents.json");
        readFile(path, (err, data) => {
          if (err) return reject(err);
          const torrents = JSON.parse(data);
          torrents.forEach(torrent => {
            if (torrent.progress !== 1.0) {
              this.enqueueTorrent(torrent.id, join(torrent.path, torrent.name))
            } else {
              this.torrents.push(torrent);
            }
          })
        })
      } catch (e) {
        console.error(e);
      }
    });
  }

  saveTorrents() {
    return new Promise((resolve, reject) => {
      const path = join(app.getPath("userData"), "torrents.json");
      writeFile(path, JSON.stringify(this.torrents.map(TorrentClient.serialiseTorrent)), (err, data) => {
        if (err) return reject(err);
        resolve(data);
      })
    })
  }

  async enqueueTorrent(id, path) {
    for await (const torrent of this.pushTorrent(id, path)) {
      this.updateTorrent(torrent)
    }
  }

  updateWindowState(win: BrowserWindow) {
    console.log("Updating window state");
    win.webContents.send('state:torrent', {
      type: 'revive',
      torrent: this.torrents.map(TorrentClient.serialiseTorrent)
    })
  }

  updateTorrent(t) {
    if (this.windowRef.exists()) {
      this.windowRef.get().webContents.send('state:torrent', {
        type: 'update',
        torrent: TorrentClient.serialiseTorrent(t),
        id: t.infoHash || throw new Error("No info hash?")
      })
    }

  }

  removeTracked(id) {
    const i = this.torrents.findIndex(t => t.id === id);
    if (i >= 0) {
      const t = this.torrents[i];
      const {infoHash} = t;
      t.destroy();
      this.torrents.splice(i, 1);
      if (this.windowRef.exists()) {
        this.windowRef.get().webContents.send('state:torrent', {
          type: 'remove',
          id: infoHash || throw new Error("No info hash?")
        })
      }
    }
  }

  async *pushTorrent(magnet: string, path: string) {
    function anyPromise(...promises: Promise<any>) {
      return new Promise((resolve, reject) => {
        promises.forEach(p => p.then(s => resolve([s, p])).catch(e => reject([e, p])));
      });
    }

    const torrent = await this.addTorrent(magnet, path);
    // const progress = () => new Promise(resolve => torrent.once('download', resolve));
    const progress = () => new Promise(resolve => setTimeout(resolve, 1000));
    const done = new Promise(resolve => torrent.once('done', resolve));

    while (true) {
      const [, p] = await anyPromise(progress(), done);

      if (p === done) {
        yield {...torrent, progress: 1.0};
        break;
      } else {
        yield torrent;
      }
    }
    torrent.destroy();
  }

  addTorrent(magnet: string, path: string) {
    return new Promise(resolve => {
      this.client.add(magnet, {path}, t => {
        const tDone = () => {
          this.torrents.push(t);
          resolve(t);
        };
        if (t.infoHash) {
          tDone();
        } else {
          t.once('infoHash', tDone);
        }
      })
    });
  }

  close() {
    return new Promise(resolve => this.client.destroy(resolve));
  }

  static serialiseTorrent(torrent) {
    const {progress, downloadSpeed, uploadSpeed, numPeers: peers, infoHash: id, path, name} = torrent;
    return {progress, downloadSpeed, uploadSpeed, peers, id, path, name};
  }
}
