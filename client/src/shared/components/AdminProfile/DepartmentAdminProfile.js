import React, { useState, useEffect, useContext } from "react";
//import AuthContext
import { AuthContext } from "../../../shared/context/AuthContext";
import "./AdminProfile.css";

const DepartmentAdminProfile = (props) => {
    const auth = useContext(AuthContext);
    const [name, setName] = useState("");
    const [dept_name, setDept_name] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(`/api/admin/admininfo`, {
            headers: { Authorization: "Bearer " + auth.token },
            });
            const jsonData = await response.json();
            setName(jsonData.ProfileData.name);
            setDept_name(jsonData.ProfileData.dept_name);
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
                <div className="heading">Name: </div>
                <div className="text">{name}</div>
                <div className="heading">Department: </div>
                <div className="text">{dept_name}</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default DepartmentAdminProfile;
