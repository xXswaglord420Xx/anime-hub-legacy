import Channel from '../utils/channel'

export const SET_SETTING = "SET_SETTING";

export function setSetting(name, value) {
  return async dispatch => {
    const channel = new Channel('settings');
    console.log('awaiting set');

    await channel.request({name, value, command: "set"});

    console.log('set awaited');

    dispatch({
      type: SET_SETTING,
      name,
      value
    })
  };

}

export function refreshSettings(settings) {
  return dispatch => {
    Object.entries(settings).forEach(([key, value]) => dispatch({type: SET_SETTING, name: key, value}));
  }
}
