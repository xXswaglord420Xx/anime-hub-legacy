import React from 'react';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {pink} from '@material-ui/core/colors';
import {ListItemLink} from '../ListItemLink';
import routes from '../../constants/routes';
import ProfileBar from "./ProfileBar";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {...theme.mixins.toolbar, display: 'flex', alignItems: 'center', padding: '7px'},
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  wrapper: {
    position: 'relative',
    marginLeft: theme.spacing(1)
  },
  progress: {
    position: 'absolute',
    top: -3,
    left: -3,
    zIndex: 1
  },
  avi: {
    backgroundColor: pink[500],
    color: '#fff'
  }
}));

export default function SideMenu() {
  const classes = useStyles();

  return (
    <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}} variant='permanent'>
      <ProfileBar />
      <Divider/>
      <List component='nav'>
        <ListItemLink primary='Animes' to={routes.ANIMES}/>
        <ListItemLink primary='Nyaa' to={routes.HOME}/>
        <ListItemLink primary='Torrents' to={routes.WEBTORRENT} />
        <ListItemLink primary='Player' to={routes.PLAYER}/>
        <Divider/>
        <ListItemLink primary='Settings' to={routes.HOME} />
        <ListItemLink primary='Exit' to={routes.HOME}/>
      </List>
    </Drawer>
  );
}


