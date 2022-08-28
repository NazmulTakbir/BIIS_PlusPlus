import React, { useState, useEffect, useRef, useContext } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";
import CustomSearch from "../../shared/components/CustomSearch/CustomSearch";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];

const AddCourseTeachers = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [offering_list, setOffering_list] = useState([]);
  const [teacher_list, setTeacher_list] = useState([]);
  const [offering_id, setOffering_id] = useState(0);

  const [teacher_ids, setTeacher_ids] = useState([0, 0, 0, 0, 0, 0]);
  const [roles, setRoles] = useState([0, 0, 0, 0, 0, 0]);

  const [countTeachers, setCountTeachers] = useState(1);

  //for searchable course offering ids
  const [search_offerings_list, setSearch_offerings_list] = useState([]);
  const is_offering_id_valid = search_offerings_list.some((element) => element.value === offering_id);  

  //for searchable course ids
  const [search_teacherid_list, setSearch_teacherid_list] = useState([]);
  function are_teacher_ids_valid() {
    for (var i = 0; i < countTeachers; i++) {
      const is_teacher_id_valid = search_teacherid_list.some((element) => element.value === teacher_ids[i]);
      if (!is_teacher_id_valid) return false;
    }
    return true;
  };


  const setTeacherIDFromSearch = (value, i) => {
      let temp_ids = [...teacher_ids];
      temp_ids[i] = value;
      setTeacher_ids(temp_ids);
  };

  const incrementCountTeachers = (args) => {
    setCountTeachers(Math.min(countTeachers + 1, 6));
  };

  const decrementCountTeachers = (args) => {
    setCountTeachers(Math.max(countTeachers - 1, 1));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.userType));
        let response = await fetch(`/api/admin/departments/getTeacher`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = await response.json();
        setTeacher_list(jsonData.data);
        
        //set data in valid format for search component
        let search_list = [];
        for (var i = 0; i < jsonData.data.length; i++) {
          search_list.push({
            name: jsonData.data[i].name,
            value: jsonData.data[i].teacher_id,
          });
        }
        setSearch_teacherid_list(search_list);

        response = await fetch(`/api/admin/offering/getOffering_admin_dept`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        jsonData = await response.json();
        setOffering_list(jsonData.data);

        //set data in valid format for search component
        search_list = [];
        for (var i = 0; i < jsonData.data.length; i++) {
          search_list.push({
            name: jsonData.data[i].course_name,
            value: jsonData.data[i].offering_id,
          });
        }
        setSearch_offerings_list(search_list);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/courseteacher/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "teachers.csv";
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
          await fetch(`/api/admin/teacher/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Teachers Added Successfully");
          fileRef.current.value = null;
        },
      });
    };
    reader.readAsText(file);
  };

  const submissionHandler = async (e) => {
    e.preventDefault();
    if(is_offering_id_valid && are_teacher_ids_valid()){
      try {
        let data = [];
        for (let i = 0; i < countTeachers; i++) {
          data.push({
            offering_id: offering_id,
            teacher_id: teacher_ids[i],
            role: roles[i],
          });
        }
        await fetch(`/api/admin/courseteacher/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            data: data,
          }),
        });
  
        setOffering_id("");
        setTeacher_ids([]);
        setRoles([]);
  
        alert("Course Teacher Added Successfully");
        setCountTeachers(1);
      } catch (err) {}
    }else{
      alert("Invalid Inputs Selected");
    }
  };

  const teacherInput = () => {
    let inputs = [];
    for (let i = 0; i < countTeachers; i++) {
      inputs.push(<br />);
      inputs.push(<br />);

      inputs.push(   
        <CustomSearch
          data={search_teacherid_list}
          parentCallback={setTeacherIDFromSearch}
          index={i}
          required={true}
          margin="15px 0px 10px 0px"
          width="100%"
          label="Search Teacher by names"
        />
      );

      inputs.push(
        <FormControl fullWidth style={{ marginTop: "25px" }}>
          <InputLabel id="demo-simple-select-label">Select Role of Teacher</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="teacher_role"
            name="teacher_role"
            value={roles[i]}
            label="Role of Teacher"
            onChange={(e) => {
              let temp_roles = [...roles];
              temp_roles[i] = e.target.value;
              setRoles(temp_roles);
            }}
          >
            {["Coordinator", "Course Teacher", "Scrutinizer"].map((val, key) => {
              return (
                <MenuItem key={key} value={val}>
                  {val}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }
    return inputs;
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
                  
                  <CustomSearch
                    data={search_offerings_list}
                    parentCallback={setOffering_id}
                    required={true}
                    margin="25px 0px 10px 0px"
                    width="100%"
                    label="Search Course Offering"
                  />   

                  <div className="offering-border"
                    style={{
                      borderBottom: "2px solid #b13137",
                      marginTop: "20px"
                    }}
                  ></div>

                  {teacherInput()}


                  <Stack direction="row" style={{ display: "flex", justifyContent: "space-around", marginTop: "30px" }}>
                    <CustomButton
                      type="button"
                      label="Add More Teachers"
                      variant="contained"
                      color="#ffffff"
                      bcolor="rgb(114 115 115)"
                      margin="10px"
                      padding="10px"
                      width="150px"
                      fontSize="17px !important"
                      onClickFunction={incrementCountTeachers}
                      onClickFunctionArguements={[]}
                    />

                    <CustomButton
                      type="button"
                      label="Add Less Teachers"
                      variant="contained"
                      color="#ffffff"
                      bcolor="rgb(72 106 145)"
                      margin="10px"
                      padding="10px"
                      width="150px"
                      fontSize="17px !important"
                      onClickFunction={decrementCountTeachers}
                      onClickFunctionArguements={[]}
                    />
                  </Stack>

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

export default AddCourseTeachers;
