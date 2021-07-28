import axios from "axios";
import {
  GET_USER_POSTS,
  SET_USER_PROFILE_LOADING, 
  GET_ERRORS
} from "./types";

// Login - get user token
export const getUserProfile = (username) => dispatch => {
    dispatch(setUserProfileLoading());
  axios
    .get("/profile/" + username)
    .then(res => {
        dispatch(setUserProfile(res.data));
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
export const setUserProfile = decoded => {
  return {
    type: GET_USER_POSTS,
    payload: decoded
  };
};
// User loading
export const setUserProfileLoading = () => {
  return {
    type: SET_USER_PROFILE_LOADING
  };
};
