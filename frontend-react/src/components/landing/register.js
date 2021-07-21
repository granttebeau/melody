import React, { Component, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../actions/authActions";
import "./landing.css";

let Register = (props) => {
  let dispatch = useDispatch();
  let history = useHistory();
  let [name, setName] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name: name,
      username: username,
      password: password,
    };
    dispatch(registerUser(userData, history));
  };
  const { errors } = props;
  return (
    <div className="col-10 col-md-5">
              <h2 className="text-left my-3">
                Register now:
              </h2>
              <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    error={errors.username}
                    name="username"
                  ></input>
                </div>
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
                    Register
                  </button>
                </div>
              </form>
              <p>Have an account? Log in <a href="/">here</a> </p>
            </div>
  );
};
Register.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { registerUser })(Register);
