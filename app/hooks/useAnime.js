import {getEpisodes} from '../utils/nyaapi';
import {fetchAnime} from '../utils/anilist';
import {useResource, Status} from "./fetch";

import type {Media} from "../utils/anilist";
import type {EpisodeDatum} from "../utils/nyaapi";

export {Status} from "./fetch";

export function useAnime(id, name, page = 1): AnimeType {
  const {resource: episodes, status: epStatus, error: epError} = useResource(getEpisodes, name, page);
  const {resource: data, status: aniStatus, error: aniError} = useResource(fetchAnime, id);

  const media: Media = data?.Media;

  if (aniStatus === Status.FAILED) {
    console.error(aniError);
  }

  if (epStatus === Status.FAILED) {
    console.error(epError);
  }

  if (aniStatus !== Status.FINISHED) {
    return {
      animeStatus: aniStatus,
      episodeStatus: epStatus,
      episodes: [],
      details: {}
    }
  }

  return {
    episodes: zipData(media?.streamingEpisodes?.map(ep => ep.thumbnail)?? [], episodes?.episodes),
    details: {
      id: media.id,
      description: media.description,
      banner: media.bannerImage,
      cover: media.coverImage?.large,
      title: media.title.romaji?? media.title.english,
      nextEpisode: media.nextAiringEpisode?.episode?? -1,
      airingAt: media.nextAiringEpisode? new Date(media.nextAiringEpisode.airingAt * 1000).toLocaleDateString(undefined) : null,
      episodes: media.episodes,
      characters: media.characters.nodes
    },
    animeStatus: aniStatus,
    episodeStatus: epStatus,
    episodePageCount: episodes?.pageCount?? -1
  }
}

export type AnimeType = {
  episodes: [{
    magnetURL: string,
    title: string,
    thumbnail: string,
    episode: number,
    date: number
  }],
  details: {
    id: string,
    description: string,
    banner: string,
    cover: string,
    title: string,
    nextEpisode: number,
    airingAt: string,
    episodes: number,
    characters: [{
      id: string,
      name: string
    }]
  },
  animeStatus: string,
  episodeStatus: string,
  episodePageCount: number
};

function zipData(thumbnails: [string], episodes: [EpisodeDatum]) {
  return episodes?.map((ep, index) => ({...ep, thumbnail: thumbnails[index]}));
}
