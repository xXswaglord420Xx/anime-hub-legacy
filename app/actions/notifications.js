
export const ADD_SNACKBAR = "ADD_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

let timeout = null;

export function pushSnack(text, ...actions) {
  return async dispatch => {
    dispatch({
      type: ADD_SNACKBAR,
      text,
      actions
    });

    clearTimeout(timeout);
    timeout = setTimeout(() => dispatch({type: REMOVE_SNACKBAR}), 3000);
  }
}
