import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Profile from "../../components/Profile/Profile";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const studentID = require("../../../placeHolder");

const StudentInfoHome = () => {
  const auth = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/studentinfo/${studentID}/home`, {
          headers: { Authorization: "Bearer " + auth.token },
        });

        const jsonData = await response.json();
        setStudentInfo(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <Profile ProfileData={studentInfo} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StudentInfoHome;
