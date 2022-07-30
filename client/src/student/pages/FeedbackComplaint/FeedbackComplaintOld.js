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
const columnLabels = ["SUBJECT", "RECEIVER", "DATE", "DETAILS"];

const ScholarshipReceived = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 3));
  const [buttonMatrix, setButtonMatrix] = useState([]);

  useEffect(() => {
    fetchTableData(
      `/api/student/feedbackcomplaint/${studentID}/pastsubmissions`,
      3,
      {
        subject: 0,
        receiver_type: 1,
        submmission_date: 2,
      },
      setTableData
    );

    fetchButtonMatrix(
      `/api/student/feedbackcomplaint/${studentID}/pastsubmissions`,
      [["View", "#DB6066", "white"]],
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} modal="true"/>            
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScholarshipReceived;
