import React from "react";

import Sidebar from "../../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import Header from "../../../../shared/components/Header/Header";
import { SidebarData } from "../../../components/SidebarData";
import { NavbarData } from "../NavbarData";

import "../../../../shared/components/MainContainer.css";

const ViewGrades = () => {
  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <h1>ViewGrades</h1>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ViewGrades;
