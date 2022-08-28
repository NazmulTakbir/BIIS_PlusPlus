import React, { useEffect, useState, useContext, useRef } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import CustomSearch from "../../shared/components/CustomSearch/CustomSearch";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];

const AddScholarship = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [student_id, setStudent_id] = useState("");
  const [session_id, set_session_id] = useState("");
  const [session_list, set_session_list] = useState([]);
  const [scholarship_type_id, set_scholarship_type_id] = useState("");
  const [scholarship_type_list, set_scholarship_type_list] = useState([]);

  //for searchable student ids
  const [search_students_list, setSearch_students_list] = useState([]);
  const is_student_id_valid = search_students_list.some((element) => element.value === student_id);

  // scholarshiptypelist sessionlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.userType));
        let response = await fetch(`/api/admin/sessionlist/get`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        set_session_list(jsonData.data);

        response = await fetch(`/api/admin/scholarshiptypelist/get`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();
        set_scholarship_type_list(jsonData.data);

        const hall_admin_id = auth.userId;
        console.log("hall admin id", hall_admin_id);
        //get hall_id from hall_admin_id
        response = await fetch(`/api/admin/hall/getHallId/${hall_admin_id}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const hall_id = (await response.json()).hall_id;
        console.log(hall_id);

        response = await fetch(`/api/admin/student/getStudentsOfHall/${hall_id}`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();
        console.log(jsonData);

        //set data in valid format for search component
        let search_list = [];
        for (var i = 0; i < jsonData.data.length; i++) {
          search_list.push({
            name: jsonData.data[i].student_id + " - " + jsonData.data[i].name,
            value: jsonData.data[i].student_id,
          });
        }
        setSearch_students_list(search_list);
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
    if (is_student_id_valid) {
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
        setStudent_id("");
        set_session_id("");
        set_scholarship_type_id("");

        alert("Scholarship Added Successfully");
      } catch (err) {}
    } else {
      alert("Entered Student Id is not valid");
    }
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
                    bcolor="#5e6873"
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
                  <CustomSearch
                    data={search_students_list}
                    parentCallback={setStudent_id}
                    required={true}
                    margin="25px 0px 10px 0px"
                    width="100%"
                    label="Select Student"
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
                      {scholarship_type_list.map((val, key) => {
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
                      {session_list.map((val, key) => {
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
