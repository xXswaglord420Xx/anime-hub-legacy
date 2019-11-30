import React from 'react';
import {useSelector} from "react-redux";
import List from '@material-ui/core/List';
import WebTorrent from './WebTorrent';
import type {StateType} from '../../reducers/types';



export default function WebTorrentPage() {
  const torrents = useSelector((state: StateType) => Object.values(state.webTorrent.tracked));

  const views = torrents.map(t => <WebTorrent key={t.id} torrent={t}/>);

  return (
    <List style={{width: '100%'}}>
      {[...views]}
    </List>
  );
}
