import React from 'react'
import styles from './WeebInput.css';

type Props = {
  search: string => void,
  prompt: ?string
};

function SearchTorrent(props: Props) {
  const {prompt, search, ...rest} = props;
  return <input type='text' {...rest} placeholder={prompt} className={styles.input} onKeyDown={e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      search((e.target: HTMLInputElement).value);
    }
  }}/>
}

export default SearchTorrent;
