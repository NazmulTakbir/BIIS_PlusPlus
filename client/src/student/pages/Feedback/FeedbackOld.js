import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");
const columnLabels = ["SUBJECT", "RECEIVER", "DATE", "DETAILS"];

const fetchTableData = async (api_route, setTableData) => {
  try {
    const response = await fetch(api_route);
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["subject"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["receiver_type"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["submission_date"] } });
      row.push({
        type: "SimpleModal",
        data: {
          buttonText: "View",
          header: jsonData[i]["subject"],
          body: jsonData[i]["details"],
        },
      });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const FeedbackOld = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student/feedback/${studentID}/pastsubmissions`, setTableData);
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
              <Table columnLabels={columnLabels} tableData={tableData} modal="true" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FeedbackOld;
