import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "./../../../shared/components/CustomButton/CustomButton";

const studentID = require("../../../placeHolder");
const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "SELECT"];

const coursesToAdd = [];

const checkBoxCallBack = (id, actionType) => {
  if (actionType === "check") {
    coursesToAdd.push(id);
  } else if (actionType === "uncheck") {
    coursesToAdd.splice(coursesToAdd.indexOf(id), 1);
  }
};

const CoursesAdd = () => {
  const [tableData, setTableData] = useState([]);
  const [sessionData, setSessionData] = useState({});

  const fetchTableData = async (api_route, setTableData) => {
    try {
      let response = await fetch(`/api/shared/session/getcurrent`);
      let jsonData = (await response.json())["data"];
      setSessionData(jsonData);

      if (jsonData["registration_phase"] === "open") {
        const response = await fetch(api_route);
        const jsonData = (await response.json())["data"];
        let tableData = [];
        for (let i = 0; i < jsonData.length; i++) {
          let row = [];
          row.push({ type: "PlainText", data: { value: jsonData[i]["course_id"] } });
          row.push({ type: "PlainText", data: { value: jsonData[i]["course_name"] } });
          row.push({ type: "PlainText", data: { value: jsonData[i]["credits"] } });
          row.push({ type: "CheckBox", data: { id: jsonData[i]["offering_id"], callback: checkBoxCallBack } });
          tableData.push(row);
        }
        setTableData(tableData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submissionHandler = async () => {
    try {
      console.log(coursesToAdd);
      // window.location.pathname = "/courses/drop";
    } catch (err) {}
  };

  useEffect(() => {
    fetchTableData(`/api/student/courses/${studentID}/coursestoadd`, setTableData);
  }, []);

  const renderPage = () => {
    switch (sessionData.registration_phase) {
      case "not started":
        return <h3>Registration Still Not Opened For Session {sessionData.session_id}</h3>;
      case "closed":
        return <h3>Registration Closed For Session {sessionData.session_id}</h3>;
      case "open":
        return (
          <React.Fragment>
            <h3>SESSION: {sessionData.session_id}</h3>
            <CustomButton
              label="Submit Add Request"
              variant="contained"
              color="white"
              bcolor="red"
              onClickFunction={submissionHandler}
              onClickArguments={[]}
            />
            <Table columnLabels={columnLabels} tableData={tableData} />;
          </React.Fragment>
        );
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
              <Navbar NavbarData={NavbarData} />
              {renderPage()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesAdd;
