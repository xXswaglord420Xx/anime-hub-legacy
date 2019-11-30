// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SaveAlt from '@material-ui/icons/SaveAlt';

import type {Torrent} from "../../utils/nyaapi";

type Props = {
  torrent: Torrent,
  onClick: SyntheticMouseEvent => void,
  onSecondary: SyntheticMouseEvent => void
};

export default function({torrent, onClick, onSecondary}: Props) {
  return <ListItem onClick={() => onClick(torrent)} button>
    <ListItemText primary={torrent.title} />
    <ListItemSecondaryAction onClick={() => onSecondary(torrent)}>
      <IconButton edge="end">
        <SaveAlt/>
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
}
