import React, {useState} from 'react';
import { remote } from 'electron';

export default function Player() {
  const [url, setUrl] = useState("");

  return (
    <div>
      <video width='100%' autoPlay src={url}>
        <track kind='captions'/>
      </video>
      <button type='button' onClick={async () => setUrl(await remote.dialog.showOpenDialog({}))}>Play video!</button>
    </div>
  )
}
