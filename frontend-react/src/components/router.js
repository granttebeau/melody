import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './home'

export default class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
            </Router>
          );
    }
}
