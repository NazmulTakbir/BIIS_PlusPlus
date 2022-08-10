import React from "react";
import "./CheckboxSingle.css";
import Checkbox from "@mui/material/Checkbox";

const CheckboxSingle = (props) => {
  const { id, callback } = props;

  const handleOnChange = (event) => {
    if (event.target.checked) {
      callback(id, "add");
    } else {
      callback(id, "remove");
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
        <Checkbox onChange={handleOnChange} className="checkbox-main" name={props.name} />
      </div>
    </div>
  );
};

export default CheckboxSingle;
