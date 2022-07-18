// import React, { useEffect, useState } from "react";
import React from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";

import "../../../shared/components/MainContainer.css";
import Textbox from "../../../shared/components/Textbox/Textbox";
import RadioButton from "../../../shared/components/RadioButton/RadioButton";
import CheckboxSingle from "../../../shared/components/CheckboxSingle/CheckboxSingle";
import CustomButton from "../../../shared/components/CustomButton/CustomButton";
import Stack from "@mui/material/Stack";

// const studentID = require("../../../placeHolder");

const FeedbackComplaintNew = () => {
  // Write Post Request Logics

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />

              {/* WRAP AROUND REACT FORM     */}

              <Textbox
                height="40px"
                width="450px"
                resize="none"
                name="subject"
                placeholder="Type the subject here"
                label="Subject"
              />

              <Textbox
                width="450px"
                height="150px"
                resize="vertical"
                name="feedback"
                placeholder="Type your feedback here"
                label="Feedback"
              />

              <RadioButton label="Receiver" name="receiver" options={["Advisor", "Department Head"]} />

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

                  <CustomButton label="Submit" variant="contained" color="#ffffff" bcolor="#b13137" />
                </Stack>
              </div>

              {/* WRAP AROUND REACT FORM     */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FeedbackComplaintNew;
