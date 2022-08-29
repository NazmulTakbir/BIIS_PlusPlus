import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Header from "../../../shared/components/Header/Header";
import Navbar from "../../../shared/components/Navbar/Navbar";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { getSearchBarData } from "../../components/SearchMenuData";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const resultTableColumns = ["STUDENT ID", "RESULT DETAILS", "STUDENT DETAILS", "SELECT"];

let selectedList = [];

let allStudents = [];

const PendingResults = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [resultTableData, setResultTableData] = useState([]);

  const checkListCallback = (studentID, actionType) => {
    if (actionType === "check") {
      selectedList.push(studentID);
    } else if (actionType === "uncheck") {
      selectedList.splice(selectedList.indexOf(studentID), 1);
    }
  };

  const fetchResultTableData = React.useCallback(
    async (api_route) => {
      try {
        const response = await fetch(api_route, {
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

          let student_details = [];
          for (let i = 0; i < jsonData[studentID].length; i++) {
            let temp = "Name: " + jsonData[studentID][i][4] + "\n";
            temp += "Department: " + jsonData[studentID][i][5] + "\n";
            temp += "Hall: " + jsonData[studentID][i][6] + "\n";
            temp += "Level: " + jsonData[studentID][i][7] + "\n";
            temp += "Term: " + jsonData[studentID][i][8] + "\n";
            student_details.push(temp);
          }

          let row = [];
          allStudents.push(studentID);
          row.push({ type: "PlainText", data: { value: studentID } });
          row.push({
            type: "MultiBodyModal",
            data: {
              buttonText: "View",
              header: "Result Details of " + studentID,
              body: result_details,
            },
          });
          row.push({
            type: "MultiBodyModal",
            data: {
              buttonText: "View",
              header: "Student Details of " + studentID,
              body: student_details,
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
    setSearchMenuData(getSearchBarData(auth.responsibilities));
    fetchResultTableData(`/api/teacher/examcontroller/pendingresults`);
  }, [auth, fetchResultTableData]);

  const approveHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/examcontroller/approveresults`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Approved Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchResultTableData(`/api/teacher/examcontroller/pendingresults`);
      }
    } catch (err) {}
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/examcontroller/rejectresults`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Rejected Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchResultTableData(`/api/teacher/examcontroller/pendingresults`);
      }
    } catch (err) {}
  };

  const approveAllHandler = async (e) => {
    e.preventDefault();
  };

  const rejectAllHandler = async (e) => {
    e.preventDefault();
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
              <Table columnLabels={resultTableColumns} tableData={resultTableData} modal="true" />

              {resultTableData.length > 0 ? (
                <div>
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
                        padding="10px"
                        fontSize="17px !important"
                      />
                    </form>
                  </Stack>
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
                    <form onSubmit={approveAllHandler}>
                      <CustomButton
                        type="submit"
                        label="Approve All"
                        variant="contained"
                        color="#ffffff"
                        bcolor="#b13137"
                        padding="10px"
                        fontSize="17px !important"
                      />
                    </form>

                    <form onSubmit={rejectAllHandler}>
                      <CustomButton
                        type="submit"
                        label=" Reject  All"
                        variant="contained"
                        color="#ffffff"
                        bcolor="#bdbdbd"
                        padding="10px"
                        fontSize="17px !important"
                      />
                    </form>
                  </Stack>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PendingResults;
