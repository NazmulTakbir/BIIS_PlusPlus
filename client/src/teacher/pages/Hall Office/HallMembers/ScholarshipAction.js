import React, { useEffect, useState, useContext, useParams } from "react";
import Navbar from "../../../../shared/components/Navbar/Navbar";


import { AuthContext } from "../../../../shared/context/AuthContext";
import "../../../../shared/components/MainContainer.css";
import Table from "../../../../shared/components/Table/Table";

const columnLabels = ["STUDENT ID", "NAME", "SESSION ID", "SCHOLARSHIP TYPE", "ACTION"];


const acceptScholarship = async (args) => {
    if (window.confirm("Approve this Scholarship?")) {
      const auth = args[1];
      console.log(args);
      try {
          await fetch(`/api/teacher/hallmemberinfo/approvescholarship/${args[0]}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          });
          alert("Scholarship Approved Successfully!");
          window.location.reload();
      } catch (err) {
        console.log(err);
      }    
    } else {
      return false;
    }
};

const rejectScholarship = async (args) => {
    if (window.confirm("Reject this Scholarship?")) {
      const auth = args[1];
      console.log(args);
      try {
          await fetch(`/api/teacher/hallmemberinfo/rejectscholarship/${args[0]}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          });
          alert("Scholarship Rejected Successfully!");
          window.location.reload();
      } catch (err) {
        console.log(err);
      }    
    } else {
      return false;
    }
};

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, { headers: { Authorization: "Bearer " + auth.token } });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["student_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["name"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["session_id"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["scholarship_name"] } });
      row.push({
        type: "Buttons",
        data: {
          buttonList: [
            {
                buttonText: "Accept",
                textColor: "white",
                backColor: "#b13137",
                onClickFunction: acceptScholarship,
                onClickArguments: [jsonData[i]["scholarship_id"], auth],
            },
            {
                buttonText: "Reject",
                textColor: "white",
                backColor: "#697A8D",
                onClickFunction: rejectScholarship,
                onClickArguments: [jsonData[i]["scholarship_id"], auth],
            },
          ],
        },
      });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const ScholarshipAction = () => {
  const auth = useContext(AuthContext);
  //let { studentID } = useParams();
  let studentID = '1705103';
  console.log("id: " + studentID);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/teacher/hallmemberinfo/scholarshiprequests/` + studentID, setTableData, auth);
  }, [auth, tableData.length]);

  const NavbarData = [
    {
      title: "Student Info",
      link: "/hallissues/profile/info/" + studentID,
    },
    {
      title: "Academic Profile",
      link: "/hallissues/profile/academic/" + studentID,
    },
    {
      title: "Pending Scholarships",
      link: "/hallissues/profile/scholarship/" + studentID,
    },
  ];

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
              <Table columnLabels={columnLabels} tableData={tableData} modal="true" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScholarshipAction;

