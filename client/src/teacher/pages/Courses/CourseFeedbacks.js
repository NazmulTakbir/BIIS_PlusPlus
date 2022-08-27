import React, { useState, useEffect, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { getSearchBarData } from "../../components/SearchMenuData";
import { AuthContext } from "../../../shared/context/AuthContext";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const columnLabels = ["COURSE ID", "SESSION", "SUBJECT", "STUDENT ID", "DATE", "DETAILS"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, { headers: { Authorization: "Bearer " + auth.token } });
    const jsonData = (await response.json())["data"];

    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["course_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["subject"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["submission_date"].substring(0, 10) } });
      row.push({
        type: "SimpleModal",
        data: {
          buttonText: "View",
          header: jsonData[i]["subject"],
          body: jsonData[i]["details"],
        },
      });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const CourseFeedbacks = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.responsibilities));
    fetchTableData(`/api/teacher/courses/feedbacks`, setTableData, auth);
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
              <Table columnLabels={columnLabels} tableData={tableData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CourseFeedbacks;