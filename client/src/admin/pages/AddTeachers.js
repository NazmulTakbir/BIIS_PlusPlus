import React from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import "../../shared/components/MainContainer.css";

const AddTeachers = () => {
  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <h1>AddTeachers</h1>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddTeachers;
