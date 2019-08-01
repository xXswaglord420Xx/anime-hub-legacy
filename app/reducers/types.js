import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Torrent } from '../utils/nyaapi';

export type counterStateType = number;

export type torrentStateType = Torrent[];

export type stateType = {
  +torrents: torrentStateType,
  +counter: counterStateType
};

export type Action = {
  +type: string
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
