import React, { useState, useRef, useEffect, useContext } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import DatePicker from 'react-custom-date-picker';
import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import Textbox from "../../shared/components/Textbox/Textbox";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "react-datepicker/dist/react-datepicker.css";

const allowedExtensions = ["csv"];

const AddDues = () => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [dues_type_id, setDues_type_id] = useState(0);
  const [student_id, setStudent_id] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [specification, setSpecification] = useState("");
  const [students_list, setStudents_list] = useState([]);
  const [dues_type_list, setDues_type_list] = useState([]);

  const admin_dept_id = 5; //change it after adming logins

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/dues/getDuesTypes`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        setDues_type_list(jsonData.data);
        console.log(jsonData.data);
        response = await fetch(`/api/admin/student/getStudentsOfDept/${admin_dept_id}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();
        setStudents_list(jsonData.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/dues/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "dues.csv";
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
          await fetch(`/api/admin/dues/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Dues Added Successfully");
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
          dues_type_id: dues_type_id,
          student_id: student_id,
          specification: specification,
          deadline: deadline,
          dues_status: "Not Paid",
        },
      ];
      await fetch(`/api/admin/dues/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          data: data,
        }),
      });

      setDues_type_id("");
      setStudent_id("");
      setSpecification("");
      setDeadline("");

      alert("Dues Added Successfully");
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
                    <InputLabel id="demo-simple-select-label">Dues Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="dues_type_id"
                      name="dues_type_id"
                      value={dues_type_id}
                      label="Dues Type"
                      onChange={(e) => setDues_type_id(e.target.value)}
                    >
                      {dues_type_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.dues_type_id}>
                            {val.description}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select Student</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="student_id"
                      name="student_id"
                      value={student_id}
                      label="Student"
                      onChange={(e) => setStudent_id(e.target.value)}
                    >
                      {students_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.student_id}>
                            {val.name} - {val.student_id}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <DatePicker
                    date={deadline}
                    handleDateChange={setDeadline}
                  />
                    

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="Specification"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Specification"
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
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
      </div>
    </React.Fragment>
  );
};

export default AddDues;
