import React, { useEffect, useState, useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import Table from "../../../shared/components/Table/Table";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import { SearchMenuData } from "../../components/SearchMenuData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const studentTableColumns = ["STUDENT ID", "SCORE", "STATUS", "SELECT"];

let selectedList = [];

const CoursesScrutinized = () => {
  const auth = useContext(AuthContext);
  const [course_id, setCourseID] = useState("Select Course");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [noCourseSelected, setNoCourseSelected] = useState(true);

  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("Select Criteria");
  const [noCriteriaSelected, setNoCriteriaSelected] = useState(true);
  const [studentTableData, setStudentTableData] = useState([]);

  const [criteria_weight, setCriteriaWeight] = useState("");
  const [total_marks, setTotalMarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/teacher/coursesscrutinized`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setAvailableCourses(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const selectCourse = async (value) => {
    setCourseID(value);

    const response = await fetch(`/api/teacher/coursecriteriabyscrutinizer/${value}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });
    let jsonData = await response.json();

    setAvailableCriteria(jsonData["data"]);
    setNoCourseSelected(false);

    setSelectedCriteria("Select Criteria");
    setNoCriteriaSelected(true);
    setStudentTableData([]);
  };

  const checkListCallback = (studentID, actionType) => {
    if (actionType === "check") {
      selectedList.push(studentID);
    } else if (actionType === "uncheck") {
      selectedList.splice(selectedList.indexOf(studentID), 1);
    }
  };

  const fetchStudentData = async (api_route) => {
    try {
      const response = await fetch(api_route, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      let jsonData = await response.json();

      setTotalMarks(jsonData["total_marks"]);
      setCriteriaWeight(jsonData["criteria_weight"]);

      let data = jsonData["data"];
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        let row = [];
        row.push({ type: "PlainText", data: { value: data[i]["studentID"] } });
        row.push({ type: "PlainText", data: { value: data[i]["marks"] } });
        row.push({ type: "PlainText", data: { value: data[i]["status"] } });

        if (data[i]["status"] === "Awaiting Scrutiny" || data[i]["status"] === "Rejected by Dept Head") {
          row.push({ type: "CheckBox", data: { id: data[i]["studentID"], callback: checkListCallback } });
        } else {
          row.push({
            type: "empty",
          });
        }

        tableData.push(row);
      }

      setStudentTableData(tableData);
    } catch (err) {
      console.log(err);
    }
  };

  const selectCriteria = async (value) => {
    fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${value}`);

    setSelectedCriteria(value);
    setNoCriteriaSelected(false);
  };

  const approveHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/teacher/scrutinize/approve/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(selectedList),
      });
      alert("Approved Successfully");

      selectedList = [];
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${selectedCriteria}`);
    } catch (err) {}
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/teacher/scrutinize/reject/${course_id}/${selectedCriteria}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(selectedList),
      });
      alert("Approved Successfully");

      selectedList = [];
      setStudentTableData([]);
      fetchStudentData(`/api/teacher/scrutinize/getall/${course_id}/${selectedCriteria}`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />

              <Dropdown>
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                  {course_id}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {availableCourses.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => selectCourse(option)}>
                        {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <br />
              <br />

              {noCourseSelected ? null : (
                <div>
                  <Dropdown>
                    <Dropdown.Toggle variant="danger" id="dropdown-basic">
                      {selectedCriteria}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {availableCriteria.map((option, optionNo) => {
                        return (
                          <Dropdown.Item key={optionNo} onClick={() => selectCriteria(option)}>
                            {option}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>

                  <br />

                  {noCriteriaSelected ? null : (
                    <div>
                      <h3>
                        Total Marks: {total_marks} ------------- Criteria Weight: {criteria_weight}
                      </h3>
                      <h4>
                        <Table columnLabels={studentTableColumns} tableData={studentTableData} />
                      </h4>

                      <form onSubmit={approveHandler}>
                        <CustomButton
                          type="submit"
                          label="Approve Selected"
                          variant="contained"
                          color="#ffffff"
                          bcolor="#b13137"
                          margin="40px"
                          padding="10px"
                          fontSize="17px !important"
                        />
                      </form>

                      <form onSubmit={rejectHandler}>
                        <CustomButton
                          type="submit"
                          label="Reject Selected"
                          variant="contained"
                          color="#ffffff"
                          bcolor="#bdbdbd"
                          margin="40px"
                          padding="10px"
                          fontSize="17px !important"
                        />
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursesScrutinized;
