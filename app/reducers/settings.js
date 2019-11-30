import type {SettingsCollection} from "./types";
import {SET_SETTING} from "../actions/settings";

export default function(state: SettingsCollection = {}, action): SettingsCollection {
  const {type, name, value} = action;

  if (type === SET_SETTING) {
    return {...state, [name]: value};
  } else {
    return state;
  }
}
