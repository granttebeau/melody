import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/navbar";
import Landing from "./components/landing/landing";
import PrivateRoute from "./components/privateRoute";
import HomeRoute from './components/homeRoute';
import Dashboard from "./components/home";
import "./App.css";
import Profile from "./components/profile";
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <HomeRoute exact path="/"/>
            <Route exact path="/register" component={Landing} />

            <div className="App">
              <Navbar />
              {/* <Route exact path="/register" component={Register} /> */}
              {/* <Route exact path="/login" component={Login} /> */}
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/profile/:username" component={Profile} />
              </Switch>
            </div>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
export default App;
