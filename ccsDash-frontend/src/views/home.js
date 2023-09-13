/* eslint-disable no-undef */
import React from "react";
import { Helmet } from "react-helmet";

//import NavigationLinks1 from '../components/navigation-links1'
import "../components/common/css/home.css";
import UnitDisplayCtrl from "../components/unit-display-ctrl";

import Divider from "@mui/material/Divider";
import GraphContainer from "../components/graph-container";

import { useLocation } from "react-router";
import { Button, Typography } from "@mui/material";

import { logoutUser } from "../store/actions/login-register-logout-action";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const [getTimerId, setTimerId] = React.useState();
  let location = useLocation();

  const navigate = useNavigate();

  const logout = async () => {
    if (window.timerId) {
      const timerIdList = window.timerId;
      timerIdList.forEach((idTimer, id) => {
        clearInterval(idTimer);
      });
      window.timerId.pop();
    }

    const IpAddress = localStorage.getItem("IpAddress");
    const email = localStorage.getItem("email");

    const loginObj = {
      email: email,
      IpAddress: IpAddress,
    };

    const resp = await logoutUser(loginObj);

    if (
      resp &&
      (resp.message === "Logout Successfully!" ||
        resp.message === "Already Logout!")
    ) {
      localStorage.clear();
      navigate("/", { state: { status: "Logout" } });
    }
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>CSS Dashboard</title>
        <meta property="og:title" content="CSS Dashboard" />
      </Helmet>
      <header data-role="Header" className="home-header home-header-dashboard">
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
        <div className="logoutUserbtn">
          <Button
            variant="outlined"
            size="small"
            className="logoutBtn"
            onClick={logout}>
            Logout
          </Button>
          <Typography color="primary" variant="h6" className="userName">
            {localStorage.getItem("userName").toUpperCase()}
          </Typography>
        </div>
      </header>
      <div className="main-container">
        <div className="adjustment-container">
          {/* <div className="unit-card-bar"> */}
          <div className="unit-display-ctrl-bar">
            <UnitDisplayCtrl />
          </div>
          {/* <CcsUnitCard ></CcsUnitCard> */}
          {/* </div> */}
          <Divider orientation="vertical" flexItem />
          {/* <div className="info-container">
              <iframe src="http://localhost:8080/d-solo/86Tcjtp4k/ccs-data-visualizer-test?orgId=1&var-unitIdSelect=1&var-unitIdSelect=2&from=1672498798500&to=1672501296500&refresh=5s&panelId=4" className="grafana-panel" title="CCS Speed Panel"></iframe>
              <Divider variant="middle" />
              <iframe src="http://localhost:8080/d-solo/86Tcjtp4k/ccs-data-visualizer-test?orgId=1&var-unitIdSelect=1&var-unitIdSelect=2&from=1672498798500&to=1672501296500&refresh=5s&panelId=2" className="grafana-graph" title="CCS Air Speed Graph"></iframe>
              <Divider variant="middle" />
              <iframe src="http://localhost:8080/d-solo/86Tcjtp4k/ccs-data-visualizer-test?orgId=1&var-unitIdSelect=1&var-unitIdSelect=2&from=1672500480157&to=1672502410982&panelId=7" className="grafana-graph" title="CCS Temperature Graph"></iframe>
          </div> */}
          <GraphContainer />
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

export default Home;
