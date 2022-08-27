import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../components/MainContainer.css";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarData } from "./NavbarData";
import "./Notifications.css"
import Table from "../../components/Table/Table";
import CustomButton from "../../components/CustomButton/CustomButton";

const columnLabels = ["Serial", "Types of Notifications"];
const checkedSubscriptions = [];

const checkBoxCallBack = (id, actionType) => {
  if (actionType === "check") {
    checkedSubscriptions.push(id);
  } else if (actionType === "uncheck") {
    checkedSubscriptions.splice(checkedSubscriptions.indexOf(id), 1);
  }
};

const fetchTableData = async (api_route, setTableData, setSessionData, auth) => {

};

const Subscriptions = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [sessionData, setSessionData] = useState({});

  // useEffect(() => {
  //   fetchTableData(`/api/student/courses/coursestodrop`, setTableData, setSessionData, auth);
  // }, [auth]);

  const renderPage = () => {
    return (
      <React.Fragment>
        <Table columnLabels={columnLabels} tableData={tableData} />
        <CustomButton
          label="Unsubscribe"
          variant="contained"
          color="white"
          bcolor="#b13137"
          width="160px"
          onClickFunction={submissionHandler}
          onClickArguments={[]}
        />
      </React.Fragment>
    );
  };

  const submissionHandler = async () => {
    console.log(checkedSubscriptions);
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
