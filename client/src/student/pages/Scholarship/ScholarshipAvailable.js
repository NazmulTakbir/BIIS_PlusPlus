import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");
const columnLabels = ["TYPE", "SESSION", "AMOUNT", "ACTION"];

const fetchTableData = async (api_route, setTableData) => {
  try {
    const response = await fetch(api_route);
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["amount"] } });
      row.push({
        type: "Buttons",
        data: {
          buttonList: [
            { buttonText: "Apply", textColor: "white", backColor: "#697A8D" },
            { buttonText: "Download", textColor: "white", backColor: "#DB6066" },
          ],
        },
      });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const ScholarshipAvailable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student/scholarship/${studentID}/available`, setTableData);
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

export default ScholarshipAvailable;
