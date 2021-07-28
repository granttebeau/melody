import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Login from './login';
import Register from './register'
import './landing.css';

let Landing = (props) => {
  let [login, setLogin] = useState(true);
  let location = useLocation();
  useEffect(e => {
    setLogin(!location.pathname.includes('register'))
  }, []);
  // setLogin(!location.pathname.includes('register'));
    return (
      <div className="landing-page">
      <div className="image-background m-0" id="image-background">
        <img src="images/logo.png" alt="logo"></img>
        <h4 className="text-center">
          <i className="fas fa-music"></i> Share your music, today{" "}
        </h4>
      </div>
      <div className="landing-info">
        <div className="container">
          <div className="row justify-content-center">
            {login && <Login props={props}></Login>}
            {!login && <Register props={props}></Register>}
          </div>
        </div>
      </div>
    </div>
    );
}
export default Landing;