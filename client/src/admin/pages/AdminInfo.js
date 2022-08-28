import React, { useContext, useState, useEffect } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";

import ComptrollerAdminProfile from "./AdminProfile/ComptrollerAdminProfile";
import OfficeAdminProfile from "./AdminProfile/OfficeAdminProfile";
import HallAdminProfile from "./AdminProfile/HallAdminProfile";
import DepartmentAdminProfile from "./AdminProfile/DepartmentAdminProfile";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";

const AdminInfo = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.userType));
  }, [auth]);

  const renderCell = () => {
    switch (auth.userType) {
      case "comptroller admin":
        return <ComptrollerAdminProfile />;
      case "office admin":
        return <OfficeAdminProfile />;
      case "hall admin":
        return <HallAdminProfile />;
      case "department admin":
        return <DepartmentAdminProfile />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">

              <div 
                  className="admin-profile-container"
                  style={{
                    width:"400px", margin: "40px auto", background: "linear-gradient(45deg, #fff3e3, white)",
                    padding: "30px", borderRadius: "10px", border: "1px solid grey",
              }}>
                
                <div className="header-text"
                    style={{
                      color: "#b13127", fontSize: "17px", fontWeight: "bold",
                      margin: "30px auto 10px auto",
                    }}>Admin Information
                </div>      
                {renderCell()}

              </div>

            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminInfo;
