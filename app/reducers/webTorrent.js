import type { webTorrent as torrentT, webTorrentStateType as State } from './types';
import { REQUEST_TORRENT, UPDATE_TORRENT } from '../actions/webtorrent';

export default function webTorrent(state: State = {tracked: {}, active: null}, action) {
  switch (action.type) {
    case REQUEST_TORRENT:
      return requestTorrent(state, action.torrent);
    case UPDATE_TORRENT:
      return updateTorrent(state, action.id, action.torrent);
    default: return state;
  }
}

function requestTorrent(state: State, torrent: torrentT): State {
  const tracked = {...state.tracked};
  tracked[torrent.id] = torrent;
  return { ...state, tracked };
}

function updateTorrent(state: State, hash: string, torrent: torrentT): State {
  const tracked = {...state.tracked};
  const t: torrentT = tracked[hash?? torrent.id];
  tracked[hash || torrent.id] = {
    ...t,
    ...torrent
  };
  return {...state, tracked};
}
