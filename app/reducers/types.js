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

export type animeStateType = {
  id: number,
  title: {
    romaji: string,
    native: string,
    english: string
  },
  coverImage: {
    extraLarge: string
  },
  nextAiringEpisode: {
    episode: number,
    timeUntilAiring: number
  }
};

export type scheduleStateType = {
  currentPage: number,
  hasNextPage: boolean,
  media: animeStateType[],
  fetching: boolean
};

export type webTorrentStateType = {
  +tracked: Map<string, webTorrent>,
  +active: webTorrent
};

export type stateType = {
  +nyaa: nyaaStateType,
  +webTorrent: webTorrentStateType,
  +torrentClient: Object,
  +schedule: scheduleStateType
};

export type Action = {
  +type: string
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
