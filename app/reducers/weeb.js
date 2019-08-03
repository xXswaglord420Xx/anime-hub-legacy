import { FIND_TORRENTS, LOAD_TORRENTS } from '../actions/weeb';
import type {nyaaStateType as nyaa} from './types';

export default function weeb(state: nyaa = {torrents: [], loading: true}, action) {
  switch (action.type) {
    case FIND_TORRENTS:
      return {torrents: action.torrents, loading: false};
    case LOAD_TORRENTS:
      return {torrents: [], loading: true};
    default:
      return state;
  }
}
