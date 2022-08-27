import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

function toggleSideBar() {
  const nav_ul = document.getElementById("sidebar");

  //initially not set to anything
  if (nav_ul.style.display === "") {
    nav_ul.style.display = "block";
  }

  //set to block if it is currently none
  else if (nav_ul.style.display === "none") {
    nav_ul.style.display = "block";
  }

  //set to none if it is currently block
  else {
    nav_ul.style.display = "none";
  }
}

const Brand = (props) => {
  return (
    <div className={props.brand_class}>
      <div className={props.brand_container_class}>
        {props.no_menu === "true" ? null : (
          <div id="hamburger_btn" onClick={toggleSideBar}>
            <div className="hamburger_btn_container">
              <MenuIcon />
            </div>
          </div>
        )}
        <img
          className="logo"
          alt="logo"
          src="https://upload.wikimedia.org/wikipedia/en/thumb/d/da/BUET_LOGO.svg/1200px-BUET_LOGO.svg.png"
        />
        <p className={props.brand_name_class}>BIIS</p>
      </div>
    </div>
  );
};

export default Brand;
