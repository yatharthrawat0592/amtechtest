import React from "react";
import { Helmet } from "react-helmet";
import "../components/common/css/home.css";
import LoginPage from "../components/login-component";

const Login = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>CSS Dashboard</title>
        <meta property="og:title" content="CSS Dashboard" />
      </Helmet>
      <header data-role="Header" className="home-header">
        <div>
          <img
            alt="logo"
            src="/playground_assets/am_tech_comp-1500h.jpg"
            className="home-image"
          />
          {/* <img
            alt="logo"
            src="/playground_assets/biobubble-small.jpg"
            className="home-image"
          /> */}
        </div>
        <h1 id="l_ccsDash" className="home-text">
          {/* <span>BioBubble Power Unit Dashboard</span> */}
          <span>AM Tech Embedded Dashboard</span>
        </h1>
        <div className="home-icon-group"></div>
      </header>
      <div className="main-container">
        <div className="adjust-container-login">
          <div className="unit-display-ctrl-bar">
            <LoginPage />
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <img
          alt="logo"
          src="/playground_assets/am_tech_comp-1500h.jpg"
          className="home-image2"
        />
        <span className="home-text6">
          © 2023 AM Tech LLC, All Rights Reserved.
        </span>
        <div className="home-icon-group2"></div>
      </footer>
    </div>
  );
};

export default Login;
