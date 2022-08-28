import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { SearchMenuData } from "../../components/SearchMenuData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const columnLabels = ["TYPE", "SESSION", "AMOUNT", "STATUS"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["amount"] } });

      let state = "";
      if(jsonData[i]["scholarship_state"] === "awaiting_application") state = "Awaiting Application";
      else if(jsonData[i]["scholarship_state"] === "awaiting_provost") state = "Awaiting Provost Approval";
      else if(jsonData[i]["scholarship_state"] === "awaiting_head") state = "Awaiting Head Approval";
      else if(jsonData[i]["scholarship_state"] === "awaiting_comptroller") state = "Awaiting Comptroller Payment";
      else if(jsonData[i]["scholarship_state"] === "paid") state = "Paid";     
      else if(jsonData[i]["scholarship_state"] === "rejected_provost") state = "Rejected by Provost";
      else if(jsonData[i]["scholarship_state"] === "rejected_head") state = "Rejected by Head";
      else if(jsonData[i]["scholarship_state"] === "rejected_comptroller") state = "Rejected by Comptroller";

      row.push({ type: "PlainText", data: { value: state } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const ScholarshipProcessing = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student/scholarship/processing`, setTableData, auth);
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData}/>
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

export default ScholarshipProcessing;
