import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../../shared/context/AuthContext";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import Table from "../../../../shared/components/Table/Table";
import "./Advisee.css";
import CustomButton from "../../../../shared/components/CustomButton/CustomButton";

const teacherID = require("../../../../placeHolder2");
const columnLabels = ["STUDENT ID", "COURSE ID", "REQUEST DATE", "ACTION"];

const fetchTableData = async (api_route, setAddTableData, setDropTableData, auth) => {
  try {
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
      row.push({
        type: "Buttons",
        data: {
          buttonList: [
            { buttonText: "Approve", textColor: "white", backColor: "#697A8D" },
            { buttonText: "Reject", textColor: "white", backColor: "#DB6066" },
          ],
        },
      });
      if (jsonData[i]["request_type"].toUpperCase() === "ADD") {
        addTableData.push(row);
      } else if (jsonData[i]["request_type"].toUpperCase() === "DROP") {
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
  const [addTableData, setAddTableData] = useState([]);
  const [dropTableData, setDropTableData] = useState([]);
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

  useEffect(() => {
    fetchTableData(
      `/api/teacher/advisees/${teacherID}/registrationrequests/${studentID}`,
      setAddTableData,
      setDropTableData,
      auth
    );
  }, [studentID, auth]);

  const handleAddAll = async () => {
    console.log("here");
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
              <h3>Add Course Requests</h3>
              <Table columnLabels={columnLabels} tableData={addTableData} />
              <CustomButton
                type="submit"
                label="Approve All Add Course Requests"
                variant="contained"
                color="#ffffff"
                bcolor="#697A8D"
                margin="20px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={handleAddAll}
              />
              <CustomButton
                type="submit"
                label="Reject All Add Course Requests"
                variant="contained"
                color="#ffffff"
                bcolor="#DB6066"
                margin="20px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={handleAddAll}
              />
              <br />
              <br />
              <br />
              <h3>Drop Course Requests</h3>
              <Table columnLabels={columnLabels} tableData={dropTableData} />
              <CustomButton
                type="submit"
                label="Approve All Drop Course Requests"
                variant="contained"
                color="#ffffff"
                bcolor="#697A8D"
                margin="20px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={handleAddAll}
              />
              <CustomButton
                type="submit"
                label="Reject All Add Course Requests"
                variant="contained"
                color="#ffffff"
                bcolor="#DB6066"
                margin="20px"
                padding="10px"
                fontSize="17px !important"
                onClickFunction={handleAddAll}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdviseeRegistration;
