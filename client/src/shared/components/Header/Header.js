import React from "react";
import "./Header.css";
import Brand from "./Brand";
import SearchBar from "./SearchBar";
import HeaderMenu from "./HeaderMenu";

function Header() {
  return (
    /*THE TOP BAR*/
    <div className="header">
      {/*THE LOGO AND BIIS*/}
      <Brand />

      {/*SEARCH BAR FUNCTIONALITY CODE:
            https://dev.to/salehmubashar/search-bar-in-react-js-545l
        */}
      <SearchBar />

      {/*THE LOGOUT AND NOTIFICATIONS*/}
      <HeaderMenu />
    </div>
  );
}

export default Header;
