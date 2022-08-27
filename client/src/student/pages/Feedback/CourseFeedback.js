
import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { SearchMenuData } from "../../components/SearchMenuData";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Textbox from "../../../shared/components/Textbox/Textbox";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";



const CourseFeedback = () => {
  const auth = useContext(AuthContext);
  const [currentSession, setCurrentSession] = useState("");
  const [dropDownTextCourseID, setdropDownTextCourseID] = useState("Select Course ID");
  const [dropDownOptionsCourseID, setdropDownOptionsCourseID] = useState([]);
  //usestate for registeredcourses
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [offering_id, setOffering_id] = useState(0);
  const [details, setDetails] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        //finding current session
        const session_response = await fetch(`/api/shared/session/getcurrent`, {
            headers: { Authorization: "Bearer " + auth.token },
          });
          const session_data = await session_response.json();
          setCurrentSession(session_data["data"]["session_id"]);

        //courseID dropdown
        let response = await fetch(`/api/student/courses/registeredcourses`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let res_data = await response.json();
        setdropDownOptionsCourseID(res_data["course_ids"]);
        setRegisteredCourses(res_data["data"]);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const addCoursefeedback = async (e) => {
    e.preventDefault();

    await fetch(`/api/student/feedback/course/newsubmission`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
          offering_id: offering_id,
          details: details,
          submission_date: new Date(),
      }),
    });

    setDetails("");
    setdropDownTextCourseID("Select Course ID");

    alert("Course Offering Add Successful");
  };

  const handleChangeCourseID = (e) => {
    setdropDownTextCourseID(e.target.value);
    //find offering_id from registeredcourses
    const obj = registeredCourses.find(
        (course) => course.course_id === e.target.value
    )
    setOffering_id(obj.offering_id);
  }

  

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
            <Navbar NavbarData={NavbarData} />

              <form onSubmit={addCoursefeedback} style={{ width: "350px", margin: "auto" }}>
                <FormControl fullWidth style={{ marginTop: "25px" }}>
                  <InputLabel id="demo-simple-select-label">Course ID</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="offering_id"
                    name="offering_id"
                    value={dropDownTextCourseID}
                    label="Course Offering"
                    onChange={(e) => handleChangeCourseID(e)}
                  >
                    {dropDownOptionsCourseID.map((val, key) => {
                      return (
                        <MenuItem key={key} value={val}>
                          Course ID : {val}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <Textbox
                    width="350px"
                    height="150px"
                    resize="none"
                    name="course_name"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />


                <CustomButton
                  type="submit"
                  label="Submit"
                  variant="contained"
                  color="#ffffff"
                  bcolor="#b13137"
                  margin="40px"
                  padding="10px"
                  fontSize="17px !important"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CourseFeedback;
