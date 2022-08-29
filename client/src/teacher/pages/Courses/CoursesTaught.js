import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import { getSearchBarData } from "../../components/SearchMenuData";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import { display } from "@mui/system";

const studentTableColumns = ["STUDENT ID", "CURRENT SCORE", "STATUS", "EDIT SCORE"];

let studentMarks = {};

let allStudentIDs = [];

const boxStyle = {
  bgcolor: "background.paper",
  border: "1px solid #bdbdbd",
  boxShadow: 1,
  p: 4,
  padding: "15px 32px 15px 32px",
  textAlign: "left",
  width: "80%",
  margin: "auto",
  borderRadius: "10px !important",
  marginTop: "25px",
};

const CoursesTaught = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [course_id, setCourseID] = useState("Select Course");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [noCourseSelected, setNoCourseSelected] = useState(true);

  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("Select Criteria");
  const [noCriteriaSelected, setNoCriteriaSelected] = useState(true);
  const [studentTableData, setStudentTableData] = useState([]);

  const [criteria_weight, setCriteriaWeight] = useState("");
  const [total_marks, setTotalMarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.responsibilities));
        const response = await fetch(`/api/teacher/coursestaught`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        setAvailableCourses(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const studentMarksCallback = (mark, args, setValue) => {
    const studentID = args[0];
    const total_marks = args[1];
    if (mark === "") {
      setValue("");
      if (studentID in studentMarks) {
        delete studentMarks[studentID];
      }
    } else {
      if (/^\d+$/.test(mark)) {
        if (mark >= 0 && mark <= total_marks) {
          studentMarks[studentID] = mark;
          setValue(mark);
        } else {
          setValue("");
          alert("Invalid Score");
        }
      } else {
        alert("Please enter a valid number");
        setValue("");
        if (studentID in studentMarks) {
          delete studentMarks[studentID];
        }
      }
    }
  };

  const fetchStudentData = async (api_route) => {
    try {
      const response = await fetch(api_route, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      let jsonData = await response.json();

      setTotalMarks(jsonData["total_marks"]);
      setCriteriaWeight(jsonData["criteria_weight"]);

      let data = jsonData["data"];
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        let row = [];
        allStudentIDs.push(data[i]["student_id"]);
        row.push({ type: "PlainText", data: { value: data[i]["studentID"] } });
        row.push({ type: "PlainText", data: { value: data[i]["marks"] } });
        row.push({ type: "PlainText", data: { value: data[i]["status"] } });

        if (
          data[i]["status"] === "No Score Added" ||
          data[i]["status"] === "Added by Course Teacher" ||
          data[i]["status"] === "Rejected by Scrutinizer" ||
          data[i]["status"] === "Rejected by Dept Head"
        ) {
          row.push({
            type: "TextboxCell",
            data: {
              callback: studentMarksCallback,
              callbackArguments: [data[i]["studentID"], jsonData["total_marks"]],
            },
          });
        } else {
          row.push({
            type: "empty",
          });
        }

        tableData.push(row);
      }

      setStudentTableData(tableData);
    } catch (err) {
      console.log(err);
    }
  };

  const selectCourse = async (value) => {
    setCourseID(value);

    const response = await fetch(`/api/teacher/coursecriteriabyteacher/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = await response.json();

    setAvailableCriteria(jsonData["data"]);
    setNoCourseSelected(false);

    setSelectedCriteria("Select Criteria");
    setNoCriteriaSelected(true);
    setStudentTableData([]);

    studentMarks = {};
  };

  const selectCriteria = async (value) => {
    fetchStudentData(`/api/teacher/studentmarks/${course_id}/${value}`);

    setSelectedCriteria(value);
    setNoCriteriaSelected(false);
  };

  const saveScoresHandler = async (e) => {
    e.preventDefault();
    if (Object.keys(studentMarks).length === 0) {
      alert("Nothing to Submit");
      return;
    }
    try {
      await fetch(`/api/teacher/studentmarks/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(studentMarks),
      });
      alert("Scores submitted successfully");

      studentMarks = {};
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/studentmarks/${course_id}/${selectedCriteria}`);
    } catch (err) {}
  };

  const sendForScrutinyHandler = async (e) => {
    e.preventDefault();

    let studentIDs = [];
    for (let i = 0; i < studentTableData.length; i++) {
      const status = studentTableData[i][2]["data"]["value"];
      if (status === "Added by Course Teacher") {
        studentIDs.push(studentTableData[i][0]["data"]["value"]);
      }
    }

    if (Object.keys(studentIDs).length === 0) {
      alert("Nothing to Submit");
    } else {
      await fetch(`/api/teacher/sendForScrutiny/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(studentIDs),
      });

      alert("Sent For Scrutiny Successfully");

      studentMarks = {};
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/studentmarks/${course_id}/${selectedCriteria}`);
    }
  };

  const saveAllScoresHandler = async (e) => {
    
  };

  const sendAllForScrutinyHandler = async (e) => {
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
                  <Dropdown>
                    <Dropdown.Toggle variant="danger" id="dropdown-basic">
                      {selectedCriteria}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {availableCriteria.map((option, optionNo) => {
                        return (
                          <Dropdown.Item key={optionNo} onClick={() => selectCriteria(option)}>
                            {option}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>

                  <br />

                  {noCriteriaSelected ? null : (
                    <div>
                      <Box id="modal-box" sx={boxStyle}>
                        <Typography id="modal-marks" sx={{ display: "flex", justifyContent: "space-around" }}>
                          <span style={{ fontSize: "20px", color: "grey", fontWeight: "bolder", padding: "15px" }}>
                            Total Marks: {total_marks}
                          </span>
                          <span style={{ fontSize: "20px", color: "grey", fontWeight: "bolder", padding: "15px" }}>
                            Criteria Weight: {criteria_weight}
                          </span>
                        </Typography>
                      </Box>

                      <Table columnLabels={studentTableColumns} tableData={studentTableData} />

                      {studentTableData.length > 0 ? (
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
                            <form onSubmit={saveScoresHandler}>
                              <CustomButton
                                type="submit"
                                label="Save  Scores"
                                variant="contained"
                                color="#ffffff"
                                bcolor="#b13137"
                                width="100px"
                                padding="10px"
                                fontSize="17px !important"
                              />
                            </form>

                            <form onSubmit={sendForScrutinyHandler}>
                              <CustomButton
                                type="submit"
                                label="Send For Scrutiny"
                                variant="contained"
                                color="#ffffff"
                                bcolor="#bdbdbd"
                                width="100px"
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
                            <form onSubmit={saveAllScoresHandler}>
                              <CustomButton
                                type="submit"
                                label="Save All Scores"
                                variant="contained"
                                color="#ffffff"
                                bcolor="#b13137"
                                width="100px"
                                padding="10px"
                                fontSize="17px !important"
                              />
                            </form>

                            <form onSubmit={sendAllForScrutinyHandler}>
                              <CustomButton
                                type="submit"
                                label="Send All To Scrutiny"
                                variant="contained"
                                color="#ffffff"
                                bcolor="#bdbdbd"
                                width="100px"
                                padding="10px"
                                fontSize="17px !important"
                              />
                            </form>
                          </Stack>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesTaught;
