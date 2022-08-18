import React, { useState, useEffect, useRef, useContext } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const allowedExtensions = ["csv"];

const AddCourseTeachers = () => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [offering_list, setOffering_list] = useState([]);
  const [teacher_list, setTeacher_list] = useState([]);
  const [offering_id, setOffering_id] = useState(0);
  const [teacher_id, setTeacher_id] = useState(0);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/departments/getTeacher`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        setTeacher_list(jsonData.data);

        response = await fetch(`/api/admin/offering/getOffering_admin_dept`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();
        setOffering_list(jsonData.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/courseteacher/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "teachers.csv";
    link.href = url;
    link.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      alert("Enter a valid file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      Papa.parse(target.result, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        complete: async function (results, file) {
          console.log();
          await fetch(`/api/admin/teacher/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Teachers Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  const submissionHandler = async (e) => {
    e.preventDefault();
    try {
      let data = [
        {
          offering_id: offering_id,
          teacher_id: teacher_id,
          role: role,
        },
      ];
      await fetch(`/api/admin/courseteacher/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          data: data,
        }),
      });

      setOffering_id("");
      setTeacher_id("");
      setRole("");

      alert("Course Teacher Added Successfully");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <div className="sections-header" style={{ width: "350px", margin: "auto" }}>
                <div
                  className="sections-heading"
                  style={{
                    textAlign: "left",
                    padding: "25px 0px 5px 0px",
                    fontWeight: "bolder",
                    fontSize: "17px",
                    color: "#b13137",
                  }}
                >
                  Add by uploading a CSV File:
                </div>
              </div>

              <div className="file-input_container" style={{ width: "350px", margin: "auto" }}>
                <input
                  style={{
                    background: "#faebd7a3",
                    borderRadius: "5px",
                    padding: "7px",
                    margin: "10px",
                  }}
                  ref={fileRef}
                  onChange={handleFileChange}
                  id="csvInput"
                  name="file"
                  type="File"
                />
                <CustomButton
                  type="submit"
                  label="Submit"
                  variant="contained"
                  color="#ffffff"
                  bcolor="#b13137"
                  margin="20px"
                  padding="10px"
                  fontSize="17px !important"
                  onClickFunction={handleFileSubmit}
                />
              </div>

              <button onClick={downloadSampleCSV}>Download Sample CSV</button>

              <div className="sections-header" style={{ width: "350px", margin: "auto" }}>
                <div
                  className="sections-heading"
                  style={{
                    textAlign: "left",
                    padding: "25px 0px 5px 0px",
                    fontWeight: "bolder",
                    fontSize: "17px",
                    color: "#b13137",
                  }}
                >
                  Add an Entry Manually:
                </div>
              </div>

              <div className="admin-form-container" style={{ paddingTop: "10px" }}>
                <form onSubmit={submissionHandler} style={{ width: "350px", margin: "auto" }}>
                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Course offering</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="offering_id"
                      name="offering_id"
                      value={offering_id}
                      label="Course Offering"
                      onChange={(e) => setOffering_id(e.target.value)}
                    >
                      {offering_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.offering_id}>
                            {val.course_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select Teacher</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="teacher_id"
                      name="teacher_id"
                      value={teacher_id}
                      label="Teachers"
                      onChange={(e) => setTeacher_id(e.target.value)}
                    >
                      {teacher_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.teacher_id}>
                            {val.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select Role of Teacher</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="teacher_role"
                      name="teacher_role"
                      value={role}
                      label="Role of Teacher"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {["Coordinator", "Course Teacher", "Scrutinizer"].map((val, key) => {
                        return (
                          <MenuItem key={key} value={val}>
                            {val}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

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
      </div>
    </React.Fragment>
  );
};

export default AddCourseTeachers;
