import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";

const studentID = require("../../../placeHolder");

const GeneralInfoNotice = () => {
  const [notices, setNotices] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/generalinfo/${studentID}/notices`);
        const jsonData = await response.json();
        setNotices(jsonData);
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
              <p> {JSON.stringify(notices)} </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GeneralInfoNotice;