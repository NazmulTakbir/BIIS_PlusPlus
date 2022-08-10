import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import "../../shared/components/MainContainer.css";
import Textbox from "../../shared/components/Textbox/Textbox";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const allowedExtensions = ["csv"];
const level_list = ["1", "2", "3", "4"];
const term_list = ["1", "2"];
const credit_list = ["0.75", "1", "1.5", "2", "3", "4", "6"];

const AddCourses = () => {
  const fileRef = useRef();
  const [error, setMessage] = useState("");
  const [file, setFile] = useState("");

  const [course_id, set_course_id] = useState("");
  const [course_name, set_course_name] = useState("");
  const [offered_by_dept_id, set_offered_by_dept_id] = useState("5"); //cse id
  const [offered_to_list, set_offered_to_list] = useState([]);
  const [offered_to_dept_id, set_offered_to_dept_id] = useState("Select a department");
  const [level, set_level] = useState("");
  const [term, set_term] = useState("");
  const [credits, set_credits] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/departments/get`);
        const jsonData = await response.json();
        set_offered_to_list(jsonData.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/course/samplefile");
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "courses.csv";
    link.href = url;
    link.click();
  };

  const handleFileChange = async (e) => {
    setMessage("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setMessage("Please input a csv file!");
        return;
      }
      setFile(inputFile);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) return setMessage("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      Papa.parse(target.result, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        complete: async function (results, file) {
          console.log();
          await fetch(`/api/admin/course/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          setMessage("Courses Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  const submissionHandler = async (e) => {
    try {
      let data = [
        {
          course_id: course_id,
          course_name: course_name,
          offered_by_dept_id: offered_by_dept_id,
          offered_to_dept_id: offered_to_dept_id,
          level: level,
          term: term,
          credits: credits,
        },
      ];

      await fetch(`/api/admin/course/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data,
        }),
      });
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
                <CustomButton
                  type="submit"
                  label="Download Sample CSV"
                  variant="contained"
                  color="#ffffff"
                  bcolor="#b13137"
                  margin="20px"
                  padding="10px"
                  fontSize="17px !important"
                  onClickFunction={downloadSampleCSV}
                />
              </div>

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
                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="course_id"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Course ID:"
                    value={course_id}
                    onChange={(e) => set_course_id(e.target.value)}
                  />

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="course_name"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Course Name:"
                    value={course_name}
                    onChange={(e) => set_course_name(e.target.value)}
                  />

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Offered by Department</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="offered_by_dept_id"
                      name="offered_by_dept_id"
                      value={offered_by_dept_id}
                      label="Offered by Department"
                    >
                      <MenuItem value={offered_by_dept_id}>Computer Science and Engineering</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Offered to Department</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="offered_to_dept_id"
                      name="offered_to_dept_id"
                      value={offered_to_dept_id}
                      label="Offered to Department"
                      onChange={(e) => set_offered_to_dept_id(e.target.value)}
                    >
                      {offered_to_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.dept_id}>
                            {val.dept_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select Level</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="level"
                      name="level"
                      value={level}
                      label="Select Level"
                      onChange={(e) => set_level(e.target.value)}
                    >
                      {level_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val}>
                            {val}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select Term</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="term"
                      name="term"
                      value={term}
                      label="Select Term"
                      onChange={(e) => set_term(e.target.value)}
                    >
                      {term_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val}>
                            {val}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Credit Hours of this Course</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="credits"
                      name="credits"
                      value={credits}
                      label="Credit Hours of this Course"
                      onChange={(e) => set_credits(e.target.value)}
                    >
                      {credit_list.map((val, key) => {
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

export default AddCourses;
