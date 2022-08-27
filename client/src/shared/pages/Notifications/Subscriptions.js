import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../components/MainContainer.css";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarData } from "./NavbarData";
import "./Notifications.css"



//remove this later
import { dummyTable } from "./dummy";

const Subscriptions = () => {
  const auth = useContext(AuthContext);
  const dataTable = dummyTable; //fetch data from server

  const renderPage = () => {
    if (dataTable.length === 0) {
      return <h3>You Have No New Notifications</h3>;
    } else {
      return (
        <React.Fragment>
            <h1>Notification Subscriptions</h1>
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

export default Subscriptions;
