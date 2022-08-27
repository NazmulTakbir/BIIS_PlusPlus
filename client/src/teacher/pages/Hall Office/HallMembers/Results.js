// import React, { useEffect, useState, useContext } from "react";
import React from "react";
import { useParams } from "react-router-dom";

// import { AuthContext } from "../../../../shared/context/AuthContext";
// import Table from "../../../../shared/components/Table/Table";
import Navbar from "../../../../shared/components/Navbar/Navbar";

const Dues = () => {
  //   const auth = useContext(AuthContext);
  let { studentID } = useParams();

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
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dues;
