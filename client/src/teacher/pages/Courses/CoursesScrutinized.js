import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { getSearchBarData } from "../../components/SearchMenuData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import { SidebarData } from "../../components/SidebarData";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const studentTableColumns = ["STUDENT ID", "SCORE", "STATUS", "SELECT"];

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

let selectedList = [];

let allStudentIDs = [];

const CoursesScrutinized = () => {
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
        const response = await fetch(`/api/teacher/coursesscrutinized`, {
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

    const response = await fetch(`/api/teacher/coursecriteriabyscrutinizer/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = await response.json();

    setAvailableCriteria(jsonData["data"]);
    setNoCourseSelected(false);

    setSelectedCriteria("Select Criteria");
    setNoCriteriaSelected(true);
    setStudentTableData([]);
  };

  const checkListCallback = (studentID, actionType) => {
    if (actionType === "check") {
      selectedList.push(studentID);
    } else if (actionType === "uncheck") {
      selectedList.splice(selectedList.indexOf(studentID), 1);
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

        if (data[i]["status"] === "Awaiting Scrutiny" || data[i]["status"] === "Rejected by Dept Head") {
          row.push({ type: "CheckBox", data: { id: data[i]["studentID"], callback: checkListCallback } });
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

  const selectCriteria = async (value) => {
    fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${value}`);

    setSelectedCriteria(value);
    setNoCriteriaSelected(false);
  };

  const approveHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/teacher/scrutinize/approve/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(selectedList),
      });
      alert("Approved Successfully");

      selectedList = [];
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${selectedCriteria}`);
    } catch (err) {}
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/teacher/scrutinize/reject/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(selectedList),
      });
      alert("Rejected Successfully");

      selectedList = [];
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${selectedCriteria}`);
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
                      <h4>
                        <Table columnLabels={studentTableColumns} tableData={studentTableData} />
                      </h4>

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

export default CoursesScrutinized;
