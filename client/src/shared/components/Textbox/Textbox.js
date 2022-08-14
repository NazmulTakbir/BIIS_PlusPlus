import React from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import "./Textbox.css";

const Textbox = (props) => {
  return (
    <div className="textbox-container">
      <div className="textbox-custom" style={{padding: props.padding, width: props.width}}>
        <div className="textbox-label">{props.label}</div>

        <TextareaAutosize
          className="input-text-area"
          name={props.name}
          placeholder={props.placeholder}
          style={{
            width: props.width,
            height: props.height,
            resize: props.resize,
            fontSize: props.fontSize,
          }}
          value={props.value}
          required={props.required}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};

export default Textbox;
