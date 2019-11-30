import { ThunkDispatch } from 'redux-thunk';
import { fetchAiringAnime } from '../utils/anilist';
import type { StateType } from '../reducers/types';

export const UPDATE_AIRING = "UPDATE_AIRING";
export const REQUEST_UPDATE = "REQUEST_UPDATE";

export const loadNextPage = () => {
  return (dispatch: ThunkDispatch, getState: () => StateType) => {
    if (!getState().schedule.hasNextPage || getState().schedule.fetching) {
      return Promise.resolve();
    }
    dispatch({
      type: REQUEST_UPDATE
    });
    return fetchAiringAnime(getState().schedule.currentPage + 1).then(r => {
        return dispatch({
          type: UPDATE_AIRING,
          schedule: {
            ...r,
            currentPage: r.pageInfo.currentPage,
            hasNextPage: r.pageInfo.hasNextPage
          }
        })
      }
    )
  }
};
