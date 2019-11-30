import type {Library} from "./types";
import {ADD_ENTRY, REMOVE_ENTRY} from "../actions/library";

export default function reduce(state: Library = {series: [], episodes: {}}, action): Library {
  const {type, episode, series} = action;
  switch (type) {
    case ADD_ENTRY: {
      const entries = state.series.indexOf(series) >= 0 ? state.series : [...state.series, series];
      const episodes = state.episodes[series];
      return {series: entries, episodes: {...state.episodes, [series]: [...episodes, {...episode, watched: false}]}};
    }
    case REMOVE_ENTRY: {
      const episodes = state.episodes[series].filter(e => e.number !== episode);
      return {...state, episodes: {...state.episodes, [series]: episodes}};
    }
    default:
      return state;
  }
}
