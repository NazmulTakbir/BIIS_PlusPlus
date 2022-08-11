import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../../shared/context/AuthContext";
import "./Advisee.css";
import Navbar from "../../../../shared/components/Navbar/Navbar";
import Profile from "../../../../student/components/Profile/Profile";

const AdviseeInfo = () => {
  const auth = useContext(AuthContext);
  let { studentID } = useParams();
  const [studentInfo, setStudentInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/adviseeinfo/${studentID}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setStudentInfo(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [studentID, auth]);

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
              <div className="profile-id-container">
                <div className="profiler-id">Profile of {studentID}</div>
              </div>

              <Navbar NavbarData={NavbarData} />
              <Profile ProfileData={studentInfo} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdviseeInfo;
