import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { SearchMenuData } from "../../components/SearchMenuData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "./../../../shared/components/CustomButton/CustomButton";

const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "SELECT"];

const coursesToAdd = [];

const checkBoxCallBack = (id, actionType) => {
  if (actionType === "check") {
    coursesToAdd.push(id);
  } else if (actionType === "uncheck") {
    coursesToAdd.splice(coursesToAdd.indexOf(id), 1);
  }
};

const fetchTableData = async (api_route, setTableData, setSessionData, auth) => {
  try {
    let response = await fetch(`/api/shared/session/getcurrent`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = (await response.json())["data"];
    setSessionData(jsonData);

    if (jsonData["registration_phase"] === "open") {
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
        row.push({ type: "CheckBox", data: { id: jsonData[i]["offering_id"], callback: checkBoxCallBack } });
        tableData.push(row);
      }
      setTableData(tableData);
    }
  } catch (err) {
    console.log(err);
  }
};

const CoursesAdd = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [sessionData, setSessionData] = useState({});

  const submissionHandler = async () => {
    try {
      if (coursesToAdd.length === 0) {
        alert("Please select at least one course to add");
      } else {
        const response = await fetch(`/api/student/courses/addRequest`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            offeringIDs: coursesToAdd,
            submission_date: new Date(),
          }),
        });
        console.log(response.json);
        window.location.pathname = "/courses/pending";
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchTableData(`/api/student/courses/coursestoadd`, setTableData, setSessionData, auth);
  }, [auth]);

  const renderPage = () => {
    switch (sessionData.registration_phase) {
      case "not started":
        return <h3>Registration Still Not Opened For Session {sessionData.session_id}</h3>;
      case "closed":
        return <h3>Registration Closed For Session {sessionData.session_id}</h3>;
      case "open":
        return (
          <React.Fragment>
            <div
              className="session-header"
              style={{ margin: "auto", textAlign: "center" }}
            >
              <div
                className="session-text"
                style={{
                  marginTop: "20px",
                  fontSize: "17px",
                  fontWeight: "bolder",
                  color: "#b13137",
                }}
              >
                SESSION: {sessionData.session_id}
              </div>
            </div>


            <Table columnLabels={columnLabels} tableData={tableData} />
            {tableData.length > 0 ? (
              <CustomButton
                label="Submit Add Request"
                variant="contained"
                color="white"
                bcolor="#b13137"
                width="150px"
                onClickFunction={submissionHandler}
                onClickArguments={[]}
              />                
              ): (
                <div></div>
              )}              
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData}/>
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
