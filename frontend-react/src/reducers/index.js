import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import profileReducers from './profileReducers';
import homeReducers from "./homeReducers";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducers,
  home: homeReducers
});