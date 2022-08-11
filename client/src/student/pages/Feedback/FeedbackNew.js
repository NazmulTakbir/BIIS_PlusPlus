import React, { useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";
import Textbox from "../../../shared/components/Textbox/Textbox";
import RadioButton from "../../../shared/components/RadioButton/RadioButton";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

const FeedbackNew = () => {
  const auth = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [receiver, setReceiver] = useState("");

  const submissionHandler = async (event) => {
    event.preventDefault();
    try {
      if (subject === "") {
        alert("Enter Subject");
      } else if (details === "") {
        alert("Enter Details");
      } else if (receiver === "") {
        alert("Enter Receiver");
      } else {
        await fetch(`/api/student/feedback/newsubmission`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            subject: subject,
            details: details,
            receiver: receiver,
            submission_date: new Date(),
          }),
        });
        setSubject("");
        setDetails("");
        alert("Submission Successful");
      }
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
              <Navbar NavbarData={NavbarData} />

              <form onSubmit={submissionHandler} style={{ width: "350px", margin: "auto" }}>
                <Textbox
                  height="40px"
                  width="450px"
                  resize="none"
                  name="subject"
                  placeholder="Type the subject here"
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <Textbox
                  width="450px"
                  height="150px"
                  resize="vertical"
                  name="feedback"
                  placeholder="Type your feedback here"
                  label="Details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />

                <RadioButton
                  label="Receiver"
                  name="receiver"
                  options={["Advisor", "Department Head"]}
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />

                <div
                  className="buttons-stack"
                  style={{
                    margin: "auto",
                  }}
                >
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
                    <CustomButton label="Clear All" variant="outlined" color="#b13137" bcolor="#ffffff" />

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

export default FeedbackNew;
