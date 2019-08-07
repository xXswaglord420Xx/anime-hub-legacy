import React, {useState, useEffect} from 'react';

import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { useTheme } from '@material-ui/styles';
import {getEpisodes} from '../utils/nyaapi';
import { fetchAnime } from '../utils/anilist';
import Loader from './Loader';
import styles from './AnimeDisplay.css';
import type { EpisodeDatum} from '../utils/nyaapi';

type DisplayProps = {
  match: {
    params: {
      name: string,
      id: number
    }
  }
};

const LOADING = "LOADING";
const LOADED = "LOADED";
const ERROR = "ERROR";

function epToComponent(img, ep: EpisodeDatum) {
  console.log("LOGGING EP");
  console.log(ep);
  return (
    <div key={ep.magnetURL} className={styles.episode}>
      <div className={styles.episodeImageContainer}>
        <img alt={ep.title} src={img} />
      </div>
      {`${ep.title} - ${ep.episode}`}
    </div>
  );
}

export default function AnimeDisplay(props: DisplayProps) {
  const [eps, setEps] = useState([]);
  const [data, setData] = useState({});
  const [status, setStatus] = useState(LOADING);
  const theme = useTheme();

  useEffect(() => {
    getEpisodes(decodeURIComponent(props.match.params.name)).then(ep => {
      setEps(ep);
      return Promise.resolve();
    }).catch(e => {
      console.error(e)
    });

    fetchAnime(props.match.params.id)
      .then(r => {
        setData(r.data.Media);
        setStatus(LOADED);
        return Promise.resolve();
      })
      .catch(() => setStatus(ERROR));
  }, [props.match.params.id]);


  let val = null;
  if (status === LOADING) {
    val = <Loader/>
  } else if (status === LOADED) {
    const { bannerImage, title, nextAiringEpisode, episodes, coverImage, description, characters } = data;
    const date = new Date(nextAiringEpisode.airingAt * 1000);

    val = (
      <div className={styles.root}>
        <div className={styles.banner}>
          <img className={styles.bannerImage} alt='banner' src={bannerImage}/>
          <img className={styles.cover} alt='poster' src={coverImage.large}/>
          <div className={styles.titles}>
            <h2>{title.romaji}</h2>
            <p>Episode {nextAiringEpisode.episode}/{episodes} airing at {date.toLocaleDateString(undefined)}</p>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.characterContainer}>
            <Typography
              style={{
                backgroundColor: theme.palette.secondary[700],
                padding: '10px 1em',
                borderRadius: '13px 13px 0 0',
                marginBottom: '4px'
              }}>Characters</Typography>
            <Paper className={styles.paper}>
              <List>
                {
                  characters.nodes.map(({name, id}) => <ListItem key={id} button><ListItemText primary={name.full}/></ListItem>)
                }
              </List>
            </Paper>
          </div>
          <div className={styles.synopsis}>
            <p dangerouslySetInnerHTML={{ __html: description }}/>
          </div>
        </div>
        <h2 className={styles.episodesText}>Episodes:</h2>
        <div className={styles.episodesContainer}>
          {eps.sort((a, b) => b.episode - a.episode).map(epToComponent.bind(null, bannerImage))}
        </div>
      </div>
    );
  } else {
    val = <div>WHOOPTY DOO THERE WUZ AN ERRAR XDDXDXDDXD</div>
  }
  return val;
}
