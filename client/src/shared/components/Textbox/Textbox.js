import React from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import "./Textbox.css"

const Textbox = (props) => {
  return (
    <div className="textbox-container">
      <div className="textbox-custom">
        
        <div className="textbox-label">{props.label}</div>
        
        <TextareaAutosize className="input-text-area" name={props.name}
          placeholder={props.placeholder}
          style={{ 
            width: props.width,
            height: props.height, 
            resize: props.resize,
         }}
        />
      
      </div>
    </div>
  );
}

export default Textbox;
