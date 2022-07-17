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

const columnLabels = ["HALL NAME", "SUPERVISOR NAME", "MOBILE NUMBER", "EMAIL ADDRESS"];

const GeneralInfoHallSupervisor = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 4));

  useEffect(() => {
    fetchTableData(
      `/api/student/generalinfo/${studentID}/hallinfo`,
      4,
      {
        hall_name: 0,
        supervisor_name: 1,
        supervisor_phone: 2,
        supervisor_email: 3,
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

export default GeneralInfoHallSupervisor;
