import {useSelector} from "react-redux";
import {useResource} from "./fetch";
import type {StateType} from "../reducers/types";
import {api} from "../utils/sesh";

export function useHub(endpoint, method) {
  const token = useSelector((state: StateType) => state.auth.token);

  if (!token) {
    throw new (function uwu() {this.error = "Unvaccinated access"}); // i dont like linter comments and im honestly too lazy to throw a proper error, i might just remove this error completely because its not like im the kind of person to care really
  }

  const {resource, error} = useResource(async tok => {
    const headers = {
      'X-Auth-Token': tok
    };

    const {data} = await api(endpoint, {
      method,
      headers
    });
    return data;
  }, token);

  return {response: resource, error};
}
