import React, { useState, useRef, useContext } from "react";
import Papa from "papaparse";
import DatePicker from "react-datepicker";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import Textbox from "../../shared/components/Textbox/Textbox";
import CustomButton from "../../shared/components/CustomButton/CustomButton";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import "react-datepicker/dist/react-datepicker.css";

const allowedExtensions = ["csv"];

const UploadAcademicCalender = () => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const [error, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [session_id, setSessionID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/academiccalender/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "calenderphases.csv";
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

  const submissionHandler = async (event) => {
    event.preventDefault();
    if (session_id === "") {
      setMessage("Enter Session ID");
      return;
    } else if (startDate === null) {
      setMessage("Enter Start Date");
      return;
    } else if (endDate === null) {
      setMessage("Enter End Date");
      return;
    } else if (!file) {
      setMessage("Enter a valid file");
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
          await fetch(`/api/admin/academiccalender/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
              startDate: startDate,
              endDate: endDate,
              session_id: session_id,
            }),
          });
          setFile("");
          setSessionID("");
          setStartDate(null);
          setEndDate(null);
          setMessage("Academic Calender Created Successfully");
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
              <form onSubmit={submissionHandler}>
                <Textbox
                  height="40px"
                  width="450px"
                  resize="none"
                  name="subject"
                  label="Session ID"
                  placeholder="Type the Session ID here"
                  value={session_id}
                  onChange={(e) => setSessionID(e.target.value)}
                />
                <div>
                  <h6> Start Date </h6>
                  {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
                </div>
                <br />
                <div>
                  <h6> End Date </h6>
                  {/* <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} /> */}
                </div>
                <br />
                <div>
                  <h6> File Detailing Session Phases </h6>
                  <input ref={fileRef} onChange={handleFileChange} id="csvInput" name="file" type="File" />
                  <button onClick={downloadSampleCSV}>Download Sample CSV</button>
                </div>
                <br />
                <br />
                <CustomButton type="submit" label="Submit" variant="contained" color="#ffffff" bcolor="#b13137" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UploadAcademicCalender;
