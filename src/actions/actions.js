/**
 * action types
 */

// initializing the movies list with movies
export const GET_MOVIES = 'GET_MOVIES';

// filtering the movies list
export const FILTER_MOVIES = 'FILTER_MOVIES';

// action creator
export function getMovies(value) {
  console.log('GET_MOVIES action triggered');
  return {
    type: GET_MOVIES,
    value
  };
}

export const filterMovies = value => ({
  type: FILTER_MOVIES,
  value
})