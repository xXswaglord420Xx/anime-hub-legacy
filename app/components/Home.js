// @flow
import React from 'react';
import Torrent from './Torrent'
import type { Torrent as T, Opts } from '../utils/nyaapi';
import Search from './WeebInput';
import styles from './Home.css'

type Props = {
  torrents: T[],
  findTorrents: (string, Opts) => void
};

export default function Home(props: Props) {
  const torrents = props.torrents.map(torrent => <Torrent key={torrent.title} torrent={torrent} />);
  return <div className={styles.container}>
    <Search prompt='Search...' search={props.findTorrents} />
    <div className={styles['torrent-list']}>
      {torrents}
    </div>
  </div>
}
