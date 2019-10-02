import React, { SyntheticEvent } from 'react';
import {Link} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/styles';
import styles from './AnimePage.css'
import type { animeStateType, stateType } from '../../reducers/types';
import { loadNextPage } from '../../actions/schedule';
import LazyImage from '../Utils/LazyImage';
import Loader from '../Loader';

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

export default function AnimePage() {
  const fetching = useSelector((state: stateType) => state.schedule.fetching);
  const hasNextPage = useSelector((state: stateType) => state.schedule.hasNextPage);
  const currentPage = useSelector((state: stateType ) => state.schedule.currentPage);
  const firstFetch = !fetching && !currentPage && hasNextPage;
  const dispatch = useDispatch();
  const animes: animeStateType[] = useSelector(
    (state: stateType) => state.schedule.media
  );
  const theme = useTheme();

  if (firstFetch) {
    dispatch(loadNextPage());
  }

  if (firstFetch || (!currentPage && fetching)) {
    return (
      <Loader />
    );
  }

  const views = animes.map(anime => (
    <div className={styles.tile} key={anime.id}>
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
  ));

  function checkScroll(e: SyntheticEvent<HTMLDivElement>) {
    const scrolled = e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (scrolled === e.currentTarget.scrollHeight && hasNextPage) {
      console.log('Dispatching');
      dispatch(loadNextPage());
    } else if (scrolled === e.currentTarget.scrollHeight) {
      console.log("Not dispatching because no more pages");
    }
  }

  return (
    <div onScroll={checkScroll} className={styles.root}>
      {views}
    </div>
  );
};

