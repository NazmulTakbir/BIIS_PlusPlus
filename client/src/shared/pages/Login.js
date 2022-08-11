import React, { useState, useContext } from "react";

import CustomButton from "./../components/CustomButton/CustomButton";
import { AuthContext } from "../context/AuthContext";
import BasicTextField from '@mui/material/TextField';
import Brand from "../components/Header/Brand";
import "./Login.css"

const Login = () => {
  const auth = useContext(AuthContext);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const attemptLogin = async (e) => {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userID,
        password: password,
      }),
    });
    const jsonData = await response.json();
    auth.login(jsonData.id, jsonData.userType, jsonData.token);
  };

  return (
    <React.Fragment>
      <div className="App">
        <div className="login-content">
          <div className="form-container">
            
            <form className="login-form">

              <Brand no_menu="true"/>

              <div className="login-text-container">
                <div className="login-text">Login to your Account</div>
              </div>

              <BasicTextField 
                id="email" 
                label="Username" 
                type="email"
                className="username"
                value={userID}
                required="false"
                variant="outlined" 
                onChange={(e) => setUserID(e.target.value)}
              />

              <BasicTextField 
                id="password" 
                label="Password" 
                className="password"
                type="password"
                value={password}
                required="true"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
              />                
              
              <CustomButton
                type="submit"
                label="Login"
                variant="contained"
                color="#ffffff"
                bcolor="#b13137"
                margin="24px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={attemptLogin}
              />
            </form>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
