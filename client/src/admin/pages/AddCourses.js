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
import CustomSearch from "../../shared/components/CustomSearch/CustomSearch";
import { getSearchBarData } from "../components/SearchMenuData";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];
const level_list = ["1", "2", "3", "4"];
const term_list = ["1", "2"];
const credit_list = ["0.75", "1", "1.5", "2", "3", "4", "6"];

const AddCourses = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [course_id, set_course_id] = useState("");
  const [course_name, set_course_name] = useState("");
  const [offered_by_dept_id, setOffered_by_dept_id] = useState("");
  const [offered_by_dept_name, setOffered_by_dept_name] = useState("");
  const [offered_to_dept_id, set_offered_to_dept_id] = useState("Select a department");
  const [level, set_level] = useState("");
  const [term, set_term] = useState("");
  const [credits, set_credits] = useState("");

  //for searchable dept ids
  const [search_dept_list, setSearch_dept_list] = useState([]);
  const is_dept_id_valid = search_dept_list.some((element) => element.value === offered_to_dept_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.userType));
        let response = await fetch(`/api/admin/departments/self`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = (await response.json())["data"];
        setOffered_by_dept_id(jsonData.dept_id);
        setOffered_by_dept_name(jsonData.dept_name);

        response = await fetch(`/api/admin/departments/get`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();

        //set data in valid format for search component
        let search_list = [];
        for (var i = 0; i < jsonData.data.length; i++) {
          search_list.push({
            name: jsonData.data[i].dept_name,
            value: jsonData.data[i].dept_id,
          });
        }
        setSearch_dept_list(search_list);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/course/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "courses.csv";
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
          await fetch(`/api/admin/course/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Courses Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  const submissionHandler = async (e) => {
    if(is_dept_id_valid){
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
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            data: data,
          }),
        });
      } catch (err) {}
    }else{
      alert("Entered Department is not valid");
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

              <div className="file-input_container" style={{ 
                  width: "350px", margin: "auto", background: "#fff3e3", 
                  border: "1px solid rgb(189, 189, 189)", borderRadius: "10px"                 
                }}>
                <input
                  style={{
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
                      <MenuItem value={offered_by_dept_id}>{offered_by_dept_name}</MenuItem>
                    </Select>
                  </FormControl>

                  <CustomSearch
                    data={search_dept_list}
                    parentCallback={set_offered_to_dept_id}
                    required={true}
                    margin="25px 0px 10px 0px"
                    width="100%"
                    label="Search Offered to Department"
                  />

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
