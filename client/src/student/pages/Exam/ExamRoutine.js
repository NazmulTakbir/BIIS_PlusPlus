import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");
const columnLabels = ["COURSE ID", "COURSE TITLE", "DATE", "START", "END"];

const fetchTableData = async (api_route, setTableData) => {
  try {
    const response = await fetch(api_route);
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["course_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["course_name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["exam_date"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["start_time"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["end_time"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const ExamRoutine = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student//exam/${studentID}/routine`, setTableData);
  }, []);

  return (
    <React.Fragment>
      <div className="App">
        <Header />
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

export default ExamRoutine;
