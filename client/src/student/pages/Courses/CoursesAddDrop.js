import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";

const studentID = require("../../../placeHolder");

const CoursesAddDrop = () => {
  const [coursesToAdd, setCoursesToAdd] = useState();
  const [coursesToDrop, setCoursesToDrop] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/student/courses/${studentID}/coursestoadd`);
        let jsonData = await response.json();
        setCoursesToAdd(jsonData);

        response = await fetch(`/api/student/courses/${studentID}/coursestodrop`);
        jsonData = await response.json();
        setCoursesToDrop(jsonData);
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
              <p> {JSON.stringify(coursesToAdd)} </p>
              <p> {JSON.stringify(coursesToDrop)} </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesAddDrop;
