import React, { useContext } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { AuthContext } from "../../../shared/context/AuthContext";

function HeaderMenu() {
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      auth.logout();
    } else {
      return false;
    }
  };

  return (
    <div className="header_menu">
      <div className="header_menu_container">
        {/* <div id="notifications_btn">
          <NotificationsIcon />
        </div> */}

        <div id="logout_btn" onClick={handleLogout}>
          <PowerSettingsNewIcon />
        </div>
      </div>
    </div>
  );
}

export default HeaderMenu;
