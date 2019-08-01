// @flow

import React from 'react';
import type {Torrent} from "../utils/nyaapi";
import styles from './Torrent.css'

type Props = {
  torrent: Torrent
};

export default function({torrent}: Props) {
  return <div className={styles.torrent}>
    <div className={styles.title}>{torrent.title}</div>
    <div>Magnet</div>

  </div>
}
