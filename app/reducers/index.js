// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import schedule from './schedule';
import nyaa from './weeb'
import webTorrent from './webTorrent'
import auth from "./auth";
import notifications from "./notifications";
import library from "./library";
import settings from './settings';

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    nyaa,
    webTorrent,
    schedule,
    auth,
    notifications,
    library,
    settings
  });
}
