import React from 'react';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {ListItemLink} from './ListItemLink';
import routes from '../constants/routes';

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
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function NavMenu() {
  const classes = useStyles();

  return (
    <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}} variant='permanent'>
      <div className={classes.toolbar} />
      <Divider/>
      <List component='nav'>
        <ListItemLink primary='Home' to={routes.HOME}/>
        <ListItemLink primary='This name is actually long' to={routes.WEBTORRENT} />
      </List>
    </Drawer>
  );
}


