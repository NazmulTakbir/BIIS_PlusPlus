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

const columnLabels = ["ACTIVITY", "FROM", "TO", "WEEKS"];

const GeneralInfoAcademicCalender = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 4));

  useEffect(() => {
    fetchTableData(
      `/api/student/generalinfo/${studentID}/academiccalender`,
      4,
      {
        description: 0,
        start_date: 1,
        end_date: 2,
        no_of_weeks: 3,
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

export default GeneralInfoAcademicCalender;
