import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import {
  make2DArray,
  fetchTableData,
} from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");
const level = 4;
const term = 1;

const columnLabels = [
  "COURSE ID",
  "COURSE TITLE",
  "CREDIT HOURS",
  "GRADE",
  "GRADE POINT",
];

const ExamGrades = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 5));
  const [extraData, setExtraData] = useState({});

  useEffect(() => {
    fetchTableData(
      `/api/student/exam/${studentID}/grades/${level}/${term}`,
      5,
      {
        course_id: 0,
        course_name: 1,
        credits: 2,
        letter_grade: 3,
        grade_point: 4,
      },
      setTableData,
      setExtraData
    );
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} />
              
              <div
                className="gpa-text"
                style={{
                  fontWeight: "bolder",
                  color: "rgb(105 122 141)",
                  width: "max-content",
                  border: "1px solid",
                  margin: "30px auto auto auto",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                GPA for Term: {String(extraData.gpa).substring(0, 4)}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ExamGrades;
