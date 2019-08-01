import { FIND_TORRENTS} from '../actions/weeb';
import type { Torrent } from '../utils/nyaapi';

export default function weeb(state: Torrent[] = [], action) {
  return action.type === FIND_TORRENTS ? action.torrents : state;
}
