import React, { useContext } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { AuthContext } from "../../../shared/context/AuthContext";

function HeaderMenu() {
  const auth = useContext(AuthContext);
  return (
    <div className="header_menu">
      <div className="header_menu_container">
        <div id="notifications_btn">
          <NotificationsIcon />
        </div>
        <div id="logout_btn">
          <PowerSettingsNewIcon
            onClick={() => {
              auth.logout();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderMenu;
