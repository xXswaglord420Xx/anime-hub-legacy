import React, {useEffect} from 'react';
import * as MatroskaSubtitles from 'matroska-subtitles';
import * as fs from 'fs';
import styles from './VideoPlayer.css';

type VideoProps = {
  source: string
};

export default (props: VideoProps) => {
  console.log(props);
  useEffect(() => {
    if (!props.source) {
      return;
    }
    const subs = [];
    const parser = new MatroskaSubtitles();
    parser.once('tracks', console.log);
    let i = 0;
    parser.on('subtitle', (sub) => {
      subs.push(sub);
      console.log(++i);
    });
    const stream = fs.createReadStream(props.source[0]);
    stream.on('end', () => {
      console.log("Finished parsing");
      console.log(subs);
    });
    stream.pipe(parser);
    return () => parser.end();
  }, [props.source]);
  return (
    <div className={styles.wrapper}>
      <video className={styles.video} style={{ width: '100%', backgroundColor: 'black' }} autoPlay src={props.source}/>
      <div className={styles.subs}>Henlo wrold</div>
    </div>
  )
}
