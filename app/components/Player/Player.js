import React, {useState} from 'react';
import { remote } from 'electron';
import VideoPlayer from './VideoPlayer';

type PlayerProps = {
  match: {
    params: {
      path: string
    }
  }
};

export default function Player(props: PlayerProps) {
  const [url, setUrl] = useState(decodeURIComponent(props.match.params.path));

  return (
    <div style={{width: '100%'}}>
      <VideoPlayer source={url}>
        <track kind='captions'/>
      </VideoPlayer>
      <button type='button' onClick={async () => setUrl(await remote.dialog.showOpenDialog({}))}>Play video!</button>
    </div>
  )
}
