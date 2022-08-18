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

const studentTableColumns = ["STUDENT ID", "CURRENT SCORE", "EDITTED SCORE"];

const fetchStudentData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["studentID"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["marks"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const CoursesTaught = () => {
  const auth = useContext(AuthContext);
  const [course_id, setCourseID] = useState("Select Course");
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(true);

  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("Select Criteria");
  const [noCriteriaSelected, setNoCriteriaSelected] = useState(true);
  const [studentTableData, setStudentTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/coursestaught`, {
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
    setCourseID(value);

    const response = await fetch(`/api/teacher/coursecriteriabyteacher/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = await response.json();

    setAvailableCriteria(jsonData["data"]);

    setNoneSelected(false);
  };

  const dropDownCriteriaSelect = async (value) => {
    fetchStudentData(`/api/teacher/studentmarks/${course_id}/${value}`, setStudentTableData, auth);

    setSelectedCriteria(value);

    setNoCriteriaSelected(false);
  };

  const submitScoresHandler = async (e) => {
    e.preventDefault();
    // if (
    //   newLowerBound === "" ||
    //   newUpperBound === "" ||
    //   newLetterGrade === "" ||
    //   newGradePoint === "" ||
    //   course_id === "Select Course"
    // ) {
    //   alert("Please fill all fields");
    // } else {
    //   try {
    //     await fetch(`/api/teacher/newgradingboundary`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
    //       body: JSON.stringify({
    //         lower_bound: newLowerBound,
    //         upper_bound: newUpperBound,
    //         letter_grade: newLetterGrade,
    //         grade_point: newGradePoint,
    //         course_id: course_id,
    //       }),
    //     });

    //     fetchGradingData(`/api/teacher/gradingboundary/${course_id}`, setGradeBoundaryTable, auth);

    //     setNewLowerBound("");
    //     setNewUpperBound("");
    //     setNewLetterGrade("");
    //     setNewGradePoint("");

    //     alert("Grading Boundary Added Successfully");
    // } catch (err) {}
    // }
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
                      <h4>
                        <Table columnLabels={studentTableColumns} tableData={studentTableData} />
                      </h4>

                      <form onSubmit={submitScoresHandler}>
                        <CustomButton
                          type="submit"
                          label="Submit Scores"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesTaught;
