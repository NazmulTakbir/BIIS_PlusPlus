import React from "react";
import "./Navbar.css";

const Navbar = (props) => {
  const { NavbarData } = props;
  return (
    <div className="Navbar" id="navbar">
      <ul className="NavbarList">
        {NavbarData.map((val, key) => {
          return (
            <li
              key={key}
              onClick={() => {
                window.location.pathname = val.link;
              }}
              id={window.location.pathname === val.link ? "active_menu" : ""}
              className="tab"
            >
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
