import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { SearchMenuData } from "../components/SearchMenuData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";


//import Table
import Table from "../../shared/components/Table/Table";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

const columnLabels = ["STUDENT ID", "DUES TYPE", "AMOUNT" ,"DEADLINE", "MARK"];

let checkedDues = [];

const approveAddCallback = (id, actionType) => {
  if (actionType === "check") {
    checkedDues.push(id);
  } else if (actionType === "uncheck") {
    checkedDues.splice(checkedDues.indexOf(id), 1);
  }
};

//substring function

const fetchTableData = async (api_route, setAddTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];

    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["description"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["amount"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["deadline"].substring(0,10) } });

      row.push({ type: "CheckBox", data: { id: jsonData[i]["dues_id"], callback: approveAddCallback } });
      tableData.push(row);
    }
    setAddTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const PaymentDues = () => {
  const auth = useContext(AuthContext);
  const [stateNo, setStateNo] = useState(0);
  const [addTableData, setAddTableData] = useState([]);

  const markAsPaid = async () => {
    await fetch("/api/admin/comptroller/markduesaspaid", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        duesIDs: checkedDues,
      }),
    });
    checkedDues = [];

    setStateNo((stateNo + 1) % 100);
  };

  useEffect(() => {
    fetchTableData(`/api/admin/comptroller/pendingdues`, setAddTableData, auth);
  }, [auth, stateNo]);


  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
           
              <h3>Pending Dues</h3>
              <Table columnLabels={columnLabels} tableData={addTableData} />

              <Stack
                spacing={2}
                direction="row"
                style={{
                  margin: "auto",
                  width: "350px",
                  padding: "10px",
                  textAlign: "left",
                  justifyContent: "space-between",
                }}
              >
                <CustomButton
                  label="Mark as Paid"
                  variant="contained"
                  color="white"
                  bcolor="#697A8D"
                  width="150px"
                  onClickFunction={markAsPaid}
                  
                />
          
              </Stack>
              
            
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PaymentDues;
