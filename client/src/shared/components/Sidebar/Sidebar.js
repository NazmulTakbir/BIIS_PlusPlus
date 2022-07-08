import React from "react";
import "./Sidebar.css";

const Sidebar = (props) => {
  const { SidebarData } = props;
  return (
    <div className="Sidebar" id="sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {
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
