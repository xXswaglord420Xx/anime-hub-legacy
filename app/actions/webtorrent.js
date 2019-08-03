export const REQUEST_TORRENT = "REQUEST_TORRENT";
export const UPDATE_TORRENT = "UPDATE_TORRENT";

const torrentClient = null;

export function download(torrent: string, path: string) {
  return async dispatch => {
    torrentClient.add(torrent, {path}, t => {
      /*
      const tData: webTorrent = {
        completed: false,
        downloaded: 0,
        path,
        size: t.size,
        torrent,
        peers: t.numPeers,
        uploadSpeed: t.uploadSpeed,
        downloadSpeed: t.downloadSpeed,
        hash: t.infoHash
      };
      */

      /*
      dispatch({
        type: REQUEST_TORRENT,
        torrent: tData
      });
      */

      /*
      t.on('download', () => {
        dispatch({
          type: UPDATE_TORRENT,
          hash: t.infoHash,
          torrent: {
            downloaded: t.downloaded
          }
        })
      });
      */

      t.on('done', () => {
        console.log('DISPATCHING DONE');
        dispatch({
          type: UPDATE_TORRENT,
          hash: t.infoHash,
          torrent: {
            completed: true
          }
        })
      })
    });
  }
}
