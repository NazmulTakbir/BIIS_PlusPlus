import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";

import { getSearchBarData } from "../components/SearchMenuData";
import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";
import Textbox from "../../shared/components/Textbox/Textbox";
import CustomButton from "../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";

const UploadNotice = () => {
  const auth = useContext(AuthContext);
  const [SearchMenuData, setSearchMenuData] = useState([]);
  const [subject, setSubject] = useState("");

  const [file, setFile] = useState();
  const filePickerRef = useRef();

  useEffect(() => {
    setSearchMenuData(getSearchBarData(auth.userType));
  }, [auth]);

  const handleFileChangeClick = () => {
    filePickerRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setFile(e.target.files[0]);
    }
  };

  const submissionHandler = async (event) => {
    event.preventDefault();
    if (!file || file === "") {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    try {
      await axios.post("/api/admin/notice/upload", formData, {
        headers: {
          "Content-Type": "application/form-data",
          Authorization: "Bearer " + auth.token,
        },
      });
      alert("File Uploaded Successfully");
      setFile();
      setSubject("");
    } catch (err) {
      console.log(err);
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
              <form onSubmit={submissionHandler}>
                <Textbox
                  height="40px"
                  width="450px"
                  resize="none"
                  name="subject"
                  label="Notice Subject"
                  placeholder="Type the Notice Subject here"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required={true}
                />

                <input
                  ref={filePickerRef}
                  style={{ display: "none" }}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <div
                  className="buttons-stack"
                  style={{
                    margin: "auto",
                  }}
                >
                  {file && file.name !== "" ? (
                    <span>
                      <strong>File Selected:</strong> {file.name}
                    </span>
                  ) : null}

                  <Stack
                    spacing={2}
                    direction="row"
                    style={{
                      margin: "auto",
                      width: "250px",
                      padding: "10px",
                      textAlign: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomButton
                      width={100}
                      label="Select File"
                      variant="contained"
                      color="#ffffff"
                      bcolor="#555555"
                      onClickFunction={handleFileChangeClick}
                    />
                    <CustomButton type="submit" label="Submit" variant="contained" color="#ffffff" bcolor="#b13137" />
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

export default UploadNotice;
