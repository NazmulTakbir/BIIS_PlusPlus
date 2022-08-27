import React, { useState, useEffect, useContext } from "react";

import Sidebar from "../../../shared/components/Sidebar/Sidebar";
import Navbar from "../../../shared/components/Navbar/Navbar";
import Header from "../../../shared/components/Header/Header";
import { SidebarData } from "../../components/SidebarData";
import { NavbarData } from "./NavbarData";
import { getSearchBarData } from "../../components/SearchMenuData";
import { AuthContext } from "../../../shared/context/AuthContext";

import "../../../shared/components/MainContainer.css";
import Table from "../../../shared/components/Table/Table";

const columnLabels = ["COURSE ID", "COURSE NAME", "OFFERED TO", "SESSION"];

const AllCourses = () => {
  const auth = useContext(AuthContext);
  const [coordinated, setCoordinated] = useState([]);
  const [taught, setTaught] = useState([]);
  const [scrutinized, setScrutinized] = useState([]);
  const [SearchMenuData, setSearchMenuData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchMenuData(getSearchBarData(auth.responsibilities));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header searchData={SearchMenuData} />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <Navbar NavbarData={NavbarData} />
              <h3>Courses Coordinated</h3>
              <Table columnLabels={columnLabels} tableData={coordinated} />
              <br />
              <br />

              <h3>Courses Taught</h3>
              <Table columnLabels={columnLabels} tableData={taught} />
              <br />
              <br />

              <h3>Courses Scrutinized</h3>
              <Table columnLabels={columnLabels} tableData={scrutinized} />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AllCourses;
