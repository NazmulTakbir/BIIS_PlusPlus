import React from "react";
import "./CheckboxSingle.css"
import Checkbox from '@mui/material/Checkbox';

const CheckboxSingle = (props) => {
  return (
    <div className="checkbox-container">
      <div className="checkbox-custom" style={{width: props.width}}>
        <div className="checkbox-label">{props.label}</div>
        <Checkbox className="checkbox-main" name={props.name}/>
      </div>
    </div>
  );
};

export default CheckboxSingle;
