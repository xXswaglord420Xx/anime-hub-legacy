import React from 'react';
import { NavLink } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './NavMenu.css';

export default function NavMenu() {
  return (
    <div className={styles.menu}>
      <NavLink className={styles.link} exact activeClassName={styles.active} to={routes.HOME}>Home</NavLink>
      <NavLink className={styles.link} activeClassName={styles.active} to={routes.COUNTER}>Counter</NavLink>
    </div>
  );
}
