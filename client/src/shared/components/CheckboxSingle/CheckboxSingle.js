import React from "react";
import "./CheckboxSingle.css";
import Checkbox from "@mui/material/Checkbox";

const CheckboxSingle = (props) => {
  const { id, callback, custom_checked } = props;

  let provided_check_state;
  if (custom_checked === undefined || custom_checked === false) {
    provided_check_state = false;
  } else {
    provided_check_state = true;
  }

  const handleOnChange = (event) => {
    if (event.target.checked) {
      callback(id, "check");
    } else {
      callback(id, "uncheck");
    }
  };

  return (
    <div className="checkbox-container">
      <div className="checkbox-custom" style={{ width: props.width }}>
        {props.label !== undefined ? (
          <div className="checkbox-label">{props.label}</div>
        ) : (
          <div className="checkbox-label" style={{ display: "none" }}></div>
        )}
        <Checkbox
          key={id}
          onChange={handleOnChange}
          className="checkbox-main"
          name={props.name}
          defaultChecked={provided_check_state}
        />
      </div>
    </div>
  );
};

export default CheckboxSingle;
