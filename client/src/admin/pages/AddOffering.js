import Papa from "papaparse";
import React, { useEffect, useState, useRef, useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";

import "../../shared/components/MainContainer.css";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CustomSearch from "../../shared/components/CustomSearch/CustomSearch";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import { Stack } from "@mui/material";

const allowedExtensions = ["csv"];

const AddOffering = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [dropDownTextCourseID, setdropDownTextCourseID] = useState("Select Course ID");
  const [dropDownOptionsCourseID, setdropDownOptionsCourseID] = useState([]);

  const [dropDownTextExamSlotID, setdropDownTextExamSlotID] = useState("Select Exam Slot ID");
  const [dropDownOptionsExamSlotID, setdropDownOptionsExamSlotID] = useState([]);

  //for searchable exam slot ids
  const [search_examslot_list, setSearch_examslot_list] = useState([]);
  const is_examslot_id_valid = search_examslot_list.some((element) => element.value === dropDownTextExamSlotID);  

  //for searchable course ids
  const [search_courseid_list, setSearch_courseid_list] = useState([]);
  const is_course_id_valid = search_courseid_list.some((element) => element.value === dropDownTextCourseID);   

  useEffect(() => {
    const fetchData = async () => {
      try {
        //finding current session
        setSearchMenuData(getSearchBarData(auth.userType));
        const session_response = await fetch(`/api/shared/session/getcurrent`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const session_data = await session_response.json();
        setCurrentSession(session_data["data"]["session_id"]);

        //courseID dropdown
        const course_id_response = await fetch(`/api/admin/offering/getunofferedcourses`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const course_id_jsonData = await course_id_response.json();
        setdropDownOptionsCourseID(course_id_jsonData["data"]);

        //set data in valid format for search component
        let search_list = [];
        for (var i = 0; i < course_id_jsonData["data"].length; i++) {
          search_list.push({
            name: "Course ID : "+ course_id_jsonData["data"][i],
            value: course_id_jsonData["data"][i],
          });
        }
        setSearch_courseid_list(search_list);

        //Exam slot id dropdown
        const exam_slot_id_response = await fetch(`/api/admin/offering/getexamslots`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const exam_slot_id_jsonData = await exam_slot_id_response.json();
        setdropDownOptionsExamSlotID(exam_slot_id_jsonData["data"]);

        //set data in valid format for search component
        search_list = [];
        for (var i = 0; i < exam_slot_id_jsonData["data"].length; i++) {
          search_list.push({
            name: "Exam Slot - "+ exam_slot_id_jsonData["data"][i],
            value: exam_slot_id_jsonData["data"][i],
          });
        }
        setSearch_examslot_list(search_list);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const addCourseOffering = async (e) => {
    e.preventDefault();

    if(is_examslot_id_valid && is_course_id_valid)
    {
      try {
        let data;
        if (Number.isInteger(parseInt(dropDownTextExamSlotID))) {
          data = [
            {
              course_id: dropDownTextCourseID,
              exam_slot_id: dropDownTextExamSlotID,
              session_id: currentSession,
            },
          ];
        } else {
          data = [
            {
              course_id: dropDownTextCourseID,
              exam_slot_id: null,
              session_id: currentSession,
            },
          ];
        }
    
        await fetch(`/api/admin/offering/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            data: data,
          }),
        });
    
        alert("Course Offering Add Successful");
      } catch (error) {
        console.log(error);
      }
    }else{
      alert("Invalid Inputs Selected!");
    }
  };

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/offering/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "offerings.csv";
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
          await fetch(`/api/admin/offering/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Course Offerings Added Successfully");
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

              <form onSubmit={addCourseOffering} style={{ width: "350px", margin: "auto" }}>
                
                <CustomSearch
                    data={search_courseid_list}
                    parentCallback={setdropDownTextCourseID}
                    required={true}
                    margin="25px 0px 10px 0px"
                    width="100%"
                    label="Search Course ID"
                />

                <CustomSearch
                    data={search_examslot_list}
                    parentCallback={setdropDownTextExamSlotID}
                    required={true}
                    margin="25px 0px 10px 0px"
                    width="100%"
                    label="Search Exam Slot"
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
    </React.Fragment>
  );
};

export default AddOffering;
