// @flow
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {remote} from 'electron'
import List from '@material-ui/core/List';
import Torrent from './Torrent/Torrent'
import type { Torrent as T } from '../utils/nyaapi';
import Search from './AppBar';
import styles from './Home.css'
import Loader from './Loader';
import {findTorrents} from "../actions/weeb";
import {download as downloadTorrent} from "../actions/webtorrent";
import type {StateType} from "../reducers/types";


async function openDialogue(torrent: T, download) {
  const directory = (await remote.dialog.showOpenDialog({properties: ["openDirectory", "createDirectory"]}))[0];

  if (directory) {
     download(torrent.magnetURL, directory);
  }
}

export default function Home() {
  const dispatch = useDispatch();
  const tors = useSelector((state: StateType) => state.nyaa.torrents);
  const loading = useSelector((state: StateType) => state.nyaa.loading);
  useEffect(() => {
    dispatch(findTorrents(""));
  }, []);

  const download = (magnet, dir) => dispatch(downloadTorrent(magnet, dir));

  const torrents = tors.map(torrent => (
      <Torrent
        key={torrent.title}
        torrent={torrent}
        onClick={t => openDialogue(t, download)}
        onSecondary={t => openDialogue(t, download)}
      />
    )
  );

  return (
    <div className={styles.container}>
      <Search title="Nyaa" prompt='Search...' search={(term, opts) => dispatch(findTorrents(term, opts))}>
        {loading ? (
          <Loader/>
        ) : (
          <List className={styles['torrent-list']}>
            {torrents}
          </List>
        )}
      </Search>
    </div>
  )
}
