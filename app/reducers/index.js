// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import schedule from './schedule';
import weeb from './weeb'
import webTorrent from './webTorrent'
import auth from "./auth";
import notifications from "./notifications";

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    nyaa: weeb,
    webTorrent,
    schedule,
    auth,
    notifications
  });
}
