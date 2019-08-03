// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import weeb from './weeb'
import webTorrent from './webTorrent'

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    counter,
    nyaa: weeb,
    webTorrent
  });
}
