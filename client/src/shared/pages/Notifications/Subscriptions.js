import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../components/MainContainer.css";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarData } from "./NavbarData";
import "./Notifications.css";
import Table from "../../components/Table/Table";
import CustomButton from "../../components/CustomButton/CustomButton";

const columnLabels = ["Subscribe", "Notification Type"];
const checkedSubscriptions = [];

const checkBoxCallBack = (id, actionType) => {
  if (actionType === "check") {
    checkedSubscriptions.push(id);
  } else if (actionType === "uncheck") {
    checkedSubscriptions.splice(checkedSubscriptions.indexOf(id), 1);
  }
};

const Subscriptions = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (auth.userType === "student") {
          response = await fetch(`/api/student/notifications/subscriptions`, {
            headers: { Authorization: "Bearer " + auth.token },
          });
        } else if (auth.userType === "teacher") {
          response = await fetch(`/api/teacher/notifications/subscriptions`, {
            headers: { Authorization: "Bearer " + auth.token },
          });
        }
        const jsonData = (await response.json())["data"];

        let tableData = [];
        for (let i = 0; i < jsonData.length; i++) {
          let row = [];
          row.push({ type: "CheckBox", data: { id: jsonData[i]["notification_type"], callback: checkBoxCallBack } });
          row.push({ type: "PlainText", data: { value: jsonData[i]["notification_type"] } });
          tableData.push(row);
        }
        setTableData(tableData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  const submissionHandler = async () => {
    console.log(checkedSubscriptions);
  };

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
