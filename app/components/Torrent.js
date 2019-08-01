// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SaveAlt from '@material-ui/icons/SaveAlt';

import type {Torrent} from "../utils/nyaapi";

type Props = {
  torrent: Torrent
};

export default function({torrent}: Props) {
  return <ListItem button>
    <ListItemText primary={torrent.title} />
    <ListItemSecondaryAction>
      <IconButton edge="end">
        <SaveAlt/>
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
}
