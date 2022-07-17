import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray, fetchTableData, fetchButtonMatrix } from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");

const columnLabels = ["TYPE", "SESSION", "AMOUNT", "ACTION"];

const ScholarshipAvailable = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 3));
  const [buttonMatrix, setButtonMatrix] = useState([]);

  useEffect(() => {
    fetchTableData(
      `/api/student/scholarship/${studentID}/available`,
      3,
      {
        scholarship_name: 0,
        session_id: 1,
        amount: 2,
      },
      setTableData
    );

    fetchButtonMatrix(
      `/api/student/scholarship/${studentID}/available`,
      [
        ["Apply", "#697A8D", "white"],
        ["Download", "#DB6066", "white"],
      ],
      setButtonMatrix
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} buttonMatrix={buttonMatrix} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScholarshipAvailable;
