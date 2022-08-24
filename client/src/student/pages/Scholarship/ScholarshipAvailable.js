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

const columnLabels = ["TYPE", "SESSION", "AMOUNT", "ACTION"];

const applyScholarship = async (args) => {
  if (window.confirm("Apply for this Scholarship?")) {
    const auth = args[1];
    console.log(args);
    try {
        await fetch(`/api/student/scholarship/apply/${args[0]}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        });
        alert("Application Sent Successfully!");
    } catch (err) {
      console.log(err);
    }    
  } else {
    return false;
  }
};

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
      row.push({
        type: "Buttons",
        data: {
          buttonList: [
            { 
              buttonText: "Apply", textColor: "white", backColor: "#697A8D",
              onClickFunction: applyScholarship,
              onClickArguments: [jsonData[i]["scholarship_id"], auth],
            },
            { 
              buttonText: "Download", textColor: "white", backColor: "#DB6066"
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

const ScholarshipAvailable = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/student/scholarship/available`, setTableData, auth);
  }, [auth, tableData]);

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

export default ScholarshipAvailable;
