import React, { useState, useContext } from "react";

import Textbox from "../components/Textbox/Textbox";
import CustomButton from "./../components/CustomButton/CustomButton";
import { AuthContext } from "../context/AuthContext";

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
        <div className="wrapper">
          <div className="main_container">
            <div className="content">
              <Textbox
                width="350px"
                height="46px"
                resize="none"
                name="course_id"
                padding="0px"
                fontSize="17px"
                placeholder=""
                label="User ID:"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
              <Textbox
                width="350px"
                height="46px"
                resize="none"
                name="course_id"
                padding="0px"
                fontSize="17px"
                placeholder=""
                label="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CustomButton
                type="submit"
                label="Login"
                variant="contained"
                color="#ffffff"
                bcolor="#b13137"
                margin="40px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={attemptLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
