import type { scheduleStateType } from './types';
import { REQUEST_UPDATE, UPDATE_AIRING } from '../actions/schedule';



export default function reduce(
  state: scheduleStateType = {currentPage: 0, hasNextPage: true, media: [], fetching: false},
  action: {type: string, schedule: scheduleStateType}): scheduleStateType {
  switch (action.type) {
    case REQUEST_UPDATE:
      return {
        ...state,
        fetching: true
      };
    case UPDATE_AIRING:
      console.log();
      return {
        currentPage: action.schedule.currentPage,
        hasNextPage: action.schedule.hasNextPage,
        media: state.media.concat(action.schedule.media),
        fetching: false
      };
    default:
      return state;
  }
}
