import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray, generateTableData } from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");

const columnLabels = ["TYPE", "AMOUNT", "SPECIFICATION", "DEADLINE"];

const DuesPaid = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 4));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/dues/${studentID}/pendingdues`);
        const jsonData = await response.json();
        setTableData(
          generateTableData(jsonData["pending_dues_list"], 4, {
            description: 0,
            amount: 1,
            specification: 2,
            deadline: 3,
          })
        );
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
              <Table columnLabels={columnLabels} dataMatrix={tableData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DuesPaid;
