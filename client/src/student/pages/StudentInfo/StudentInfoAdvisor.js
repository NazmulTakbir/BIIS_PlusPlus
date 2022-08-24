import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { SearchMenuData } from "../../components/SearchMenuData";

import "../../../shared/components/MainContainer.css";
import AdvisorProfile from "../../../shared/components/TeacherProfile/TeacherProfile";
import { AuthContext } from "../../../shared/context/AuthContext";

const StudentInfoAdvisor = () => {
  const auth = useContext(AuthContext);
  const [advisorInfo, setAdvisorInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/studentinfo/advisor`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setAdvisorInfo(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData}/>
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <AdvisorProfile ProfileData={advisorInfo} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StudentInfoAdvisor;
