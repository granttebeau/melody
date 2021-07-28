import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Landing from "./landing/landing";
import Home from "./home";
import Navbar from "./navbar";

const HomeRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated === true ? (
        // in the future this will be <Home>
        <div style={{marginTop: '100px'}}>
          <Navbar />
          <Home />
        </div>
      ) : (
        <Landing />
      )
    }
  />
);
HomeRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(HomeRoute);
