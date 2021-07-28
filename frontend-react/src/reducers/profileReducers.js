import {
    GET_USER_POSTS,
    SET_USER_PROFILE_LOADING
  } from "../actions/types";
  const initialState = {
      userPosts: []
  };
  export default function profileReducers(state = initialState, action) {
    switch (action.type) {
      case GET_USER_POSTS:
        return {
          ...state,
          userPosts: action.payload,
        };
      case SET_USER_PROFILE_LOADING:
        return {
          ...state,
          userPostsLoading: true
        };
      default:
        return state;
    }
  }