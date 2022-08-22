import React from "react";
import "./Header.css";
import Brand from "./Brand";
import CustomSearch from "../CustomSearch/CustomSearch";
import HeaderMenu from "./HeaderMenu";

const Header = (props) => {
  return (
    /*THE TOP BAR*/
    <div className="header">
      {/*THE LOGO AND BIIS*/}
      <Brand brand_class="brand" brand_container_class="brand_container" brand_name_class="brand_name"/>

      {/*SEARCH BAR FUNCTIONALITY CODE:
            https://dev.to/salehmubashar/search-bar-in-react-js-545l
        */}
      <CustomSearch data={props.searchData} onClickRoute={true}/>

      {/*THE LOGOUT AND NOTIFICATIONS*/}
      <HeaderMenu />
    </div>
  );
}

export default Header;
