import React, { useEffect, useState, useContext, useRef } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import Textbox from "../../shared/components/Textbox/Textbox";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];

const AddScholarship = () => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [student_id, set_student_id] = useState("");
  const [session_id, set_session_id] = useState("");
  const [session_list, set_session_list] = useState([]);
  const [scholarship_type_id, set_scholarship_type_id] = useState("");
  const [scholarship_type_list, set_scholarship_type_list] = useState([]);

  // scholarshiptypelist sessionlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`/api/admin/sessionlist/get`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData1 = await response1.json();
        set_session_list(jsonData1.data);

        const response2 = await fetch(`/api/admin/scholarshiptypelist/get`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData2 = await response2.json();
        set_scholarship_type_list(jsonData2.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);


  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/scholarship/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "scholarships.csv";
    link.href = url;
    link.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Please input a csv file!");
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
          await fetch(`/api/admin/scholarship/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Scholarship Added Successfully");
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
            student_id: student_id,
            session_id: session_id,
            scholarship_type_id: scholarship_type_id,
        },
      ];

      await fetch(`/api/admin/scholarship/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({
          data: data,
        }),
      });

      //form reset
      set_student_id("");
      set_session_id("");
      set_scholarship_type_id("");
      
      alert("Scholarship Added Successfully");

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
                    <Stack
                        spacing={2}
                        direction="row"
                        style={{
                            margin: "auto",
                            width: "350px",
                            padding: "10px",
                            textAlign: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <CustomButton
                            type="submit"
                            label="Submit"
                            variant="contained"
                            color="#ffffff"
                            bcolor="#b13137"
                            margin="20px"
                            width="fit-content"
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
                            width="fit-content"
                            padding="10px"
                            fontSize="17px !important"
                            onClickFunction={downloadSampleCSV}
                        />
                    </Stack>

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
                <form id="add-sch-form" onSubmit={submissionHandler} style={{ width: "350px", margin: "auto" }}>
                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="student_id"
                    required={true}
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Student ID:"
                    value={student_id}
                    onChange={(e) => set_student_id(e.target.value)}
                  />

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select type of Scholarship</InputLabel>
                    <Select
                      required={true}
                      labelId="demo-simple-select-label"
                      id="scholarship_type_id"
                      name="scholarship_type_id"
                      value={scholarship_type_id}
                      label="Select type of Scholarship"
                      onChange={(e) => set_scholarship_type_id(e.target.value)}
                    >
                      {scholarship_type_list
                      .map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.scholarship_type_id}>
                            {val.scholarship_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Select a Session</InputLabel>
                    <Select
                      required={true}
                      labelId="demo-simple-select-label"
                      id="session_id"
                      name="session_id"
                      value={session_id}
                      label="Select a Session"
                      onChange={(e) => set_session_id(e.target.value)}
                    >
                      {session_list
                      .map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.session_id}>
                            {val.session_id}
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

export default AddScholarship;
