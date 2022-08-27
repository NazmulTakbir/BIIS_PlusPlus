import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Header from "../../../shared/components/Header/Header";
import Navbar from "../../../shared/components/Navbar/Navbar";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { SearchMenuData } from "../../components/SearchMenuData";
import { openInNewTab } from "../../../shared/util/OpenNewTab";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const tableColumns = ["STUDENT ID", "STATUS", "RESULT DETAILS", "STUDENT DETAILS", "SELECT"];

let selectedList = [];

const PendingResults = () => {
  const auth = useContext(AuthContext);
  const [resultTableData, setResultTableData] = useState([]);

  const checkListCallback = (studentID, actionType) => {
    if (actionType === "check") {
      selectedList.push(studentID);
    } else if (actionType === "uncheck") {
      selectedList.splice(selectedList.indexOf(studentID), 1);
    }
  };

  const fetchCompleteResultsData = React.useCallback(
    async (api_route) => {
      try {
        const response = await fetch(`/api/teacher/hallprovost/pendingresults`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = (await response.json())["data"];

        let tableData = [];
        for (let studentID in jsonData) {
          let result_details = [];
          for (let i = 0; i < jsonData[studentID].length; i++) {
            let temp = "Course: " + jsonData[studentID][i][1] + "\n";
            temp += "Letter Grade: " + jsonData[studentID][i][3] + "\n";
            temp += "Grade Point: " + jsonData[studentID][i][2] + "\n";
            result_details.push(temp);
          }

          let row = [];
          row.push({ type: "PlainText", data: { value: studentID } });
          row.push({ type: "PlainText", data: { value: jsonData[studentID][0][4] } });
          row.push({
            type: "MultiBodyModal",
            data: {
              buttonText: "View",
              header: "Result Details of " + studentID,
              body: result_details,
            },
          });
          row.push({
            type: "Buttons",
            data: {
              buttonList: [
                {
                  buttonText: "View Details",
                  textColor: "white",
                  backColor: "#697A8D",
                  onClickFunction: openInNewTab,
                  onClickArguments: ["/hallissues/profile/info/" + studentID],
                },
              ],
            },
          });
          row.push({ type: "CheckBox", data: { id: studentID, callback: checkListCallback } });
          tableData.push(row);
        }
        setResultTableData(tableData);
      } catch (err) {
        console.log(err);
      }
    },
    [auth]
  );

  useEffect(() => {
    fetchCompleteResultsData(`/api/teacher/hallprovost/pendingresults`);
  }, [auth, fetchCompleteResultsData]);

  const approveHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/hallprovost/approveresults`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Approved Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchCompleteResultsData(`/api/teacher/hallprovost/pendingresults`);
      }
    } catch (err) {}
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/hallprovost/rejectresults`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Rejected Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchCompleteResultsData(`/api/teacher/hallprovost/pendingresults`);
      }
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <Table columnLabels={tableColumns} tableData={resultTableData} />

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
                <form onSubmit={approveHandler}>
                  <CustomButton
                    type="submit"
                    label="Approve Selected"
                    variant="contained"
                    color="#ffffff"
                    bcolor="#b13137"
                    margin="40px"
                    padding="10px"
                    fontSize="17px !important"
                  />
                </form>

                <form onSubmit={rejectHandler}>
                  <CustomButton
                    type="submit"
                    label="Reject Selected"
                    variant="contained"
                    color="#ffffff"
                    bcolor="#bdbdbd"
                    margin="40px"
                    padding="10px"
                    fontSize="17px !important"
                  />
                </form>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PendingResults;
