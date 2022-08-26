import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";

import { AuthContext } from "../../context/AuthContext";

const Sidebar = (props) => {
  const auth = useContext(AuthContext);
  const [authorizedSidebar, setAuthorizationSidebar] = useState([]);
  const { SidebarData } = props;

  useEffect(() => {
    async function fetchMyAPI() {
      var elem;
      var i;
      if (auth.userType.toLowerCase() === "student") {
        setAuthorizationSidebar(SidebarData);
      } else if (auth.userType.toLowerCase() === "teacher") {
        let toKeep = ["Teacher Info", "Courses"];

        if (auth.responsibilities.includes("advisor")) {
          toKeep.push("Advisees");
        }
        if (auth.responsibilities.includes("hallprovost")) {
          toKeep.push("Hall Provost Issues");
        }
        if (auth.responsibilities.includes("depthead")) {
          toKeep.push("Dept Head Issues");
        }
        if (auth.responsibilities.includes("examcontroller")) {
          toKeep.push("Exam Controller Issues");
        }

        let temp = [];
        for (i = 0; i < SidebarData.length; i++) {
          elem = SidebarData[i];

          if (toKeep.indexOf(elem.title) !== -1) {
            temp.push(elem);
          }
        }
        setAuthorizationSidebar(temp);
      } else if (auth.userType.toLowerCase() === "office admin") {
        let toKeep = ["Admin Info", "Upload Academic Calender"];

        let temp = [];
        for (i = 0; i < SidebarData.length; i++) {
          elem = SidebarData[i];

          if (toKeep.indexOf(elem.title) !== -1) {
            temp.push(elem);
          }
        }
        setAuthorizationSidebar(temp);
      } else if (auth.userType.toLowerCase() === "department admin") {
        let toKeep = ["Admin Info", "Add Courses", "Add Course Offerings", "Add Teachers", "Assign Course Teachers"];

        let temp = [];
        for (i = 0; i < SidebarData.length; i++) {
          elem = SidebarData[i];

          if (toKeep.indexOf(elem.title) !== -1) {
            temp.push(elem);
          }
        }
        setAuthorizationSidebar(temp);
      } else if (auth.userType.toLowerCase() === "hall admin") {
        let toKeep = ["Admin Info", "Add Students", "Add Scholarship", "Add Dues"];

        let temp = [];
        for (i = 0; i < SidebarData.length; i++) {
          elem = SidebarData[i];

          if (toKeep.indexOf(elem.title) !== -1) {
            temp.push(elem);
          }
        }
        setAuthorizationSidebar(temp);
      } else if (auth.userType.toLowerCase() === "comptroller admin") {
        let toKeep = ["Admin Info", "Payment of Dues", "Payment of Scholarships"];

        let temp = [];
        for (i = 0; i < SidebarData.length; i++) {
          elem = SidebarData[i];

          if (toKeep.indexOf(elem.title) !== -1) {
            temp.push(elem);
          }
        }
        setAuthorizationSidebar(temp);
      }
    }
    fetchMyAPI();
  }, [SidebarData, auth]);

  return (
    <div className="Sidebar" id="sidebar">
      <ul className="SidebarList">
        {authorizedSidebar.map((val, key) => {
          return (
            <li
              key={key}
              onClick={() => {
                window.location.pathname = val.link;
              }}
              id={window.location.pathname === val.link ? "active_menu" : ""}
              className="row"
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
