import React, { SyntheticEvent } from 'react';
import {Link} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/styles';
import GridIcon from "@material-ui/icons/GridOn";
import PanelIcon from "@material-ui/icons/GridOff";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import styles from './AnimePage.css'
import type { animeStateType, StateType } from '../../reducers/types';
import { loadNextPage } from '../../actions/schedule';
import LazyImage from '../Utils/LazyImage';
import {AppBar} from "../AppBar";
import {RadioIconGroup, RadioIcon} from "../Utils/RadioIconGroup";
import {setSetting} from "../../actions/settings";
import {range} from "../../utils/util";

type AnimeProps = {
  anime: animeStateType
};

function secondsToTime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  let rem = seconds % (3600 * 24);
  const hours = Math.floor(rem / 3600);
  rem %= 3600;
  const minutes = Math.floor(rem % 60);

  if (days) {
    return `${days} days ${hours} hrs`;
  }
  return `${hours} hrs ${minutes} min`;
}

const CardAnime = (props: AnimeProps) => {
  const {anime} = props;

  return (
    <div className={styles.hoverBoard}>
      <Link className={styles.unlink} to={`/anime/${encodeURIComponent(anime.title.romaji)}/${anime.id}`}>
        <Paper className={styles.card}>
          <LazyImage src={anime.coverImage.extraLarge} height={280} width={150}/>
          <div className={styles.cardContent}>
            <div className={styles.header}>
              <Typography className={styles.cardTitle} variant="subtitle1">{anime.title.romaji}</Typography>
              <Typography className={styles.timeStamp} variant="caption">
                {
                  anime.nextAiringEpisode ?
                    `Ep ${anime.nextAiringEpisode.episode} in ${secondsToTime(anime.nextAiringEpisode.timeUntilAiring)}` :
                    "Unknown"
                }
              </Typography>
            </div>
            <Typography className={styles.description} dangerouslySetInnerHTML={{__html: anime.description}}/>
            <div className={styles.chipSet}>
              {
                anime.tags.slice(0, 3).map(tag => <Chip key={tag.name} className={styles.chip} label={tag.name}/>)
              }
            </div>
          </div>
        </Paper>
      </Link>
    </div>
  );
};

const TileAnime = (props: AnimeProps) => {
  const {anime} = props;
  const theme = useTheme();
  return <div className={styles.tile} key={anime.id}>
    <Link className={styles.unlink} to={`/anime/${encodeURIComponent(anime.title.romaji)}/${anime.id}`}>
      <LazyImage className={styles.image}
                 src={anime.coverImage.extraLarge}
                 width='100%'
                 height='320px'
                 alt={anime.title.romaji}/>
      <div className={styles.titleBar} style={{ backgroundColor: theme.palette.secondary[700] }}>
        <div>
          {
            anime.nextAiringEpisode ?
              `Ep ${anime.nextAiringEpisode.episode} in ${secondsToTime(anime.nextAiringEpisode.timeUntilAiring)}` :
              "Unknown"
          }
        </div>
        <div>{anime.title.romaji}</div>
      </div>
    </Link>
  </div>
};

const CardAnimeSkelly = () => {
  const randomPercentWidth = () => `${Math.random() * 20 + 65}%`;
  const randomPxWidth = () => `${Math.random() * 30 + 50}px`;

  return (
    <div className={styles.hoverBoard}>
      <Paper className={styles.card}>
        <Skeleton variant="rect" height={280} width={150}/>
        <div className={styles.cardContent}>
          <Skeleton variant="text"/>
          <div className={styles.description}>
            {
              [...range(0, Math.random() * 3 + 1)].map(n => (
                <Skeleton key={n} variant="text" width={randomPercentWidth()}/>
              ))
            }
          </div>
          <div className={styles.chipSet}>
            {
              [...range(0, 3)]
                .map(n => <Chip
                  className={styles.chip}
                  key={n}
                  style={{width: randomPxWidth()}}
                  label=""
                />)
            }
          </div>
        </div>
      </Paper>
    </div>
  );
};

const TileAnimeSkelly = () => {
  const theme = useTheme();

  return (
    <div className={styles.tile}>
      <div className={styles.unlink}>
        <Skeleton className={styles.image}
                   variant="rect"
                   width='100%'
                   height='320px'
        />
        <div className={styles.titleBar} style={{ backgroundColor: theme.palette.secondary[700] }}>
          <div>
            <Skeleton variant="text" />
          </div>
          <Skeleton variant="text" />
        </div>
      </div>
    </div>
  )
};

const Anime = (props: AnimeProps) => {
  const gridMode = useSelector((state: StateType) => state.settings["grid_mode"]);
  switch (gridMode) {
    case "card":
      return <CardAnime {...props}/>;
    case "tile":
      return <TileAnime {...props}/>;
    default:
      console.error("Unknown grid mode", gridMode);
      return null;
  }
};

const Skelly = props => {
  const gridMode = useSelector((state: StateType) => state.settings["grid_mode"]?? "card");
  switch (gridMode) {
    case "card":
      return <CardAnimeSkelly {...props}/>;
    case "tile":
      return <TileAnimeSkelly {...props}/>;
    default:
      console.error("Unknown grid mode", gridMode);
      return null;
  }
};

export default function AnimePage() {
  const fetching = useSelector((state: StateType) => state.schedule.fetching);
  const hasNextPage = useSelector((state: StateType) => state.schedule.hasNextPage);
  const currentPage = useSelector((state: StateType) => state.schedule.currentPage);
  const gridMode = useSelector((state: StateType) => state.settings["grid_mode"]);
  const firstFetch = !fetching && !currentPage && hasNextPage;
  const dispatch = useDispatch();
  const animes: animeStateType[] = useSelector(
    (state: StateType) => state.schedule.media
  );

  if (firstFetch) {
    dispatch(loadNextPage());
  }

  const displaySkeletons = firstFetch || (!currentPage && fetching);

  const views = displaySkeletons?
    [...range(1, 16)].map(n => <Skelly key={n}/>) :
    animes.map(anime => <Anime key={anime.id} anime={anime}/>);

  function checkScroll(e: SyntheticEvent<HTMLDivElement>) {
    const scrolled = e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (scrolled === e.currentTarget.scrollHeight && hasNextPage) {
      dispatch(loadNextPage());
    } else if (scrolled === e.currentTarget.scrollHeight) {
      console.log("Reached the end of anime pages owo");
    }
  }

  return (
    <div className={styles.superRoot}>
      <AppBar title="Anime">
        <RadioIconGroup value={gridMode} onChange={value => dispatch(setSetting("grid_mode", value))}>
          <RadioIcon name="card" icon={<GridIcon />}/>
          <RadioIcon name="tile" icon={<PanelIcon />}/>
        </RadioIconGroup>
      </AppBar>
      <div onScroll={checkScroll} className={styles.root}>
        {views}
      </div>
    </div>
  );
};

