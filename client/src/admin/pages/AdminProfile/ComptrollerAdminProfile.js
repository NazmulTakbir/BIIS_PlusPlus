import React, { useState, useEffect, useContext } from "react";
//import AuthContext
import { AuthContext } from "../../../shared/context/AuthContext";
import "./AdminProfile.css";

const ComptrollerAdminProfile = () => {
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/admininfo`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setName(jsonData.ProfileData.name);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" className="profile-pic" />

        <div className="profile-data">
          <div className="item">
            <div className="heading">Admin Type </div>
            <div className="text">{auth.userType}</div>
            <br />
            <div className="heading">Name: </div>
            <div className="text">{name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComptrollerAdminProfile;
