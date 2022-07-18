import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray, fetchTableData } from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");

const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "SELECT"];

const CoursesAdd = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 3));

  useEffect(() => {
    fetchTableData(
      `/api/student/courses/${studentID}/coursestoadd`,
      3,
      {
        course_id: 0,
        course_name: 1,
        credits: 2,
      },
      setTableData
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} checkBox="true" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesAdd;
