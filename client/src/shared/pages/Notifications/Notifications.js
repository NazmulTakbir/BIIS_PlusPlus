import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../components/MainContainer.css";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarData } from "./NavbarData";
import "./Notifications.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Notifications = () => {
  const auth = useContext(AuthContext);
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (auth.userType === "student") {
          response = await fetch(`/api/student/notifications/getall`, {
            headers: { Authorization: "Bearer " + auth.token },
          });
        } else if (auth.userType === "teacher") {
          response = await fetch(`/api/teacher/notifications/getall`, {
            headers: { Authorization: "Bearer " + auth.token },
          });
        }
        const jsonData = await response.json();
        setDataTable(jsonData["data"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const renderCell = (element) => {
    return (
      <React.Fragment>
        <Box id="notification-cell">
          {element.seen === true ? (
            <Typography id="notification-title">{element.notification_type}</Typography>
          ) : (
            <Typography id="notification-title">
              {element.notification_type}
              <span className="new-notification-indicator">new</span>
            </Typography>
          )}

          <Typography id="notification-date">
            <div>{element.date.substring(0, 10)}</div>
          </Typography>

          <Typography id="notification-description">
            <div>{element.details}</div>
          </Typography>
        </Box>
      </React.Fragment>
    );
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
      <div className="App">
        <div className="wrapper">
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              {renderPage()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Notifications;
