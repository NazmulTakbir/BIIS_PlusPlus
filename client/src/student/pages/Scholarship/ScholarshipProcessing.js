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

const columnLabels = ["TYPE", "SESSION", "AMOUNT", "STATUS"];

const ScholarshipProcessing = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 4));

  useEffect(() => {
    fetchTableData(
      `/api/student/scholarship/${studentID}/processing`,
      4,
      {
        scholarship_name: 0,
        session_id: 1,
        amount: 2,
        scholarship_state: 3,
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScholarshipProcessing;
