import {ipcRenderer} from 'electron';

export const REQUEST_TORRENT = "REQUEST_TORRENT";
export const UPDATE_TORRENT = "UPDATE_TORRENT";


export function download(torrent: string, path: string) {
  return () => {
    ipcRenderer.send('torrent:modify', {
      type: 'new',
      resourceId: torrent,
      path
    });
  }
}
