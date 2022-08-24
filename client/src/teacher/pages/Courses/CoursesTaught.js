import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const studentTableColumns = ["STUDENT ID", "CURRENT SCORE", "STATUS", "EDIT SCORE"];

let studentMarks = {};

const CoursesTaught = () => {
  const auth = useContext(AuthContext);
  const [course_id, setCourseID] = useState("Select Course");
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(true);

  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("Select Criteria");
  const [noCriteriaSelected, setNoCriteriaSelected] = useState(true);
  const [studentTableData, setStudentTableData] = useState([]);

  const [criteria_weight, setCriteriaWeight] = useState("");
  const [total_marks, setTotalMarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/coursestaught`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        setDropDownOptions(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const studentMarksCallback = (mark, args, setValue) => {
    const studentID = args[0];
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

      jsonData = jsonData["data"];
      let tableData = [];
      for (let i = 0; i < jsonData.length; i++) {
        let row = [];
        row.push({ type: "PlainText", data: { value: jsonData[i]["studentID"] } });
        row.push({ type: "PlainText", data: { value: jsonData[i]["marks"] } });
        row.push({ type: "PlainText", data: { value: jsonData[i]["status"] } });

        if (
          jsonData[i]["status"] === "No Score Added" ||
          jsonData[i]["status"] === "Added by Course Teacher" ||
          jsonData[i]["status"] === "Rejected by Scrutinizer"
        ) {
          row.push({
            type: "TextboxCell",
            data: {
              callback: studentMarksCallback,
              callbackArguments: [jsonData[i]["studentID"]],
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

  const dropDownSelect = async (value) => {
    setCourseID(value);

    const response = await fetch(`/api/teacher/coursecriteriabyteacher/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = await response.json();

    setAvailableCriteria(jsonData["data"]);
    setNoneSelected(false);

    setSelectedCriteria("Select Criteria");
    setNoCriteriaSelected(true);
    setStudentTableData([]);

    studentMarks = {};
  };

  const dropDownCriteriaSelect = async (value) => {
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

              <br />
              <br />

              {noneSelected ? null : (
                <div>
                  <Dropdown>
                    <Dropdown.Toggle variant="danger" id="dropdown-basic">
                      {selectedCriteria}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {availableCriteria.map((option, optionNo) => {
                        return (
                          <Dropdown.Item key={optionNo} onClick={() => dropDownCriteriaSelect(option)}>
                            {option}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>

                  <br />

                  {noCriteriaSelected ? null : (
                    <div>
                      <h3>
                        Total Marks: {total_marks} ------------- Criteria Weight: {criteria_weight}
                      </h3>
                      <h4>
                        <Table columnLabels={studentTableColumns} tableData={studentTableData} />
                      </h4>

                      <form onSubmit={saveScoresHandler}>
                        <CustomButton
                          type="submit"
                          label="Save Scores"
                          variant="contained"
                          color="#ffffff"
                          bcolor="#b13137"
                          margin="40px"
                          padding="10px"
                          fontSize="17px !important"
                        />
                      </form>

                      <form onSubmit={sendForScrutinyHandler}>
                        <CustomButton
                          type="submit"
                          label="Submit For Scrutiny"
                          variant="contained"
                          color="#ffffff"
                          bcolor="#bdbdbd"
                          margin="40px"
                          padding="10px"
                          fontSize="17px !important"
                        />
                      </form>
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
