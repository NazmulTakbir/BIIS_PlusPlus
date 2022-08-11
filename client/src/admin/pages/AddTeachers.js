import React, { useState, useEffect, useRef, useContext } from "react";
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

const allowedExtensions = ["csv"];

const AddTeachers = () => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const [file, setFile] = useState("");

  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [link, setLink] = useState("");
  const [cell_phone, setCellPhone] = useState("");
  const [office_phone, setOfficePhone] = useState("");
  const [department_list, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState("Select a Department");
  const [teacher_name, setTeacher_name] = useState("");
  const [teacher_id, setTeacher_id] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/departments/get`);
        let jsonData = await response.json();
        setDepartmentList(jsonData.data);

        //get next teacher id
        response = await fetch(`/api/admin/teacher/getnextid`);
        jsonData = await response.json();
        setTeacher_id(jsonData.nextid);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const downloadSampleCSV = async (e) => {
    const response = await fetch("/api/admin/teacher/samplefile", {
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
          console.log();
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
    try {
      let data = [
        {
          name: teacher_name,
          email: email,
          room_no: room,
          link: link,
          office_phone: office_phone,
          cell_phone: cell_phone,
          dept_id: department,
          teacher_id: teacher_id,
        },
      ];
      await fetch(`/api/admin/teacher/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data,
        }),
      });
      window.location.reload();
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
                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="teacher_name"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="teacher name:"
                    value={teacher_name}
                    onChange={(e) => setTeacher_name(e.target.value)}
                  />

                  <FormControl fullWidth style={{ marginTop: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="dept_id"
                      name="dept_id"
                      value={department}
                      label="Department"
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      {department_list.map((val, key) => {
                        return (
                          <MenuItem key={key} value={val.dept_id}>
                            {val.dept_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="room"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="Office Phone"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Office Phone"
                    value={office_phone}
                    onChange={(e) => setOfficePhone(e.target.value)}
                  />

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="Cell Phone"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Cell Phone"
                    value={cell_phone}
                    onChange={(e) => setCellPhone(e.target.value)}
                  />

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="Email"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Textbox
                    width="350px"
                    height="46px"
                    resize="none"
                    name="Link"
                    padding="0px"
                    fontSize="17px"
                    placeholder=""
                    label="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
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

export default AddTeachers;
