import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../components/MainContainer.css";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarData } from "./NavbarData";
import "./Notifications.css"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//remove this later
import { dummyTable } from "./dummy";



const Notifications = () => {
  const auth = useContext(AuthContext);
  const dataTable = dummyTable; //fetch data from server

  //Each Notifications Cell:
  const renderCell = (element) => {
    return (
      <React.Fragment>
        <Box id="notification-cell">
          <Typography
            id="notification-title">
            {element.notification_type}
          </Typography>

          <Typography 
            id="notification-date">
            <div>{element.date}</div>
          </Typography>

          <Typography 
            id="notification-description">
            <div>{element.details}</div>
          </Typography>
        </Box>        
      </React.Fragment>
    )
  };

  //The List of Notifications:
  const renderPage = () => {
    if (dataTable.length === 0) {
      return <h3>You Have No New Notifications</h3>;
    } else {
      return (
        <React.Fragment>
          <div className="notification-container">
            {dataTable.map((element, key) => (
              <div key={key} className="notification-cell">
                {renderCell(element)}
              </div>
            ))}
          </div>
        </React.Fragment>
      );
    }
  };


  return (
    <React.Fragment>
        <div className="content">
          <Navbar NavbarData={NavbarData} />
          {renderPage()}
        </div>
    </React.Fragment>
  );
};

export default Notifications;
