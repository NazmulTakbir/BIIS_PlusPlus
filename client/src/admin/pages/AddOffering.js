import Papa from "papaparse";
import React, { useEffect, useState, useRef, useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { SearchMenuData } from "../components/SearchMenuData";

import "../../shared/components/MainContainer.css";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";

const allowedExtensions = ["csv"];

const AddOffering = () => {
  const auth = useContext(AuthContext);
  const [currentSession, setCurrentSession] = useState("");
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [dropDownTextCourseID, setdropDownTextCourseID] = useState("Select Course ID");
  const [dropDownOptionsCourseID, setdropDownOptionsCourseID] = useState([]);

  const [dropDownTextExamSlotID, setdropDownTextExamSlotID] = useState("Select Exam Slot ID");
  const [dropDownOptionsExamSlotID, setdropDownOptionsExamSlotID] = useState([]);

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
        const course_id_response = await fetch(`/api/admin/offering/getunofferedcourses`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const course_id_jsonData = await course_id_response.json();
        setdropDownOptionsCourseID(course_id_jsonData["data"]);

        //Exam slot id dropdown
        const exam_slot_id_response = await fetch(`/api/admin/offering/getexamslots`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const exam_slot_id_jsonData = await exam_slot_id_response.json();
        setdropDownOptionsExamSlotID(exam_slot_id_jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const addCourseOffering = async (e) => {
    e.preventDefault();

    let data;
    if (Number.isInteger(parseInt(dropDownTextExamSlotID))) {
      data = [
        {
          course_id: dropDownTextCourseID,
          exam_slot_id: dropDownTextExamSlotID,
          session_id: currentSession,
        },
      ];
    } else {
      data = [
        {
          course_id: dropDownTextCourseID,
          exam_slot_id: null,
          session_id: currentSession,
        },
      ];
    }

    await fetch(`/api/admin/offering/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        data: data,
      }),
    });

    alert("Course Offering Add Successful");
  };

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/offering/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "offerings.csv";
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
          await fetch(`/api/admin/offering/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Course Offerings Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
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

              <form onSubmit={addCourseOffering} style={{ width: "350px", margin: "auto" }}>
                <FormControl fullWidth style={{ marginTop: "25px" }}>
                  <InputLabel id="demo-simple-select-label">Course ID</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="offering_id"
                    name="offering_id"
                    value={dropDownTextCourseID}
                    label="Course Offering"
                    onChange={(e) => setdropDownTextCourseID(e.target.value)}
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

                <FormControl fullWidth style={{ marginTop: "25px" }}>
                  <InputLabel id="demo-simple-select-label">Exam Slot ID</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="offering_id"
                    name="offering_id"
                    value={dropDownTextExamSlotID}
                    label="Course Offering"
                    onChange={(e) => setdropDownTextExamSlotID(e.target.value)}
                  >
                    {dropDownOptionsExamSlotID.map((val, key) => {
                      return (
                        <MenuItem key={key} value={val}>
                          Exam Slot ID : {val}
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
    </React.Fragment>
  );
};

export default AddOffering;
