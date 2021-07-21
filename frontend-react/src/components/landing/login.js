import React, { Component, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { loginUser } from "../../actions/authActions";
import "./landing.css";

let Login = (props) => {
  let dispatch = useDispatch();
  let history = useHistory();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username: username,
      password: password,
    };
    dispatch(loginUser(userData, history));
  };
  const { errors } = props;
  return (
    <div className="col-10 col-md-5">
              <h2 className="text-left my-3">
                See what music your friends are listening to:
              </h2>
              <form noValidate onSubmit={onSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    error={errors.username}
                    name="username"
                  ></input>
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    error={errors.password}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block " type="submit">
                    Log in
                  </button>
                </div>
              </form>
              <p>Don't have an account? Register <a href="/register">here</a> </p>
            </div>
  );
};
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(Login);
