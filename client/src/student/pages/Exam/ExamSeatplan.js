import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { make2DArray } from "../../../shared/util/TableFunctions";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const processSeatPlan = (rawData) => {
  let maxRow = 0;
  let maxColumn = 0;
  for (let i = 0; i < rawData.length; i++) {
    maxRow = Math.max(maxRow, rawData[i]["row_no"]);
    maxColumn = Math.max(maxColumn, rawData[i]["col_no"]);
  }
  let dataMatrix = make2DArray(maxRow, maxColumn + 1);

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i]["row_no"];
    let col = rawData[i]["col_no"];
    if (col > maxColumn / 2) {
      col += 1;
    }
    dataMatrix[row - 1][col - 1] = rawData[i]["student_id"];
  }

  return dataMatrix;
};

const ExamSeatPlan = () => {
  const auth = useContext(AuthContext);
  const [seatplan, setSeatplan] = useState([]);
  const [building, setBuilding] = useState("");
  const [roomNo, setRoomNo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/exam/seatplan`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setSeatplan(processSeatPlan(jsonData["data"]));
        setBuilding(jsonData["building"]);
        setRoomNo(jsonData["room_no"]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <div
                className="room-no"
                style={{
                  fontWeight: "bolder",
                  color: "rgb(105 122 141)",
                  width: "max-content",
                  border: "1px solid",
                  margin: "auto",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                Exam Room: {building} {roomNo}{" "}
              </div>
              <div className="table-container">
                <table className="table-custom">
                  <tbody className="table-hover">
                    {seatplan.map((row, rowNum) => {
                      return (
                        <tr className="text-left" key={rowNum}>
                          {row.map((cellValue, columnNo) => {
                            return (
                              <td
                                className="text-left"
                                key={columnNo}
                                style={{
                                  backgroundColor: String(auth.userId) === String(cellValue) ? "#f5d2d2" : "",
                                  color: String(auth.userId) === String(cellValue) ? "rgb(151 0 0)" : "",
                                }}
                              >
                                {cellValue}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ExamSeatPlan;
