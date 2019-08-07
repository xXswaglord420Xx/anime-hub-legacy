// @flow
import React, {useEffect} from 'react';
import {remote} from 'electron'
import List from '@material-ui/core/List';
import Torrent from './Torrent'
import type { Torrent as T, Opts } from '../utils/nyaapi';
import Search from './WeebInput';
import styles from './Home.css'
import Loader from './Loader';

type Props = {
  torrents: T[],
  loading: boolean,
  findTorrents: (string, Opts) => void,
  downloadTorrent: (torrent: string, path: string) => void
};


async function openDialogue(torrent: T, download) {
  const res = await remote.dialog.showSaveDialog({defaultPath: torrent.title});
  console.log(res);

  if (res) {
    console.log("Issuing download with action...");
    download(torrent.magnetURL, res);
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
      <Loader />
    ) : (
      <List className={styles['torrent-list']}>
        {torrents}
      </List>
    )}
  </div>
}
