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

const criteriaColumns = ["CRITERIA NAME", "WEIGHT", "TOTAL MARKS", "ASSIGNED TEACHER", "ASSIGNED SCURTINIZER"];
const gradeBoundaryColumns = ["LOWER BOUND", "UPPER BOUND", "GRADE POINT", "LETTER GRADE"];

const fetchCriteriaData = async (api_route, setTableData, auth) => {
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
      row.push({ type: "PlainText", data: { value: jsonData[i]["scrutinizer_name"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const fetchGradingData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["lower_bound"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["upper_bound"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["grade_point"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["letter_grade"] } });
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

  const [criteriaTable, setCriteriaTable] = useState([]);
  const [newCriteria, setNewCriteria] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newTotalMarks, setNewTotalMarks] = useState("");

  const [newAssignedTeacher, setNewAssignedTeacher] = useState("");
  const [newAssignedScrutinizer, setNewAssignedScrutinizer] = useState("");

  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableScrutinizers, setAvailableScrutinizers] = useState([]);

  const [gradeBoundaryTable, setGradeBoundaryTable] = useState([]);
  const [newLowerBound, setNewLowerBound] = useState("");
  const [newUpperBound, setNewUpperBound] = useState("");
  const [newLetterGrade, setNewLetterGrade] = useState("");
  const [newGradePoint, setNewGradePoint] = useState("");

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
    fetchCriteriaData(`/api/teacher/markingcriteria/${value}`, setCriteriaTable, auth);
    fetchGradingData(`/api/teacher/gradingboundary/${value}`, setGradeBoundaryTable, auth);

    setCourseID(value);

    let response = await fetch(`/api/teacher/assignedteachers/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = await response.json();
    setAvailableTeachers(jsonData["data"]);

    response = await fetch(`/api/teacher/assignedscrutinizers/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    jsonData = await response.json();
    setAvailableScrutinizers(jsonData["data"]);

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
        let tempScrutinizerID;
        if (newAssignedScrutinizer.length === 0) tempScrutinizerID = null;
        else tempScrutinizerID = newAssignedScrutinizer;

        await fetch(`/api/teacher/newmarkingcriteria`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            criteria_name: newCriteria,
            criteria_weight: newWeight,
            total_marks: newTotalMarks,
            teacher_id: newAssignedTeacher,
            course_id: course_id,
            scrutinizer_id: tempScrutinizerID,
          }),
        });

        fetchCriteriaData(`/api/teacher/markingcriteria/${course_id}`, setCriteriaTable, auth);

        setNewAssignedTeacher("");
        setNewCriteria("");
        setNewWeight("");
        setNewTotalMarks("");
        setNewAssignedScrutinizer("");

        alert("Criteria Added Successfully");
      } catch (err) {}
    }
  };

  const addGradingBoundaryHandler = async (e) => {
    e.preventDefault();
    if (
      newLowerBound === "" ||
      newUpperBound === "" ||
      newLetterGrade === "" ||
      newGradePoint === "" ||
      course_id === "Select Course"
    ) {
      alert("Please fill all fields");
    } else {
      try {
        await fetch(`/api/teacher/newgradingboundary`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            lower_bound: newLowerBound,
            upper_bound: newUpperBound,
            letter_grade: newLetterGrade,
            grade_point: newGradePoint,
            course_id: course_id,
          }),
        });

        fetchGradingData(`/api/teacher/gradingboundary/${course_id}`, setGradeBoundaryTable, auth);

        setNewLowerBound("");
        setNewUpperBound("");
        setNewLetterGrade("");
        setNewGradePoint("");

        alert("Grading Boundary Added Successfully");
      } catch (err) {}
    }
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

                    <FormControl fullWidth style={{ marginTop: "25px" }}>
                      <InputLabel id="demo-simple-select-label">Assigned Scrutinizer</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="dues_type_id"
                        name="teacher"
                        value={newAssignedScrutinizer}
                        label="Assigned Teacher"
                        onChange={(e) => setNewAssignedScrutinizer(e.target.value)}
                      >
                        {availableScrutinizers.map((val, key) => {
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
                  <Table columnLabels={gradeBoundaryColumns} tableData={gradeBoundaryTable} />
                  <br />
                  <h5>Add Policy</h5>
                  <form onSubmit={addGradingBoundaryHandler} style={{ width: "350px", margin: "auto" }}>
                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Lower Bound"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Lower Bound"
                      value={newLowerBound}
                      onChange={(e) => setNewLowerBound(e.target.value)}
                    />

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Upper Bound"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Upper Bound"
                      value={newUpperBound}
                      onChange={(e) => setNewUpperBound(e.target.value)}
                    />

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Grade Point"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Grade Point"
                      value={newGradePoint}
                      onChange={(e) => setNewGradePoint(e.target.value)}
                    />

                    <Textbox
                      width="350px"
                      height="46px"
                      resize="none"
                      name="Letter Grade"
                      padding="0px"
                      fontSize="17px"
                      placeholder=""
                      label="Letter Grade"
                      value={newLetterGrade}
                      onChange={(e) => setNewLetterGrade(e.target.value)}
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
