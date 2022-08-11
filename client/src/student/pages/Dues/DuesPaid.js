import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");
const columnLabels = ["TYPE", "AMOUNT", "SPECIFICATION", "PAYMENT DATE"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["description"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["amount"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["specification"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["payment_date"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const DuesPaid = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student/dues/${studentID}/paiddues`, setTableData, auth);
  }, [auth]);

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

export default DuesPaid;
