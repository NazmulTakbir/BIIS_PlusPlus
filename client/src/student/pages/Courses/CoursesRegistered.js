import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "STATUS"];

const fetchTableData = async (api_route, setTableData, setSessionData, auth) => {
  try {
    let response = await fetch(`/api/shared/session/getcurrent`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = (await response.json())["data"];
    setSessionData(jsonData);

    if (jsonData["registration_phase"] === "open" || jsonData["registration_phase"] === "closed") {
      const response = await fetch(api_route, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const jsonData = (await response.json())["data"];
      let tableData = [];
      for (let i = 0; i < jsonData.length; i++) {
        let row = [];
        row.push({ type: "PlainText", data: { value: jsonData[i]["course_id"] } });
        row.push({ type: "PlainText", data: { value: jsonData[i]["course_name"] } });
        row.push({ type: "PlainText", data: { value: jsonData[i]["credits"] } });
        row.push({ type: "PlainText", data: { value: jsonData[i]["reg_status"] } });
        tableData.push(row);
      }
      setTableData(tableData);
    }
  } catch (err) {
    console.log(err);
  }
};

const CoursesRegistered = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    fetchTableData(`/api/student/courses/registeredcourses`, setTableData, setSessionData, auth);
  }, [auth]);

  const renderPage = () => {
    if (tableData.length === 0) {
      return <h3>You Have Not Placed Any Registration Request For Session {sessionData.session_id}</h3>;
    } else {
      return (
        <React.Fragment>
          <div className="session-header" style={{margin: "auto", textAlign: "center"}}>
            <div className="session-text" style={{marginTop: "20px", fontSize: "17px", fontWeight: "bolder", color: "#b13137"}}>
              SESSION: {sessionData.session_id}
            </div>
          </div>
          <Table columnLabels={columnLabels} tableData={tableData} />
        </React.Fragment>
      );
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
              <Navbar NavbarData={NavbarData} />
              {renderPage()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesRegistered;
