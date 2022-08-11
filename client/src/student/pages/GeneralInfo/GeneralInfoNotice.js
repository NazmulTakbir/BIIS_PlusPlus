import React, { useEffect, useState, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import DownloadIcon from "@mui/icons-material/Download";

import { AuthContext } from "../../../shared/context/AuthContext";
import "../../../shared/components/MainContainer.css";

const GeneralInfoNotice = () => {
  const auth = useContext(AuthContext);
  const [notices, setNotices] = useState({ data: [""] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/student/generalinfo/notices`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        const jsonData = await response.json();
        setNotices(jsonData);
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

              <div className="table-container" style={{}}>
                <table className="table-custom">
                  <tbody className="table-hover">
                    {notices.data.map((val, key) => {
                      return (
                        <tr key={key}>
                          <td style={{ width: "300px" }} className="text-left">
                            {val.description}
                          </td>

                          <td style={{ width: "100px" }} className="text-left">
                            Upload Date: <br /> {val.upload_date}
                          </td>

                          <td style={{ width: "40px" }} className="text-left">
                            <a href={val.file_path}>
                              <div className="notice-download">
                                <DownloadIcon />
                              </div>
                            </a>
                          </td>
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

export default GeneralInfoNotice;
