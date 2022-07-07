import React from 'react'
import './Header.css'
import Brand from './subcomponents/Brand';
import SearchBar from './subcomponents/SearchBar';
import HeaderMenu from './subcomponents/HeaderMenu';


function Header() {
  return (
    /*THE TOP BAR*/
    <div className='header'>

        {/*THE LOGO AND BIIS*/}
        <Brand />

        {/*SEARCH BAR FUNCTIONALITY CODE:
            https://dev.to/salehmubashar/search-bar-in-react-js-545l
        */}
        <SearchBar />
        
        {/*THE LOGOUT AND NOTIFICATIONS*/}
        <HeaderMenu />

    </div>
  )
}

export default Header