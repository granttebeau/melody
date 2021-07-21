import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
import { useHistory } from "react-router-dom";

// import history from "../utils/history";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/register", userData)
    .then(res => history.push("/")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = (userData, history) => dispatch => {
  console.log(userData);
  axios
    .post("/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      // axios.get
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
    }).catch((e) =>
      dispatch({
        type: GET_ERRORS,
        payload: e
      })
    );
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = () => dispatch => {
  

  axios
    .post("/logout", {})
    .then(res => {
      // Remove token from local storage
      localStorage.removeItem("jwtToken");
      // Remove auth header for future requests
      setAuthToken(false);
      // Set current user to empty object {} which will set isAuthenticated to false
      dispatch(setCurrentUser({}));
    }).catch((e) =>
      dispatch({
        type: GET_ERRORS,
        payload: e
      })
    );
};
