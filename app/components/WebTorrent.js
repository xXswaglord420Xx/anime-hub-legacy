import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import type { webTorrent } from '../reducers/types';

type PropsType = {
  torrent: webTorrent
};

export default function WebTorrent(props: PropsType) {
  const torrent = props.torrent;
  console.log("RENDER TORRENT");
  console.log(torrent);
  return (
    <ListItem>
      <ListItemText>
        Torrent {torrent.path} at {torrent.downloaded / torrent.size}%
      </ListItemText>
    </ListItem>
  );
};
