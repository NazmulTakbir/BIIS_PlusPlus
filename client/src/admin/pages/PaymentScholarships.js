import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";

//import Table
import Table from "../../shared/components/Table/Table";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

const columnLabels = ["STUDENT ID", "NAME", "SESSION ID", "SCHOLARSHIP TYPE", "ACTION"];

let checkedScholarships = [];

const approveAddCallback = (id, actionType) => {
  if (actionType === "check") {
    checkedScholarships.push(id);
  } else if (actionType === "uncheck") {
    checkedScholarships.splice(checkedScholarships.indexOf(id), 1);
  }
};

//substring function

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });

    const jsonData = (await response.json())["data"];

    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({ type: "CheckBox", data: { id: jsonData[i]["scholarship_id"], callback: approveAddCallback } });

      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const PaymentScholarships = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [stateNo, setStateNo] = useState(0);
  const [addTableData, setAddTableData] = useState([]);

  const markAsPaid = async () => {
    if (window.confirm("Mask these Scholarship as Paid?")) {
      await fetch("/api/admin/comptroller/markscholarshipaspaid", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          schIDs: checkedScholarships,
        }),
      });
      checkedScholarships = [];
      setStateNo((stateNo + 1) % 100);
    } else {
      return;
    }
  };

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.userType));
    fetchTableData(`/api/admin/comptroller/pendingscholarships`, setAddTableData, auth);
  }, [auth, stateNo]);

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Table columnLabels={columnLabels} tableData={addTableData} />

              {addTableData.length > 0 ? (
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
              ) : (
                <br></br>
              )}

            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PaymentScholarships;
