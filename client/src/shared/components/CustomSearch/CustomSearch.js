import React, { useState } from "react";
import "./CustomSearch.css";
import TextField from "@mui/material/TextField";


const CustomSearch = (props) => {
  let data = props.data;
  if(data === undefined) data = [];
  
  //if-defined: is a link search, else: a dropdown
  const onClickRoute = props.onClickRoute;

  const [user_input, set_typed_in_value] = useState("");
  const [error_msg, set_error_msg] = useState("");

  //when typed in a value
  const onChange = async (e) => {
      const value = e.target.value;
      set_typed_in_value(value);
      
      //check if input value is in data array
      const is_user_input_valid = data.some(
        (element) => element.toLowerCase().includes(value.toLowerCase())
      );
      
      if (value.length > 0 && !is_user_input_valid) {
        set_error_msg("No search results found!");
      } else {
        set_error_msg("");
      }
  };

  //when search/enter pressed
  const onSearch = async (name, value) => {
      set_typed_in_value(name);
      
      //link is clicked!
      if(onClickRoute !== undefined) {
        window.location.pathname = value;
      }
  };

  //gets top ten data from fetched results
  const top_filtered_data = data.filter((item) => {
    const searchTerm = user_input.toLowerCase();
    const name = item.name.toLowerCase();
    
    if (onClickRoute !== undefined) {
      return searchTerm && name.includes(searchTerm);
    } else return searchTerm && name.includes(searchTerm) && name !== searchTerm;

  }).slice(0, 10);


  return (
    <div className="search_bar">
        
        <TextField
            id="outlined-basic"
            variant="outlined"
            label="Search"
            value={user_input}
            type="text"
            className="search-text"
            onChange={onChange}
        />

        <div className="dropdown"
          id={ top_filtered_data.length > 0 ? "active-dropdown" : ""}>
          {top_filtered_data.map((item, key) => (
              <div className="dropdown-item" key={key} onClick={() => onSearch(item.name, item.value)}>
                {item.name}
              </div>
            ))}
        </div>

        <div style={{color: "#b13137"}} className="search_error">{error_msg}</div>

    </div>
  );
};

export default CustomSearch;

