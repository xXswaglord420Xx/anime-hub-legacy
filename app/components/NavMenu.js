import React from 'react';
import List from '@material-ui/core/List';
import {ListItemLink} from './ListItemLink';
import routes from '../constants/routes';
import styles from './NavMenu.css'

export default function NavMenu() {
  return (
    <List className={styles.elem} component='nav'>
      <ListItemLink primary='Home' to={routes.HOME}/>
      <ListItemLink primary='This name is actually long' to={routes.COUNTER} />
    </List>
  );
}


