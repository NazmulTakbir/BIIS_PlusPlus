import React, { useEffect, useState } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { openInNewTab } from "../../../shared/util/OpenNewTab";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const teacherID = require("../../../placeHolder2");
const columnLabels = ["STUDENT ID", "REQUEST TYPE", "COURSE COUNT", "REQUEST DATE", "ACTION"];

const fetchTableData = async (api_route, setTableData) => {
  try {
    const response = await fetch(api_route);
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["request_type"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["req_count"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["request_date"] } });
      row.push({
        type: "Buttons",
        data: {
          buttonList: [
            {
              buttonText: "View Details",
              textColor: "white",
              backColor: "#697A8D",
              onClickFunction: openInNewTab,
              onClickArguments: ["/advisees/profile/registration/" + jsonData[i]["student_id"]],
            },
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

const CourseRegistration = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/teacher/advisees/${teacherID}/registrationsummary`, setTableData);
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

export default CourseRegistration;
