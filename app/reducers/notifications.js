import type {notificationsType as State} from "./types";
import {ADD_SNACKBAR, REMOVE_SNACKBAR} from "../actions/notifications";

export default function (state: State = {snackbar: null}, action): State {
  switch (action.type) {
    case ADD_SNACKBAR:
      return {...state, snackbar: {text: action.text, actions: [...action.actions]}};
    case REMOVE_SNACKBAR:
      return {...state, snackbar: null};
    default:
      return state;
  }
}
