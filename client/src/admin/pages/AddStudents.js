import React, { useState, useRef } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import "../../shared/components/MainContainer.css";

const allowedExtensions = ["csv"];

const AddStudents = () => {
  const fileRef = useRef();
  const [error, setMessage] = useState("");
  const [file, setFile] = useState("");

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/student/samplefile");
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "students.csv";
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
          await fetch(`/api/admin/student/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          setMessage("Students added successfully");
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
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddStudents;
