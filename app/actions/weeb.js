// @flow
import {search} from '../utils/nyaapi'

export const FIND_TORRENTS = "ADD_TORRENTS";
export const LOAD_TORRENTS = "LOAD_TORRENTS";

function addTorrents(torrents) {
  return {
    type: FIND_TORRENTS,
    torrents
  }
}


export function findTorrents(term, opts) {
  return async (dispatch) => {
    dispatch({
      type: LOAD_TORRENTS
    });
    const {torrents} = await search(term, opts);
    dispatch(addTorrents(torrents));
  }
}


