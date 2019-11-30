import React, {SyntheticEvent, useRef, useState} from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import styles from './VideoPlayer.css';
import {Status} from "../../hooks/useAnime";
import {subTextToJsx} from "./Subs";
import type {SubtitleData} from "./Subs";
import {debounce} from "../../utils/util";
import {useWindowSize} from "../../hooks/useWindowSize";

type VideoProps = {
  source: string,
  subs: SubtitleData,
  subStatus: Status
};

const setClass = debounce(1100)(s => s(`${styles.controls} ${styles.fadeout}`));

export default (props: VideoProps) => {
  const [time, setTime] = useState(0);
  const [controlClass, setControlClass] = useState(styles.controls);
  const [isPlaying, setPlaying] = useState(true);
  useWindowSize();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  function handleTimeChange() {
    const vid: HTMLVideoElement = videoRef.current;
    const ct = vid.currentTime;
    const dt = ct - time;
    if (dt >= 0) {
      props.subs.subs.moveSubs(dt * 1000);
    } else {
      props.subs.subs.positionSubs(ct * 1000);
    }

    setTime(ct);
  }

  function toggleFullscreen() {
    const current: HTMLElement = containerRef.current;
    if (!document.webkitFullscreenElement) {
      current.webkitRequestFullscreen();
    } else {
      document.webkitExitFullscreen();
    }
  }

  function togglePlay() {
    const vid: HTMLVideoElement = videoRef.current;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  }

  function changeTime(e: SyntheticEvent<HTMLElement> & { clientX: number }) {
    const vid: HTMLVideoElement = videoRef.current;
    const progress = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.clientWidth;
    const nt = progress * vid.duration;
    setTime(nt);
    vid.currentTime = nt;
    handleTimeChange();
  }

  const vid: HTMLVideoElement = videoRef.current;
  const scale = (vid?.clientHeight / props.subs?.height) || 1.0;

  return (
    <div
      ref={containerRef}
      onMouseMove={() => {
        setControlClass(styles.controls);
        setClass(setControlClass);
      }}
      className={styles.wrapper}
    >
      {
        props.subStatus === Status.LOADING ?
          <div className={styles.loader}><CircularProgress variant="indeterminate"/></div>
          :
          <video
            onTimeUpdate={handleTimeChange}
            className={styles.video}
            autoPlay
            ref={videoRef}
            src={props.source}
          />

      }
      <div className={styles.subs}>
        {subTextToJsx(props.subs?.subs?.currentSubs ?? [], props?.subs?.styles ?? {}, scale)}
      </div>

      {
        props.subStatus === Status.FINISHED &&
        <div className={controlClass}>
          <div className={styles.bottomControls}>
            <LinearProgress variant="determinate" onClick={changeTime}
                            value={vid?.currentTime / vid?.duration * 100}
            />
            <div className={styles.buttonBox}>
              <IconButton onClick={togglePlay}>{isPlaying? <PauseIcon/>: <PlayIcon/>}</IconButton>
              <IconButton onClick={toggleFullscreen}><FullscreenIcon/></IconButton>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
