import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../../shared/context/AuthContext";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import Table from "../../../../shared/components/Table/Table";
import "./Advisee.css";
import CustomButton from "../../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

const columnLabels = ["STUDENT ID", "COURSE ID", "REQUEST DATE", "APPROVE"];

let checkedAddRequests = [];
let checkedDropRequests = [];

let allAddRequests = [];
let allDropRequests = [];

const approveAddCallback = (id, actionType) => {
  if (actionType === "check") {
    checkedAddRequests.push(id);
  } else if (actionType === "uncheck") {
    checkedAddRequests.splice(checkedAddRequests.indexOf(id), 1);
  }
};

const approveDropCallback = (id, actionType) => {
  if (actionType === "check") {
    checkedDropRequests.push(id);
  } else if (actionType === "uncheck") {
    checkedDropRequests.splice(checkedDropRequests.indexOf(id), 1);
  }
};

const fetchTableData = async (api_route, setAddTableData, setDropTableData, auth) => {
  try {
    allAddRequests = [];
    allDropRequests = [];
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let addTableData = [];
    let dropTableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["course_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["request_date"] } });
      if (jsonData[i]["request_type"].toUpperCase() === "ADD") {
        allAddRequests.push(jsonData[i]["reg_request_id"]);
        row.push({ type: "CheckBox", data: { id: jsonData[i]["reg_request_id"], callback: approveAddCallback } });
        addTableData.push(row);
      } else if (jsonData[i]["request_type"].toUpperCase() === "DROP") {
        allDropRequests.push(jsonData[i]["reg_request_id"]);
        row.push({ type: "CheckBox", data: { id: jsonData[i]["reg_request_id"], callback: approveDropCallback } });
        dropTableData.push(row);
      }
    }
    setAddTableData(addTableData);
    setDropTableData(dropTableData);
  } catch (err) {
    console.log(err);
  }
};

const AdviseeRegistration = () => {
  const auth = useContext(AuthContext);
  const [stateNo, setStateNo] = useState(0);
  const [addTableData, setAddTableData] = useState([]);
  const [dropTableData, setDropTableData] = useState([]);
  let { studentID } = useParams();

  const approveAllAddRequests = async() => {
    await fetch("/api/teacher/advisees/approveregistrationrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        requestIDs: allAddRequests,
        submission_date: new Date(),
      }),
    });
    setStateNo((stateNo + 1) % 100);
  };

  const rejectAllAddRequests = async() => {
    await fetch("/api/teacher/advisees/rejectregistrationrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        requestIDs: allAddRequests,
        submission_date: new Date(),
      }),
    });
    setStateNo((stateNo + 1) % 100);
  };

  const approveAllDropRequests = async() => {
    await fetch("/api/teacher/advisees/approveregistrationrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        requestIDs: allDropRequests,
        submission_date: new Date(),
      }),
    });
    setStateNo((stateNo + 1) % 100);
  };

  const rejectAllDropRequests = async() => {
    await fetch("/api/teacher/advisees/rejectregistrationrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        requestIDs: allDropRequests,
        submission_date: new Date(),
      }),
    });
    setStateNo((stateNo + 1) % 100);
  };

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

  const approveRequests = async (args) => {
    const requestType = args[0];
    if (requestType === "add") {
      await fetch("/api/teacher/advisees/approveregistrationrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedAddRequests,
          submission_date: new Date(),
        }),
      });
      checkedAddRequests = [];
    } else if (requestType === "drop") {
      await fetch("/api/teacher/advisees/approveregistrationrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedDropRequests,
          submission_date: new Date(),
        }),
      });
      checkedDropRequests = [];
    }

    setStateNo((stateNo + 1) % 100);
  };

  const rejectRequests = async (args) => {
    const requestType = args[0];
    if (requestType === "add") {
      await fetch("/api/teacher/advisees/rejectregistrationrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedAddRequests,
          submission_date: new Date(),
        }),
      });
      checkedAddRequests = [];
    } else if (requestType === "drop") {
      await fetch("/api/teacher/advisees/rejectregistrationrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          requestIDs: checkedDropRequests,
          submission_date: new Date(),
        }),
      });
      checkedDropRequests = [];
    }

    setStateNo((stateNo + 1) % 100);
  };

  useEffect(() => {
    fetchTableData(`/api/teacher/advisees/registrationrequests/${studentID}`, setAddTableData, setDropTableData, auth);
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
              <div className="session-header" style={{ margin: "auto", textAlign: "center" }}>
                <div
                  className="session-text"
                  style={{
                    marginTop: "20px",
                    fontSize: "25px",
                    fontWeight: "bolder",
                    color: "#b13137",
                  }}
                >
                  Add Course Requests
                </div>
              </div>
              <Table columnLabels={columnLabels} tableData={addTableData} />

              {addTableData.length > 0 ? (
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
                    <CustomButton
                      label="Approve Selections"
                      variant="contained"
                      color="white"
                      bcolor="#697A8D"
                      width="150px"
                      onClickFunction={approveRequests}
                      onClickArguments={["add"]}
                    />
                    <CustomButton
                      label="Reject Selections"
                      variant="contained"
                      color="white"
                      bcolor="#b13137"
                      width="150px"
                      onClickFunction={rejectRequests}
                      onClickArguments={["add"]}
                    />
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
                    <CustomButton
                      label="Approve All"
                      variant="contained"
                      color="white"
                      bcolor="#697A8D"
                      width="150px"
                      onClickFunction={approveAllAddRequests}
                      onClickArguments={["add"]}
                    />
                    <CustomButton
                      label="Reject All"
                      variant="contained"
                      color="white"
                      bcolor="#b13137"
                      width="150px"
                      onClickFunction={rejectAllAddRequests}
                      onClickArguments={["add"]}
                    />
                  </Stack>
                </div>
              ) : null}

              <br />
              <div className="session-header" style={{ margin: "auto", textAlign: "center" }}>
                <div
                  className="session-text"
                  style={{
                    marginTop: "20px",
                    fontSize: "25px",
                    fontWeight: "bolder",
                    color: "#b13137",
                  }}
                >
                  Drop Course Requests
                </div>
              </div>
              <Table columnLabels={columnLabels} tableData={dropTableData} />
              <br />

              {dropTableData.length > 0 ? (
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
                    <CustomButton
                      label="Approve Selections"
                      variant="contained"
                      color="white"
                      bcolor="#697A8D"
                      width="150px"
                      onClickFunction={approveRequests}
                      onClickArguments={["add"]}
                    />
                    <CustomButton
                      label="Reject Selections"
                      variant="contained"
                      color="white"
                      bcolor="#b13137"
                      width="150px"
                      onClickFunction={rejectRequests}
                      onClickArguments={["add"]}
                    />
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
                    <CustomButton
                      label="Approve All"
                      variant="contained"
                      color="white"
                      bcolor="#697A8D"
                      width="150px"
                      onClickFunction={approveAllDropRequests}
                      onClickArguments={["add"]}
                    />
                    <CustomButton
                      label="Reject All"
                      variant="contained"
                      color="white"
                      bcolor="#b13137"
                      width="150px"
                      onClickFunction={rejectAllDropRequests}
                      onClickArguments={["add"]}
                    />
                  </Stack>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdviseeRegistration;
