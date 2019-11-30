import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import type { webTorrent } from '../../reducers/types';

type PropsType = {
  torrent: webTorrent
};

export default function WebTorrent(props: PropsType) {
  const torrent = props.torrent;
  return (
    <ListItem style={{width: '100%', padding: '13px'}}>
      <div style={{width: '100%'}}>
        <p>{torrent.name}</p>
        <LinearProgress variant='determinate' color='secondary' value={torrent.progress * 100}/>
      </div>
    </ListItem>
  );
};
