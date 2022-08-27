import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../../shared/context/AuthContext";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import Table from "../../../../shared/components/Table/Table";
import "./Student.css";
import CustomButton from "../../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

const columnLabels = ["STUDENT ID", "NAME", "SESSION ID", "SCHOLARSHIP TYPE", "ACTION"];

let checkedRequests = [];

const approveAddCallback = (id, actionType) => {
  if (actionType === "check") {
    checkedRequests.push(id);
  } else if (actionType === "uncheck") {
    checkedRequests.splice(checkedRequests.indexOf(id), 1);
  }
};

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });

    const jsonData = (await response.json())["data"];

    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({ type: "CheckBox", data: { id: jsonData[i]["scholarship_id"], callback: approveAddCallback } });

      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const AdviseeRegistration = () => {
  const auth = useContext(AuthContext);
  const [stateNo, setStateNo] = useState(0);
  const [tableData, setTableData] = useState([]);
  let { studentID } = useParams();

  const NavbarData = [
    {
      title: "Student Info",
      link: "/advisees/profile/info/" + studentID,
    },
    {
      title: "Academic Profile",
      link: "/advisees/profile/academic/" + studentID,
    },
    {
      title: "Course Registration",
      link: "/advisees/profile/registration/" + studentID,
    },
  ];

  const approveRequests = async () => {
    try {
      const response = await fetch("/api/teacher/departmenthead/approvescholarship/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedRequests,
          submission_date: new Date(),
        }),
      });
      if (response["status"] === 200) {
        alert("Requests approved successfully");
        checkedRequests = [];
        setStateNo(stateNo + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequests = async () => {
    try {
      const response = await fetch("/api/teacher/departmenthead/rejectscholarship/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedRequests,
          submission_date: new Date(),
        }),
      });
      if (response["status"] === 200) {
        alert("Requests rejected successfully");
        checkedRequests = [];
        setStateNo(stateNo + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTableData(`/api/teacher/departmenthead/student/scholarshiprequests/${studentID}`, setTableData, auth);
  }, [studentID, auth, stateNo]);

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
              <h3>Add Course Requests</h3>
              <Table columnLabels={columnLabels} tableData={tableData} />
              <br />

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
                <CustomButton
                  label="Approve Selections"
                  variant="contained"
                  color="white"
                  bcolor="#697A8D"
                  width="150px"
                  onClickFunction={approveRequests}
                />
                <CustomButton
                  label="Reject Selections"
                  variant="contained"
                  color="white"
                  bcolor="#b13137"
                  width="150px"
                  onClickFunction={rejectRequests}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdviseeRegistration;
