import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../../shared/context/AuthContext";
import Table from "../../../../shared/components/Table/Table";
import Navbar from "../../../../shared/components/Navbar/Navbar";

const columnLabels = ["TYPE", "AMOUNT", "SPECIFICATION", "DEADLINE"];

const fetchTableData = async (api_route, setTableData, auth) => {
  try {
    const response = await fetch(api_route, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const jsonData = (await response.json())["data"];
    let tableData = [];
    for (let i = 0; i < jsonData.length; i++) {
      let row = [];
      row.push({ type: "PlainText", data: { value: jsonData[i]["description"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["amount"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["specification"] } });
      row.push({ type: "PlainText", data: { value: jsonData[i]["deadline"] } });
      tableData.push(row);
    }
    setTableData(tableData);
  } catch (err) {
    console.log(err);
  }
};

const Dues = () => {
  const auth = useContext(AuthContext);
  let { studentID } = useParams();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData(`/api/teacher/hallmemberinfo/${studentID}/getpendingdues`, setTableData, auth);
  }, [auth, studentID]);

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
    {
      title: "Pending Dues",
      link: "/hallissues/profile/dues/" + studentID,
    },
    {
      title: "Pending Results",
      link: "/hallissues/profile/results/" + studentID,
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
              <Table columnLabels={columnLabels} tableData={tableData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dues;
