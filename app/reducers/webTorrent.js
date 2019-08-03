import type { webTorrent as torrentT, webTorrentStateType as State } from './types';
import {REQUEST_TORRENT, UPDATE_TORRENT} from '../actions/webtorrent';

export default function webTorrent(state: State = {tracked: new Map(), active: null}, action) {
  console.log("Reducing torrents");
  switch (action.type) {
    case REQUEST_TORRENT:
      return requestTorrent(state, action.torrent);
    case UPDATE_TORRENT:
      return updateTorrent(state, action.hash, action.torrent);
    default: return state;
  }
}

function requestTorrent(state: State, torrent: torrentT): State {
  const map = new Map(state.tracked);
  map.set(torrent.hash, torrent);
  const ret = {...state, map};
  console.log("Request:");
  console.log(ret);
  return ret;
}

function updateTorrent(state: State, hash: string, torrent: torrentT): State {
  console.log("updating torrent");
  const map = new Map(state.tracked);
  const t: torrentT = map.get(hash || torrent.hash);
  map.set(hash || torrent.hash, {
    ...t,
    ...torrent
  });
  const val = {...state, t};
  console.log("torrent updated");
  return val;
}
