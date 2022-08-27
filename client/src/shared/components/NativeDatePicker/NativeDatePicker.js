import React from "react";
import "./NativeDatePicker.css";

const NativeDatePicker = (props) => {
  return (
    <div className="date-picker-container" style={{width: props.width, margin: props.margin}}>
      <div className="date-picker-label">{props.label}</div>
      <input
        type="date"
        className="date-picker"
        placeholder="Select Date"
        style={{
          color: props.color,
          backgroundColor: props.backgroundColor,
        }}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default NativeDatePicker;
