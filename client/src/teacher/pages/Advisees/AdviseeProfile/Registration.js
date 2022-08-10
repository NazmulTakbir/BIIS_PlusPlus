import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../../../shared/components/Navbar/Navbar";

const AdviseeRegistration = () => {
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

  return (
    <React.Fragment>
      <div className="App">
        <div className="wrapper">
          <div className="main_container">
            <div className="content">
              <h1>Profile of {studentID}</h1>
              <Navbar NavbarData={NavbarData} />
              <h1>Registration</h1>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdviseeRegistration;
