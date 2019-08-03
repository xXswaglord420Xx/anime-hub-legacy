// @flow
import React, {useEffect} from 'react';
import {remote, ipcRenderer} from 'electron'
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Torrent from './Torrent'
import type { Torrent as T, Opts } from '../utils/nyaapi';
import Search from './WeebInput';
import styles from './Home.css'

type Props = {
  torrents: T[],
  loading: boolean,
  findTorrents: (string, Opts) => void,
  downloadTorrent: (torrent: string, path: string) => void
};


async function openDialogue(torrent: T, download) {
  const res = await remote.dialog.showSaveDialog({defaultPath: torrent.title});
  console.log(download);
  console.log(res);

  if (res) {
    console.log("Issuing download with ipc...");
    ipcRenderer.send('request-torrent', {magnet: torrent.magnetURL, path: res});
    // download(torrent.magnetURL, res);
  }
}

export default function Home(props: Props) {
  useEffect(() => {
    props.findTorrents("");
  }, []);

  const torrents = props.torrents.map(torrent => (
    <Torrent
      key={torrent.title}
      torrent={torrent}
      onClick={t => openDialogue(t, props.downloadTorrent)}
      onSecondary={t => openDialogue(t, props.downloadTorrent)}
    />
    )
  );
  console.log("Rendering");
  return <div className={styles.container}>
    <Search prompt='Search...' search={props.findTorrents} />
    {props.loading ? (
      <div className={styles['loading-container']}><CircularProgress color="secondary"/></div>
    ) : (
      <List className={styles['torrent-list']}>
        {torrents}
      </List>
    )}
  </div>
}
