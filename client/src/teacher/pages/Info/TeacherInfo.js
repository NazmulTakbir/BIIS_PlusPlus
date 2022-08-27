import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Header from "../../../shared/components/Header/Header";
import Navbar from "../../../shared/components/Navbar/Navbar";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { getSearchBarData } from "../../components/SearchMenuData";

import "../../../shared/components/MainContainer.css";
import TeacherProfile from "../../../shared/components/TeacherProfile/TeacherProfile";
import { AuthContext } from "../../../shared/context/AuthContext";

const TeacherInfo = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.responsibilities));
        const response = await fetch(`/api/teacher/teacherinfo`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setTeacherInfo(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <TeacherProfile ProfileData={teacherInfo} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeacherInfo;
