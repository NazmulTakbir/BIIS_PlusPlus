import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import Textbox from "../../../shared/components/Textbox/Textbox";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const criteriaColumns = ["CRITERIA NAME", "WEIGHT", "TOTAL MARKS", "ASSIGNED TEACHER"];
const columnLabels = ["CRITERIA NAME", "WEIGHT", "TOTAL MARKS", "ASSIGNED TEACHER"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["criteria_name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["criteria_weight"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["total_marks"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["teacher_name"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const CoursesCoordinated = () => {
  const auth = useContext(AuthContext);

  const [course_id, setCourseID] = useState("Select Course");
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(true);

  const [tableData, setTableData] = useState([]);
  const [criteriaTable, setCriteriaTable] = useState([]);
  const [newCriteria, setNewCriteria] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newTotalMarks, setNewTotalMarks] = useState("");
  const [newAssignedTeacher, setNewAssignedTeacher] = useState("");
  const [availableTeachers, setAvailableTeachers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/coursescoordinated`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setDropDownOptions(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const dropDownSelect = async (value) => {
    fetchTableData(`/api/teacher/markingcriteria/${value}`, setCriteriaTable, auth);

    setCourseID(value);

    const response = await fetch(`/api/teacher/assignedteachers/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = await response.json();
    setAvailableTeachers(jsonData["data"]);

    setNoneSelected(false);
  };

  const addCriteriaHandler = async (e) => {
    e.preventDefault();
    if (
      newCriteria === "" ||
      newWeight === "" ||
      newTotalMarks === "" ||
      newAssignedTeacher === "" ||
      course_id === "Select Course"
    ) {
      alert("Please fill all fields");
    } else {
      try {
        await fetch(`/api/teacher/newmarkingcriteria`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            criteria_name: newCriteria,
            criteria_weight: newWeight,
            total_marks: newTotalMarks,
            teacher_id: newAssignedTeacher,
            course_id: course_id,
          }),
        });

        fetchTableData(`/api/teacher/markingcriteria/${course_id}`, setCriteriaTable, auth);

        setNewAssignedTeacher("");
        setNewCriteria("");
        setNewWeight("");
        setNewTotalMarks("");

        alert("Criteria Added Successfully");
      } catch (err) {}
    }
  };

  const addGradingBoundaryHandler = async (e) => {
    e.preventDefault();
    // try {
    //   let data = [
    //     {
    //       dues_type_id: dues_type_id,
    //       student_id: student_id,
    //       specification: specification,
    //       deadline: deadline,
    //       dues_status: "Not Paid",
    //     },
    //   ];
    //   await fetch(`/api/admin/dues/add`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
    //     body: JSON.stringify({
    //       data: data,
    //     }),
    //   });

    //   setDues_type_id("");
    //   setStudent_id("");
    //   setSpecification("");
    //   setDeadline("");

    //   alert("Dues Added Successfully");
    // } catch (err) {}
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header />
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
                  {dropDownOptions.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => dropDownSelect(option)}>
                        {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              {noneSelected ? null : (
                <div>
                  <br />
                  <h4>Mark Distribution Policy</h4>
                  <Table columnLabels={criteriaColumns} tableData={criteriaTable} />
                  <br />
                  <h5>Add Criteria</h5>

                  <form onSubmit={addCriteriaHandler} style={{ width: "350px", margin: "auto" }}>
                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Criteria Name"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Criteria Name"
                      value={newCriteria}
                      onChange={(e) => setNewCriteria(e.target.value)}
                    />

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Weight"
                      padding="0px"
                      type="number"
                      fontSize="17px"
                      placeholder=""
                      label="Weight"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Total Marks"
                      padding="0px"
                      type="number"
                      fontSize="17px"
                      placeholder=""
                      label="Total Marks"
                      value={newTotalMarks}
                      onChange={(e) => setNewTotalMarks(e.target.value)}
                    />

                    <FormControl fullWidth style={{ marginTop: "25px" }}>
                      <InputLabel id="demo-simple-select-label">Assigned Teacher</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="dues_type_id"
                        name="teacher"
                        value={newAssignedTeacher}
                        label="Assigned Teacher"
                        onChange={(e) => setNewAssignedTeacher(e.target.value)}
                      >
                        {availableTeachers.map((val, key) => {
                          return (
                            <MenuItem key={key} value={val.teacher_id}>
                              {val.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <CustomButton
                      type="submit"
                      label="Submit"
                      variant="contained"
                      color="#ffffff"
                      bcolor="#b13137"
                      margin="40px"
                      padding="10px"
                      fontSize="17px !important"
                    />
                  </form>

                  <br />
                  <br />
                  <h4>Grade Distribution Policy</h4>
                  <Table columnLabels={columnLabels} tableData={tableData} />
                  <br />
                  <h5>Add Policy</h5>
                  <form onSubmit={addCriteriaHandler} style={{ width: "350px", margin: "auto" }}>
                    <FormControl fullWidth style={{ marginTop: "25px" }}>
                      <InputLabel id="demo-simple-select-label">Dues Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="dues_type_id"
                        name="dues_type_id"
                        // value={dues_type_id}
                        label="Dues Type"
                        // onChange={(e) => setDues_type_id(e.target.value)}
                      >
                        {/* {dues_type_list.map((val, key) => {
                          return (
                            <MenuItem key={key} value={val.dues_type_id}>
                              {val.description}
                            </MenuItem>
                          );
                        })} */}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth style={{ marginTop: "25px" }}>
                      <InputLabel id="demo-simple-select-label">Select Student</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="student_id"
                        name="student_id"
                        // value={student_id}
                        // label="Student"
                        // onChange={(e) => setStudent_id(e.target.value)}
                      >
                        {/* {students_list.map((val, key) => {
                          return (
                            <MenuItem key={key} value={val.student_id}>
                              {val.name} - {val.student_id}
                            </MenuItem>
                          );
                        })} */}
                      </Select>
                    </FormControl>

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Specification"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Specification"
                      // value={specification}
                      // onChange={(e) => setSpecification(e.target.value)}
                    />

                    <CustomButton
                      type="submit"
                      label="Submit"
                      variant="contained"
                      color="#ffffff"
                      bcolor="#b13137"
                      margin="40px"
                      padding="10px"
                      fontSize="17px !important"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesCoordinated;
