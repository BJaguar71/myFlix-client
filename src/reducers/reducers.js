import { combineReducers } from 'redux';

import { GET_MOVIES, FILTER_MOVIES } from './actions';

// defining the next two functions. each takes a state an action, and chage the state if is concerned by the action
function visibilityFilter(state = '', action) {
// This syntax states that if the given action is unrelated to the reducer, then it should return whatever state it’s been given.
  switch (action.type) {
    case FILTER_MOVIES: 
      return action.value;
// definig a default state for the cases that the state doen't change then will return the default defined state which in this case in an empty string
    default:
      return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case GET_MOVIES:
      console.log('GET_MOVIES reducer reached');
      return action.value;
    default: 
      return state;
  }
}

/*
* defining a combined reducer (made out of other reducers) : This groups all the reducers together and only passes them the state they’re concerned with: the filter for the first reducer and the movies for the second one. 
*/ 
const movieApp = combineReducers ({
  visibilityFilter,
  movies
});

export default movieApp;