// @flow
import search from '../utils/nyaapi'

export const FIND_TORRENTS = "ADD_TORRENTS";
export const LOAD_TORRENTS = "LOAD_TORRENTS";

function addTorrents(torrents) {
  return {
    type: FIND_TORRENTS,
    torrents
  }
}

const wait = delay => new Promise(resolve => setTimeout(() => resolve(), delay));

export function findTorrents(term, opts) {
  return async (dispatch) => {
    dispatch({
      type: LOAD_TORRENTS
    });
    await wait(2000);
    const torrents = await search(term, opts);
    dispatch(addTorrents(torrents));
  }
}


