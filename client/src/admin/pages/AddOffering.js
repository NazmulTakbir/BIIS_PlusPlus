import Papa from "papaparse";
import React, { useEffect, useState, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import "../../shared/components/MainContainer.css";

const allowedExtensions = ["csv"];

const AddOffering = () => {
  const [currentSession, setCurrentSession] = useState("");
  const fileRef = useRef();
  const [error, setMessage] = useState("");
  const [file, setFile] = useState("");

  const [dropDownTextCourseID, setdropDownTextCourseID] = useState("Select Course ID");
  const [dropDownOptionsCourseID, setdropDownOptionsCourseID] = useState([]);

  const [dropDownTextExamSlotID, setdropDownTextExamSlotID] = useState("Select Exam Slot ID");
  const [dropDownOptionsExamSlotID, setdropDownOptionsExamSlotID] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //finding current session
        const session_response = await fetch(`/api/shared/session/getcurrent`);
        const session_data = await session_response.json();
        setCurrentSession(session_data["data"]["session_id"]);

        //courseID dropdown
        const course_id_response = await fetch(`/api/admin/offering/getunofferedcourses`);
        const course_id_jsonData = await course_id_response.json();
        setdropDownOptionsCourseID(course_id_jsonData["data"]);

        //Exam slot id dropdown
        const exam_slot_id_response = await fetch(`/api/admin/offering/getexamslots`);
        const exam_slot_id_jsonData = await exam_slot_id_response.json();
        setdropDownOptionsExamSlotID(exam_slot_id_jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const dropDownSelectCourseID = async (value) => {
    setdropDownTextCourseID(value);
  };

  const dropDownSelectExamSlotID = async (value) => {
    setdropDownTextExamSlotID(value);
  };

  const addCourseOffering = async (course_id, exam_slot_id, session_id) => {
    let data = [];
    const obj = {
      course_id: course_id,
      exam_slot_id: exam_slot_id,
      session_id: session_id,
    };

    data.push(obj);

    await fetch(`/api/admin/offering/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data,
      }),
    });

    alert("Course Offering Add Successful");
  };

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/offering/samplefile");
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "offerings.csv";
    link.href = url;
    link.click();
  };

  const handleFileChange = async (e) => {
    setMessage("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setMessage("Please input a csv file");
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
          await fetch(`/api/admin/offering/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          setMessage("Course Offerings Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <h3>{currentSession}</h3>
              <p>{error}</p>
              <input ref={fileRef} onChange={handleFileChange} id="csvInput" name="file" type="File" />
              <button onClick={handleFileSubmit}>Submit</button>
              <button onClick={downloadSampleCSV}>Download Sample CSV</button>

              <Dropdown>
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                  {dropDownTextCourseID}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dropDownOptionsCourseID.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => dropDownSelectCourseID(option)}>
                        Course ID: {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                  {dropDownTextExamSlotID}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dropDownOptionsExamSlotID.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => dropDownSelectExamSlotID(option)}>
                        Exam SLot ID: {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <input
                type="submit"
                value="Add Course Offering"
                onClick={(e) => {
                  console.log("inside");
                  addCourseOffering(dropDownTextCourseID, dropDownTextExamSlotID, currentSession);
                  setdropDownTextCourseID("Select Course ID");
                  setdropDownTextExamSlotID("Select Exam Slot ID");
                  //reload window
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddOffering;
