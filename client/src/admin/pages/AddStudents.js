import React, { useState, useRef, useContext, useEffect } from "react";
import Papa from "papaparse";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import { getSearchBarData } from "../components/SearchMenuData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";
import { Stack } from "@mui/material";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import { height } from "@mui/system";

const allowedExtensions = ["csv"];

const AddStudents = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.userType));
  }, [auth]);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/student/samplefile", {
      headers: { Authorization: "Bearer " + auth.token },
    });
    const fileData = (await response.json())["data"];

    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "students.csv";
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
          await fetch(`/api/admin/student/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
              data: results.data,
            }),
          });
          setFile("");
          alert("Students added successfully");
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
                    marginTop: "30px",
                    padding: "25px 0px 5px 0px",
                    fontWeight: "bolder",
                    fontSize: "17px",
                    color: "#b13137",
                  }}
                >
                  Add Students by uploading a CSV File:
                </div>
              </div>         


              <div className="file-input_container" style={{ 
                  width: "350px", background: "#fff3e3", 
                  border: "1px solid rgb(189, 189, 189)", borderRadius: "10px",
                  margin: "10px auto auto auto", height: "240px",
                }}>
                  <div className="inner-div" style={{marginTop: "50px"}}>
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
              </div>


            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddStudents;
