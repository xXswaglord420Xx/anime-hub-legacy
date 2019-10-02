import {useEffect, useState} from "react";

export const Status = {
  LOADING: "LOADING",
  FINISHED: "FINISHED",
  FAILED: "FAILED"
};

export type Task<T> = {
  status: string,
  resource: ?T,
  error: any
};

export function useResource<T>(f: [any] => Promise<T>, ...args: [any]): Task<T> {
  const [status, setStatus] = useState(Status.LOADING);
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus(Status.LOADING);
    f(...args).then(r => {
      setResource(r);
      setStatus(Status.FINISHED);
      return null;
    }).catch(e => {
      setError(e);
      setStatus(Status.FAILED);
    })
  }, args);

  return {status, resource, error};
}
