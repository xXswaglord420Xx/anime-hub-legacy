import type {Authorization as State} from "./types";
import {BEGIN_LOGIN, UPDATE_TOKEN, LOGIN_ERROR, LOGIN_SUCCESS, LOG_OUT} from "../actions/auth";

export default function (state: State = {loginStatus: "LOGGED_OUT"}, action): State {
  switch (action.type) {
    case BEGIN_LOGIN:
      return {...state, loginStatus: "LOGGING_IN"};
    case LOGIN_SUCCESS:
      return {...state, loginStatus: "LOGGED_IN", username: action.username};
    case LOGIN_ERROR:
      return {...state, loginStatus: "ERROR"};
    case UPDATE_TOKEN:
      return {...state, token: action.token, refresh_token: action.refresh_token};
    case LOG_OUT:
      return {...state, token: null, refresh_token: null, username: null, loginStatus: "LOGGED_OUT"};
    default:
      return state;
  }
}
