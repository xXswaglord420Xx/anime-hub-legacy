import React, {useEffect, useState} from 'react';
import {remote} from 'electron';
import {push} from 'connected-react-router'
import {useDispatch} from "react-redux";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PlayIcon from "@material-ui/icons/PlayArrow";
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from '@material-ui/core/styles';
import VideoPlayer from './VideoPlayer';
import {extractSubtitles} from "./Subs";
import {Status} from "../../hooks/useAnime";

type PlayerProps = {
  match: {
    params: {
      path: string
    }
  }
};

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

export default function Player(props: PlayerProps) {
  const url = decodeURIComponent(props.match.params.path);
  const setUrl = u => dispatch(push(`/player/${encodeURIComponent(u)}`));
  const classes = useStyles();
  const dispatch = useDispatch();
  const [subStatus, setSubStatus] = useState(Status.LOADING);
  const [subtitles, setSubtitles] = useState(null);
  const [isFabOpen, setFabOpen] = useState(false);


  useEffect(() => {
    if (!url || url === "null") return;

    (async () => {
      try {
        const subs = await extractSubtitles(url);
        setSubtitles(subs);
        setSubStatus(Status.FINISHED);
      } catch (e) {
        setSubStatus(Status.FAILED);
      }
    })();
  }, [url]);

  const openNewVideo = async () => {
    setUrl(await remote.dialog.showOpenDialog({}));
    setFabOpen(false);
  };

  return (
    <div style={{width: '100%'}}>
      <VideoPlayer source={url} subs={subtitles} subStatus={subStatus} />
      <SpeedDial
        className={classes.speedDial}
        ariaLabel="Room and video actions"
        icon={<SpeedDialIcon/>}
        open={isFabOpen}
        onOpen={() => setFabOpen(true)}
        onClose={() => setFabOpen(false)}
      >
        <SpeedDialAction icon={<PlayIcon/>} title="Play a video" tooltipTitle="Play a video" onClick={openNewVideo}/>
        <SpeedDialAction icon={<AddIcon/>} title="Create room" tooltipTitle="Create room" onClick={() => setFabOpen(false)}/>
      </SpeedDial>
    </div>
  )
}
