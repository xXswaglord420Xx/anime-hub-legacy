
export const ADD_ENTRY = "ADD_ENTRY";
export const REMOVE_ENTRY = "REMOVE_ENTRY";

export type EntryEpisode = {
  number: number,
  name: string,
  path: string
};

export function addEntry(series, episode: EntryEpisode) {
  return {
    type: ADD_ENTRY,
    series,
    episode
  }
}

export function removeEntry(series, episode: number) {
  return {
    type: REMOVE_ENTRY,
    series,
    episode
  }
}
