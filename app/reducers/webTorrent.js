import type { webTorrent as torrentT, webTorrentStateType as State } from './types';
import { REQUEST_TORRENT, UPDATE_TORRENT } from '../actions/webtorrent';

export default function webTorrent(state: State = {tracked: new Map(), active: null}, action) {
  switch (action.type) {
    case REQUEST_TORRENT:
      return requestTorrent(state, action.torrent);
    case UPDATE_TORRENT:
      return updateTorrent(state, action.hash, action.torrent);
    default: return state;
  }
}

function requestTorrent(state: State, torrent: torrentT): State {
  const tracked = new Map(state.tracked);
  tracked.set(torrent.hash, torrent);
  return { ...state, tracked };
}

function updateTorrent(state: State, hash: string, torrent: torrentT): State {
  const tracked = new Map(state.tracked);
  const t: torrentT = tracked.get(hash || torrent.hash);
  tracked.set(hash || torrent.hash, {
    ...t,
    ...torrent
  });
  return {...state, tracked};
}
