import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray } from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");

const columnLabels = ["DAY", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

const generateRoutineTable = (rawData) => {
  let dataMatrix = make2DArray(5, 10);

  const columnMap = {
    "8am": 1,
    "9am": 2,
    "10am": 3,
    "11am": 4,
    "12pm": 5,
    "1pm": 6,
    "2pm": 7,
    "3pm": 8,
    "4pm": 9,
  };

  const rowMap = {
    Saturday: 0,
    Sunday: 1,
    Monday: 2,
    Tuesday: 3,
    Wednesday: 4,
  };

  dataMatrix[0][0] = "SAT";
  dataMatrix[1][0] = "SUN";
  dataMatrix[2][0] = "MON";
  dataMatrix[3][0] = "TUES";
  dataMatrix[4][0] = "WED";

  for (const courseID in rawData) {
    const courseData = rawData[courseID];
    for (let classNo = 0; classNo < courseData.length; classNo++) {
      const row = rowMap[courseData[classNo]["day"]];
      const column = columnMap[courseData[classNo]["start_time"]];
      dataMatrix[row][column] = courseID;
    }
  }

  return dataMatrix;
};

const StudentInfoClassRoutine = () => {
  const [classRoutine, setClassRoutine] = useState(make2DArray(5, 10));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/studentinfo/${studentID}/classroutine`);
        const jsonData = await response.json();
        setClassRoutine(generateRoutineTable(jsonData));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
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
              <Table columnLabels={columnLabels} dataMatrix={classRoutine} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StudentInfoClassRoutine;
