import React, { useState, useRef, useContext, useEffect } from "react";
import Papa from "papaparse";

import { getSearchBarData } from "../components/SearchMenuData";
import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import NativeDatePicker from "../../shared/components/NativeDatePicker/NativeDatePicker";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import "react-datepicker/dist/react-datepicker.css";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];

const UploadAcademicCalender = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState("");
  const [session_id, setSessionID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [session_year, setSessionYear] = useState("");
  const [session_semester, setSessionSemester] = useState("");
  const [year_list, setYearList] = useState([]);
  const semester_list = ["JULY", "JAN"];

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.userType));
    populateSessions();
  }, [auth]);

  const populateSessions = () => {
    const currentYear = (new Date()).getFullYear();
    let list = [];
    for(var i=4; i>0; i--) list.push(currentYear-i);
    for(var i=0; i<4; i++) list.push(currentYear+i);
    setYearList(list);
    console.log(list);
  };

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

  const submissionHandler = async (event) => {
    event.preventDefault();
    setSessionID(session_semester+" "+session_year);

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      Papa.parse(target.result, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        complete: async function (results, file) {
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
          alert("Academic Calender Created Successfully");
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
              <form onSubmit={submissionHandler} style={{ width: "350px", margin: "40px auto" }}>
                
                <div className="header-text"
                  style={{
                    color: "#b13127", fontSize: "17px", fontWeight: "bold",
                  }}>Upload New Academic Calendar
                </div>

                <Stack direction="row" justifyContent="space-between">
                  <FormControl style={{ marginTop: "25px", width: "170px" }}>
                      <InputLabel id="demo-simple-select-label">Semester</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="session_semester"
                        name="session_semester"
                        required={true}
                        value={session_semester}
                        label="Semester"
                        onChange={(e) => setSessionSemester(e.target.value)}
                      >
                        {semester_list.map((val, key) => {
                          return (
                            <MenuItem key={key} value={val}>
                              {val}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl> 

                    <FormControl style={{ marginTop: "25px", width: "150px" }}>
                      <InputLabel id="demo-simple-select-label">Year</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="session_year"
                        name="session_year"
                        value={session_year}
                        required={true}
                        label="Year"
                        onChange={(e) => setSessionYear(e.target.value)}
                      >
                        {year_list.map((val, key) => {
                          return (
                            <MenuItem key={key} value={val}>
                              {val}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>                         
                </Stack>
 
                <NativeDatePicker
                    value={startDate}
                    required={true}
                    width="100%"
                    label="Set Start Date"
                    margin="22px 0px 10px 0px"
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <NativeDatePicker
                    value={endDate}
                    width="100%"
                    required={true}
                    label="Set End Date"
                    margin="22px 0px 10px 0px"
                    onChange={(e) => setEndDate(e.target.value)}
                />                

                <div className="header-text"
                  style={{
                    color: "#b13127", fontSize: "17px", fontWeight: "bold", margin: "30px auto 10px auto",
                  }}>File Detailing Session Phases
                </div>  
                <div className="file-section" style={{ 
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
                    required={true}
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


              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UploadAcademicCalender;
