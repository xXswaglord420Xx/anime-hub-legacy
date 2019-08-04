import {ipcRenderer} from 'electron';
import type { webTorrent } from '../reducers/types';

export const REQUEST_TORRENT = "REQUEST_TORRENT";
export const UPDATE_TORRENT = "UPDATE_TORRENT";

type subType = {
  filter: Object => boolean,
  handler: (string, Object) => void
};

const sub = new (function sub() {
  function forwardCb(action) {
    ipcRenderer.on(action, (e, args) => {
      handlers.forEach(({handler, filter}) => filter(args) && handler(action, args));
    });
  }

  forwardCb("torrent-begin");
  forwardCb("torrent-progress");
  forwardCb("torrent-finish");

  const handlers: Array<subType> = [];
  this.subscribe = function subscribe(handler: (string, Object) => void, filter: Object => boolean = () => true) {
    handlers.push({handler, filter});
  };

  this.unsub = function unsubscribe(hand: (string, Object) => void) {
    const index = handlers.findIndex(({handler}) => handler === hand);
    if (index < 0) {
      console.log("not found");
      return;
    }
    handlers.splice(index, 1);
  }
});

export function download(torrent: string, path: string) {
  return async dispatch => {
    function subscriber(action, data) {
      switch (action) {
        case 'torrent-progress':
          onProgress(data);
          break;
        case 'torrent-begin':
          onBegin(data);
          break;
        case 'torrent-finish':
          onFinish(data);
          break;
        default:
          console.log("Unknown dispatch type")
      }
    }

    function onProgress(t) {
      console.log('HECKIN PROGRESS');
      console.log(t);
      dispatch({
        type: UPDATE_TORRENT,
        hash: torrent,
        torrent: {
          progress: t.progress,
          uploadSpeed: t.uploadSpeed,
          downloadSpeed: t.downloadSpeed
        }
      })
    }

    function onBegin(t) {
      console.log("TORRENT BEGIN");
      const tData: webTorrent = {
        completed: false,
        progress: 0,
        path,
        torrent,
        peers: t.numPeers,
        uploadSpeed: t.uploadSpeed,
        downloadSpeed: t.downloadSpeed,
        hash: torrent
      };

      dispatch({
        type: REQUEST_TORRENT,
        torrent: tData
      })
    }

    function onFinish() {
      console.log("TORRENT FINISH");
      dispatch({
        type: UPDATE_TORRENT,
        hash: torrent,
        torrent: {
          completed: true
        }
      });

      sub.unsub(subscriber);
      // ipcRenderer.removeListener('torrent-progress', onProgress);
    }

    sub.subscribe(subscriber, data => data.id === torrent);
    console.log("Setting up listeners");
    // ipcRenderer.once('torrent-begin', );
    // ipcRenderer.on('torrent-progress', (e, t) => onProgress(t));

    // ipcRenderer.once('torrent-finish', (e, t) => );


    ipcRenderer.send('request-torrent', {
      magnet: torrent, path
    });
  }
}
