import Channel from '../utils/channel'

export const UPDATE_TOKEN = "UPDATE_TOKEN";
export const BEGIN_LOGIN = "BEGIN_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOG_OUT = 'LOGGED_OUT';
export const LOGIN_ERROR = "LOGIN_ERROR";

export function updateToken(token, refresh_token) {
  return {
    type: UPDATE_TOKEN,
    token,
    refresh_token
  }
}

export function signOut() {
  return async dispatch => {
    dispatch({type: LOG_OUT});
    const channel = new Channel('session:auth');
    channel.request({type: 'signOut'});
  }
}

export function signUp(login, pass, username) {
  return async dispatch => {
    console.log('dispatching the owo');
    dispatch({type: BEGIN_LOGIN});
    console.log('connecting to channel owo');
    const channel = new Channel('session:auth');
    console.log('onnected to chanel owo');
    try {
      console.log('awaiting channel request');
      const {token, refresh_token} = await channel.request({type: 'signUp', login, pass, username});
      console.log('gottened back uwi uwu');
      dispatch(updateToken(token, refresh_token));
      dispatch({
        type: LOGIN_SUCCESS,
        username
      })
    } catch (e) {
      dispatch({
        type: LOGIN_ERROR
      });
      throw e;
    }
  }
}

export function signIn(login, pass) {
  return async dispatch => {
    dispatch({type: BEGIN_LOGIN});
    const channel = new Channel('session:auth');
    try {
      const {token, refresh_token, username} = await channel.request({type: 'signIn', login, pass});
      dispatch(updateToken(token, refresh_token));
      dispatch({
        type: LOGIN_SUCCESS,
        username
      })
    } catch (e) {
      dispatch({type: LOGIN_ERROR});
      throw e;
    }
  }
}

export function refresh() {
  return async (dispatch) => {
    const channel = new Channel('session:auth');
    try {
      const {token, refresh_token} = await channel.request({type: 'refresh'});
      dispatch(updateToken(token, refresh_token));
    } catch (e) {
      dispatch({type: LOGIN_ERROR});
      throw e;
    }
  }
}
