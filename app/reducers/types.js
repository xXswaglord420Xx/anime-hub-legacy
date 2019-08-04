import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Torrent } from '../utils/nyaapi';


export type webTorrent = {
  completed: boolean,
  path: string,
  torrent: string,
  progress: number,
  uploadSpeed: number,
  downloadSpeed: number,
  peers: number,
  hash: string
};

export type nyaaStateType = {
  +torrents: Torrent[],
  +loading: boolean
};

export type webTorrentStateType = {
  +tracked: Map<string, webTorrent>,
  +active: webTorrent
};

export type stateType = {
  +nyaa: nyaaStateType,
  +webTorrent: webTorrentStateType,
  +torrentClient: Object
};

export type Action = {
  +type: string
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
