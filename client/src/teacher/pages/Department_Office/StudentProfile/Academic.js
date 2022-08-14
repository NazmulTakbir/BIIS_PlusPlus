import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import "./Student.css";

import { AuthContext } from "../../../../shared/context/AuthContext";
import "../../../../shared/components/MainContainer.css";
import Table from "../../../../shared/components/Table/Table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const columnLabels = ["COURSE ID", "COURSE TITLE", "CREDIT HOURS", "GRADE", "GRADE POINT"];

const boxStyle = {
  bgcolor: "background.paper",
  border: "1px solid #bdbdbd",
  boxShadow: 1,
  p: 4,
  padding: "15px 32px 15px 32px",
  textAlign: "left",
  width: "80%",
  margin: "auto",
};

const fetchTableData = async (api_route, setTableData, setExtraData, auth) => {
  try {
    const response = await fetch(api_route, { headers: { Authorization: "Bearer " + auth.token } });
    const jsonData = await response.json();
    const resultData = jsonData["data"];
    let tableData = [];
    for (let i = 0; i < resultData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: resultData[i]["course_id"] } });
      row.push({ type: "PlainText", data: { value: resultData[i]["course_name"] } });
      row.push({ type: "PlainText", data: { value: resultData[i]["credits"] } });
      row.push({ type: "PlainText", data: { value: resultData[i]["letter_grade"] } });
      row.push({ type: "PlainText", data: { value: resultData[i]["grade_point"] } });
      tableData.push(row);
    }
    setTableData(tableData);
    setExtraData({
      gpa: jsonData["gpa"],
      cgpa: jsonData["cgpa"],
      registeredCredits: jsonData["registeredCredits"],
      earnedCredits: jsonData["earnedCredits"],
      totalCreditsEarned: jsonData["totalCreditsEarned"],
    });
  } catch (err) {
    console.log(err);
  }
};

const DeptStudentAcademic = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [dropDownText, setDropDownText] = useState("Select Level/Term");
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [noneSelected, setNoneSelected] = useState(true);

  let { studentID } = useParams();

  const NavbarData = [
    {
      title: "Student Info",
      link: "/deptStudents/profile/info/" + studentID,
    },
    {
      title: "Academic Profile",
      link: "/deptStudents/profile/academic/" + studentID,
    },
    {
      title: "Course Registration",
      link: "/deptStudents/profile/registration/" + studentID,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/departmenthead/getAvailableResults/${studentID}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setDropDownOptions(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [studentID, auth]);

  const dropDownSelect = async (value) => {
    const level = parseInt(value[0]);
    const term = parseInt(value[2]);

    setDropDownText("Level " + level + "  Term " + term);

    fetchTableData(`/api/teacher/departmenthead/getGrades/${studentID}/${level}/${term}`, setTableData, setExtraData, auth);
    setNoneSelected(false);
  };

  return (
    <React.Fragment>
      <div className="App">
        <div className="wrapper">
          <div className="main_container">
            <div className="content">
              <div className="profile-id-container">
                <div className="profiler-id">Profile of {studentID}</div>
              </div>

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
                  <Table columnLabels={columnLabels} tableData={tableData} />

                  <div className="gpa-container" style={{ margin: "50px" }}>
                    <Box className="modal-box" sx={boxStyle}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
                        GPA for Term: {String(extraData.gpa).substring(0, 4)}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: "15px" }}>
                        <div>Registered Credit Hours in this Term: {extraData.registeredCredits}</div>
                        <div>Credit Hours Earned in this Term: {extraData.earnedCredits}</div>
                      </Typography>
                      <Typography
                        id="modal-modal-description"
                        sx={{ mt: 2, fontSize: "15px", color: "#b70009", fontWeight: "bolder" }}
                      >
                        <div>Total Credit Hours: {extraData.totalCreditsEarned}</div>
                        <div>CGPA: {extraData.cgpa}</div>
                      </Typography>
                    </Box>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DeptStudentAcademic;
