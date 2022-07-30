import React, { useEffect, useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray, fetchTableData } from "../../../shared/util/TableFunctions";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const studentID = require("../../../placeHolder");

const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "GRADE", "GRADE POINT"];

const ExamGrades = () => {
  const [tableData, setTableData] = useState(make2DArray(1, 5));
  const [extraData, setExtraData] = useState({});
  const [dropDownText, setDropDownText] = useState("Select Level/Term");
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/exam/${studentID}/getAvailableResults`);
        const jsonData = await response.json();
        setDropDownOptions(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const dropDownSelect = async (value) => {
    const level = parseInt(value[0]);
    const term = parseInt(value[2]);

    setDropDownText("Level " + level + "  Term " + term);

    await fetchTableData(
      `/api/student/exam/${studentID}/grades/${level}/${term}`,
      5,
      {
        course_id: 0,
        course_name: 1,
        credits: 2,
        letter_grade: 3,
        grade_point: 4,
      },
      setTableData,
      setExtraData
    );
    setNoneSelected(false);
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
                  {dropDownText}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dropDownOptions.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => dropDownSelect(option)}>
                        Level {option[0]} Term {option[2]}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              {noneSelected ? null : (
                <div>
                  <Table columnLabels={columnLabels} dataMatrix={tableData} />
                  <div
                    className="gpa-text"
                    style={{
                      fontWeight: "bolder",
                      color: "rgb(105 122 141)",
                      width: "max-content",
                      border: "1px solid",
                      margin: "30px auto auto auto",
                      padding: "10px",
                      fontSize: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    GPA for Term: {String(extraData.gpa).substring(0, 4)}
                  </div>
                  <p>Registered Credit Hours in this Term: {extraData.registeredCredits}</p>
                  <p>Credit Hours Earned in this Term: {extraData.earnedCredits}</p>
                  <p>Total Credit Hours: {extraData.totalCreditsEarned}</p>
                  <p>CGPA: {extraData.cgpa}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ExamGrades;
