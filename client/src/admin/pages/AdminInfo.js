import React, { useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import ComptrollerAdminProfile from "../../shared/components/AdminProfile/ComptrollerAdminProfile";
import OfficeAdminProfile from "../../shared/components/AdminProfile/OfficeAdminProfile";
import HallAdminProfile from "../../shared/components/AdminProfile/HallAdminProfile";
import DepartmentAdminProfile from "../../shared/components/AdminProfile/DepartmentAdminProfile"

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";


const AdminInfo = () => {
  const auth = useContext(AuthContext);

  const renderCell = () => {
    switch (auth.userType) {
      case "comptroller admin":
        return <ComptrollerAdminProfile/>    
      case "office admin":
        return <OfficeAdminProfile/>;
      case "hall admin":
        return <HallAdminProfile/>;
      case "department admin":
        return <DepartmentAdminProfile/>;
      default:
        return null;
    }
  };


  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <h1>AdminInfo</h1>
              {renderCell()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  
};

export default AdminInfo;
