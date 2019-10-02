import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Torrent } from '../utils/nyaapi';

export type Authorization = {
  token: string,
  refresh_token: string,
  username: string,
  issuedAt: Date,
  loginStatus: 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGED_OUT' | 'ERROR'
};

export type webTorrent = {
  completed: boolean,
  path: string,
  torrent: string,
  progress: number,
  uploadSpeed: number,
  downloadSpeed: number,
  peers: number,
  id: string,
  name: string
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

export type actionableType = {
  text: string,
  onAction: any => void
};

export type notificationsType = {
  snackbar: {
    text: string,
    actions: actionableType[]
  }
};

export type stateType = {
  +nyaa: nyaaStateType,
  +webTorrent: webTorrentStateType,
  +schedule: scheduleStateType,
  +auth: Authorization,
  +notifications: notificationsType
};

export type Action = {
  +type: string
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
