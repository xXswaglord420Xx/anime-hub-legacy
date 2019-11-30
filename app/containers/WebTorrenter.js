import {useDispatch} from 'react-redux';
import {useEffect} from 'react'
import {ipcRenderer} from 'electron'
import { UPDATE_TORRENT } from '../actions/webtorrent';


export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    function onTorrentStateChanged(event, {type, torrent, id}) {
      switch (type) {
        case 'revive':
          console.log(`Reviving torrents`);
          torrent.forEach(t => onTorrentStateChanged(event, {type: 'update', torrent: t, id}));
          break;
        case 'update':
          dispatch({
            type: UPDATE_TORRENT,
            torrent: {
              ...torrent,
              completed: false
            }
          });
          break;
        default:
          console.error(`Default label hit with ${type}`);
      }
    }

    ipcRenderer.on('state:torrent', onTorrentStateChanged);
    ipcRenderer.send('torrent:request');
  }, []);
  return null;
}
