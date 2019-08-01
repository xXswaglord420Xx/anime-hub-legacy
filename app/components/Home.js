// @flow
import React, {useEffect} from 'react';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Torrent from './Torrent'
import type { Torrent as T, Opts } from '../utils/nyaapi';
import Search from './WeebInput';
import styles from './Home.css'

type Props = {
  torrents: T[],
  loading: boolean,
  findTorrents: (string, Opts) => void
};

export default function Home(props: Props) {
  useEffect(() => {
    props.findTorrents("");
  }, []);

  const torrents = props.torrents.map(torrent => <Torrent key={torrent.title} torrent={torrent} />);

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
