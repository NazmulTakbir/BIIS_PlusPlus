import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function HeaderMenu() {
  return (
    <div className='header_menu'>
        <div className='header_menu_container'>
            <div id='notifications_btn'>
                <NotificationsIcon />
            </div>
            <div id='logout_btn'>
                <PowerSettingsNewIcon />
            </div>
        </div>
    </div>
  )
}

export default HeaderMenu