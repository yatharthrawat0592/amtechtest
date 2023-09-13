import React, { useState } from 'react';
import "../components/common/css/login.css";

import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import {
  Button,
  TextField,
} from "@mui/material";

import {
  loginUser,
  getIpAddressFunc
  } from "../store/actions/login-register-logout-action";

const LoginPage = (props:any) => {

  const ACTIVE_SHADOW = {boxShadow: '0px 5px 10px 0px #3f3ae7'};
  const NO_SHADOW = {
    boxShadow: '0px 0px 0px 0px',
  };

  
  const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [getIpAddress, setIpAddress] = useState<string>("");

  const [isChange, setChange] = React.useState<boolean>(false);

    
    const navigate = useNavigate();

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
  };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const loginObj = {
        email:email,
        password:password,
        IpAddress:getIpAddress
      }
      
    const resp = await loginUser(loginObj);
    
    if (resp[0].message === "Maximum number of devices used!") {
      console.log("Maximum number of devices used!")
    }
    else if (resp?.length > 0) {
        navigate("/dashboard", { state: { token:"Home_Check"} });
      }
  };

  const redirectSignUp = () => {
    navigate("/register");
  }

  React.useEffect(() => {
    const getUsers = async () => {
      const getIpAddress = await getIpAddressFunc();
      setIpAddress(getIpAddress);
    };
  
    getUsers();
  }, []);

  return (
    <div>
      <h1 className='mainLoginLabel'>
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
        <div className='loginText'>Login</div>
      </h1>

      <div  onMouseEnter={() => setChange(true)} onMouseLeave={() => setChange(false)}>
        <Card sx={{minHeight: 215 }} 
              key={1} 
              className="login-card"
              style={isChange === true ? ACTIVE_SHADOW : NO_SHADOW}>

              <form onSubmit={handleSubmit} className='loginMain'>
              <div className='mainEmail'>

                <TextField
                  key={"email"}
                  name={"email"}
                  margin="dense"
                  id={"email"}
                  label={"Email"}
                  sx={{ m: 1, width: "25ch" }}
                  variant="filled"
                  type="text"
                  select={false ?? false}
                  placeholder="Enter email"
                  //value={email}
                  onChange={(e) => {
                    handleEmailChange(e);
                  }}
                />


                </div>
                <div className='mainPassword'>

                <TextField
                  key={"password"}
                  name={"password"}
                  margin="dense"
                  id={"password"}
                  label={"Password"}
                  sx={{ m: 1, width: "25ch" }}
                  variant="filled"
                  type="password"
                  select={false ?? false}
                  placeholder="Enter password"
                  //value={password}
                  onChange={(e) => {
                    handlePasswordChange(e);
                  }}
                />
              </div>

                <Button type="submit" variant="outlined" size="small" className="loginBtn">
                  Login
                </Button>

                {/* <Button variant="outlined" size="small" className="signUpBtn" onClick={redirectSignUp}>
                  SingUp
              </Button> */}

              </form>
              
      </Card>
    </div>

    </div>
  );
};

export default LoginPage;