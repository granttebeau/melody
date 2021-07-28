import axios from "axios";
import {
  GET_HOME_PAGE,
  SET_HOME_PAGE_LOADING, 
  GET_POPULAR,
  SET_POPULAR,
  GET_ERRORS
} from "./types";

// Login - get user token
export const getHomePage = (username) => dispatch => {
    dispatch(setHomePageLoading());
    dispatch(setPopularLoading());
  axios
    .get("/home")
    .then(res => {
        dispatch(setHomePage(res.data.posts));
        dispatch(setPopular(res.data.popular));
    }).catch((e) =>{
    // console.log("ERROR", e);
      dispatch({
        type: GET_ERRORS,
        payload: e
      })
    }
    );
};
// Set logged in user
export const setHomePage = decoded => {
  return {
    type: GET_HOME_PAGE,
    payload: decoded
  };
};
// User loading
export const setHomePageLoading = () => {
  return {
    type: SET_HOME_PAGE_LOADING
  };
};

// Set logged in user
export const setPopular = decoded => {
    return {
      type: GET_POPULAR,
      payload: decoded
    };
  };
  // User loading
  export const setPopularLoading = () => {
    return {
      type: SET_POPULAR
    };
  };
  