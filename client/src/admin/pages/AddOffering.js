
import Papa from "papaparse";
import React, { useEffect, useState , useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import "../../shared/components/MainContainer.css";

const allowedExtensions = ["csv"];

const AddOfferings = () => {
  const fileRef = useRef();
  const [error, setMessage] = useState("");
  const [file, setFile] = useState("");

  const [dropDownTextCourseID, setdropDownTextCourseID] = useState("Select Course ID");
  const [dropDownOptionsCourseID, setdropDownOptionsCourseID] = useState([]);

  //set usestate variable for dropdownTextSession
  const [dropDownTextSession, setdropDownTextSession] = useState("Select Session");
  const [dropDownOptionsSession, setdropDownOptionsSession] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //courseID dropdown
        const response = await fetch(`/api/admin/offering/getunofferedcourses`);
        const jsonData = await response.json();
        setdropDownOptionsCourseID(jsonData["data"]);

        //session dropdown
        const session_data = ["JAN 2022" , "JULY 2022"];
        setdropDownOptionsSession(session_data);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const dropDownSelectCourseID = async (value) => {
    setdropDownTextCourseID("Course ID: " + value);

    //fetchTableData(`/api/student/exam/${studentID}/grades/${level}/${term}`, setTableData, setExtraData);
    //setNoneSelected(false);
  };


  const dropDownSelectSession = async (value) => {
    setdropDownTextSession("Session: " + value);

    //fetchTableData(`/api/student/exam/${studentID}/grades/${level}/${term}`, setTableData, setExtraData);
    //setNoneSelected(false);
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
                  {dropDownTextSession}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dropDownOptionsSession.map((option, optionNo) => {
                    return (
                      <Dropdown.Item key={optionNo} onClick={() => dropDownSelectSession(option)}>
                        Session: {option}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddOfferings;
