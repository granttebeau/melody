import {
    GET_HOME_PAGE,
    GET_POPULAR,
    SET_HOME_PAGE_LOADING,
    SET_POPULAR
  } from "../actions/types";
  const initialState = {
      homePagePosts: []
  };
  export default function homeReducers(state = initialState, action) {
    switch (action.type) {
      case GET_HOME_PAGE:
        return {
          ...state,
          homePagePosts: action.payload,
        };
      case SET_HOME_PAGE_LOADING:
        return {
          ...state,
          homePagePostsLoading: true
        };
      case GET_POPULAR:
          return {
              ...state,
              popular: action.payload
          }
      case SET_POPULAR:
          return {
              ...state,
              popularLoading: true
          }
      default:
        return state;
    }
  }