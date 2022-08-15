import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Header from "../../../shared/components/Header/Header";
import Navbar from "../../../shared/components/Navbar/Navbar";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const columnLabels = ["STUDENT ID", "NAME", "SESSION ID", "SCHOLARSHIP TYPE", "STATE"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, { headers: { Authorization: "Bearer " + auth.token } });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_state"] } });

      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const AllScholarships = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/teacher/hallprovost/allrequests`, setTableData, auth);
  }, [auth, tableData]);

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

export default AllScholarships;


