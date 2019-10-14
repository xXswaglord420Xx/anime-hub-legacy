import React, {useEffect, useState} from 'react';
import {remote} from "electron";
import {join} from "path";
import Skeleton from "@material-ui/lab/Skeleton";
import {useDispatch, useSelector} from 'react-redux';
import {push} from "connected-react-router"
import PlayArrow from "@material-ui/icons/PlayArrow"
import More from "@material-ui/icons/MoreHorizOutlined"
import CircularProgress from "@material-ui/core/CircularProgress";
import {useAnime, Status} from "../../hooks/useAnime";
import Loader from '../Loader';
import styles from './AnimeDisplay.css';
import type {EpisodeDatum} from '../../utils/nyaapi';
import {download} from '../../actions/webtorrent';
import {updatePresence} from '../../utils/discord'
import Pagination from "./Pagination";
import type {StateType, webTorrent} from "../../reducers/types";
import {range} from "../../utils/util";
import LazyImage from "../Utils/LazyImage";

const parseTorrent = require("parse-torrent");


type DisplayProps = {
  match: {
    params: {
      name: string,
      id: number
    }
  }
};

type EpProps = {
  img: string,
  ep: EpisodeDatum
};

function EpComponent(props: EpProps) {
  const path = join(remote.app.getPath("home"), "Nico the Master of UwU", "Anime Hub", "Animes");
  const img = props.img;
  const ep: EpisodeDatum = props.ep;
  const dispatch = useDispatch();
  const torrent: webTorrent = useSelector((state: StateType) => {
    const hash = parseTorrent(ep.magnetURL).infoHash;
    for (const tracked of Object.values(state.webTorrent.tracked)) {
      if (tracked.id === hash) {
        return tracked;
      }
    }
    return null;
  });

  const onClick = async () => dispatch(download(ep.magnetURL, path));

  const showingButtons = !!torrent; // god i love this idiom it looks like you're so excited !!

  const play = () => push(`/player/${encodeURIComponent(ep.filename)}`);

  return (
    <div className={styles.episode}>
      <div className={styles.episodeImageContainer}>
        <div style={{display: showingButtons? 'flex' : 'none'}} className={styles.episodeWrapperButtons}>
          <div style={{position: 'relative', padding: 0, display: 'inline-flex'}}>
            {
              torrent?.completed?
                null :
                <CircularProgress style={{position: 'absolute', left: 0, top: 0}} size={56} value={torrent?.progress * 100} variant="static" />
            }
            <PlayArrow disabled={!(torrent?.completed?? true)} className={styles.button} onClick={play} fontSize='inherit'/>
          </div>
          <More className={styles.button} fontSize='inherit' />
        </div>
        <div
          role='button'
          tabIndex={0}
          style={{width: '100%'}}
          onKeyPress={e => e.code === "Enter" && onClick()}
          onClick={onClick}
        >
          <LazyImage width='100%' height='140px' alt={ep.title} className={showingButtons? styles.touched : null} src={img}/>
        </div>
      </div>
      {`${ep.title} - ${ep.episode}`}
    </div>
  );
}

function SkeletonEpisode() {
  return (
    <div className={styles.episode}>
      <div className={styles.episodeImageContainer}>
        <Skeleton width='100%' height='140px' variant='rect' />
      </div>
      <Skeleton />
    </div>
  )
}

function Episodes({episodes, banner, status, episodePageCount, page, setPage}) {
  const pagination = <Pagination page={page} lastPage={episodePageCount} onPageChange={setPage}/>;
  if (status === Status.FINISHED) {
    return (
      <div style={{marginBottom: '13px'}}>
        <div className={styles.episodesContainer}>
          {episodes?.map(ep => <EpComponent key={ep.magnetURL} img={ep.thumbnail || banner} ep={ep}/>)}
        </div>
        {pagination}
      </div>
    );
  } else if (status === Status.LOADING) {
    return (
      <div style={{marginBottom: '13px'}} className={styles.episodesContainer}>
        {[...range(0, 16)].map(n => <SkeletonEpisode key={n} />)}
      </div>
    )
  }
}

export default function AnimeDisplay(props: DisplayProps) {
  const [page, setPage] = useState(1);
  const anime = useAnime(props.match.params.id, props.match.params.name, page);


  useEffect(() => {
    updatePresence({
      state: 'browsing some anime probab;y',
      details: `looking at hte anime ${props.match.params.name}`
    })
  }, [props.match.params.name]);

  if (anime.animeStatus === Status.LOADING) {
    return <Loader/>
  } else if (anime.animeStatus === Status.FINISHED) {
    const deets = anime.details;
    const episodes = anime.episodes;
    const {cover, airingAt, banner, description, nextEpisode, title, episodes: episodeCount} = deets;
    const dateText = airingAt? `Episode ${nextEpisode}/${episodeCount} airing at ${airingAt}` : "Airing date unknown";

    return (
      <div className={styles.root}>
        <div className={styles.banner}>
          <LazyImage width='100%' height={220} className={styles.bannerImage} alt='banner' src={banner}/>
          <div className={styles.coverContainer}><LazyImage width='100%' height='100%' className={styles.cover} alt='poster' src={cover}/></div>
          <div className={styles.titles}>
            <h2>{title}</h2>
            <p>{dateText}</p>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.synopsis}>
            <p dangerouslySetInnerHTML={{ __html: description }}/>
          </div>
        </div>
        <h2 className={styles.episodesText}>Episodes:</h2>
        <Episodes
          page={page}
          setPage={setPage}
          episodes={episodes}
          banner={banner}
          episodePageCount={anime.episodePageCount}
          status={anime.episodeStatus}
        />
      </div>
    );
  } else {
    return <div>WHOOPTY DOO THERE WUZ AN ERRAR XDDXDXDDXD</div>
  }
}
