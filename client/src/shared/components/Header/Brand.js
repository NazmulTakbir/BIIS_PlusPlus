import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';


function toggleSideBar() {
  const nav_ul = document.getElementById("sidebar");
  if (nav_ul.style.display === "none"){
    nav_ul.style.display = "block";
  }else nav_ul.style.display = "none";
}


function Brand() {
  return (
    <div className='brand'>
        <div className='brand_container'>
            <div id='hamburger_btn' onClick={toggleSideBar}>
                <MenuIcon />
            </div>
            <img className='logo' alt='logo' src='https://upload.wikimedia.org/wikipedia/en/thumb/d/da/BUET_LOGO.svg/1200px-BUET_LOGO.svg.png'/>
            <p className='brand_name'>BIIS</p>
        </div>
    </div>
  )
}

export default Brand