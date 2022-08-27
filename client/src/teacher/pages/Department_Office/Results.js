import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import { SearchMenuData } from "../../components/SearchMenuData";
import Stack from "@mui/material/Stack";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const resultTableColumns = ["STUDENT ID", "GRADE POINT", "LETTER GRADE", "STATUS", "VIEW DETAILS", "SELECT"];
const pendingTableColumns = ["STUDENT ID", "VIEW DETAILS"];

let selectedList = [];

const DeptHeadResults = () => {
  const auth = useContext(AuthContext);
  const [course_id, setCourseID] = useState("Select Course");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [noCourseSelected, setNoCourseSelected] = useState(true);

  const [resultTableData, setResultTableData] = useState([]);
  const [pendingTableData, setPendingTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/departmenthead/offeredcourses`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setAvailableCourses(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const selectCourse = async (value) => {
    setCourseID(value);
    setNoCourseSelected(false);
    setResultTableData([]);
    setPendingTableData([]);

    fetchCompleteResultsData(`/api/teacher/departmenthead/preparedresults/${value}`, value);
    fetchPendingResultsData(`/api/teacher/departmenthead/pendingresults/${value}`, value);
  };

  const checkListCallback = (studentID, actionType) => {
    if (actionType === "check") {
      selectedList.push(studentID);
    } else if (actionType === "uncheck") {
      selectedList.splice(selectedList.indexOf(studentID), 1);
    }
  };

  const fetchPendingResultsData = async (api_route, course_id) => {
    try {
      let response = await fetch(api_route, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      let jsonData = await response.json();
      let data = jsonData["data"];

      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        let row = [];
        row.push({ type: "PlainText", data: { value: data[i]["student_id"] } });

        let detailsData = data[i]["details"];
        let detailsText = [];
        for (let j = 0; j < detailsData.length; j++) {
          let temp = "Criteria: " + detailsData[j]["criteria"] + "\n";
          temp += "Status: " + detailsData[j]["status"] + "\n";
          temp += "Course Teacher: " + detailsData[j]["course_teacher_name"] + "\n";
          if (detailsData[j]["scrutinizer_name"] === null) {
            temp += "Scrutinizer: None\n";
          } else {
            temp += "Scrutinizer: " + detailsData[j]["scrutinizer_name"] + "\n";
          }
          detailsText.push(temp);
        }

        row.push({
          type: "MultiBodyModal",
          data: {
            buttonText: "View",
            header: "Pending Marks for " + data[i]["student_id"],
            body: detailsText,
          },
        });
        tableData.push(row);
      }
      setPendingTableData(tableData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompleteResultsData = async (api_route, course_id) => {
    try {
      let response = await fetch(api_route, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      let jsonData = await response.json();
      let data = jsonData["data"];

      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        let row = [];
        row.push({ type: "PlainText", data: { value: data[i]["student_id"] } });
        row.push({ type: "PlainText", data: { value: data[i]["grade_point"] } });
        row.push({ type: "PlainText", data: { value: data[i]["letter_grade"] } });
        row.push({ type: "PlainText", data: { value: data[i]["status"] } });

        response = await fetch(`/api/teacher/departmenthead/resultdetails/${course_id}/${data[i]["student_id"]}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = (await response.json())["data"];

        let details = [];
        for (let i = 0; i < jsonData.length; i++) {
          details.push(jsonData[i]["criteria_name"] + " : " + jsonData[i]["marks"]);
        }

        row.push({
          type: "MultiBodyModal",
          data: {
            buttonText: "View",
            header: data[i]["student_id"],
            body: details,
          },
        });
        row.push({ type: "CheckBox", data: { id: data[i]["student_id"], callback: checkListCallback } });

        tableData.push(row);
      }
      setResultTableData(tableData);
    } catch (err) {
      console.log(err);
    }
  };

  const approveHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/departmenthead/approveresults/${course_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Approved Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchCompleteResultsData(`/api/teacher/departmenthead/preparedresults/${course_id}`, course_id);
      }
    } catch (err) {}
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    try {
      if (selectedList.length === 0) {
        alert("Please select atleast one student");
      } else {
        await fetch(`/api/teacher/departmenthead/rejectresults/${course_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify(selectedList),
        });
        alert("Rejected Successfully");
        selectedList = [];
        setResultTableData([]);
        fetchCompleteResultsData(`/api/teacher/departmenthead/preparedresults/${course_id}`, course_id);
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

              <Dropdown>
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                  {course_id}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {availableCourses.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => selectCourse(option)}>
                        {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <br />
              <br />

              {noCourseSelected ? null : (
                <div>
                  <div>
                    <h3>Result Awaiting Department Head Approval</h3>
                    <h4>
                      <Table columnLabels={resultTableColumns} tableData={resultTableData} />
                    </h4>

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
                  <h3>Results Not Prepared Yet</h3>
                  <Table columnLabels={pendingTableColumns} tableData={pendingTableData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DeptHeadResults;
