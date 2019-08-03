import React from 'react';
import List from '@material-ui/core/List';
import WebTorrent from './WebTorrent';
import type { webTorrent as T } from '../reducers/types';

type TorrentPageProps = {
  torrents: T[]
};

export default function WebTorrentPage(props: TorrentPageProps) {
  const torrents = props.torrents;

  const views = torrents.map(t => <WebTorrent torrent={t}/>);

  return (
    <List>
      {[...views]}
    </List>
  );
}
