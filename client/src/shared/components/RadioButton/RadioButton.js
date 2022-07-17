import React from "react";
import "./RadioButton.css"
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const RadioButton = (props) => {
  return (
    <div className="radio-btn-container">
      <div className="radio-btn-custom">
        
        <FormControl>
        <div className="radio-btn-label">{props.label}</div>
        
            <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name={props.name}
            >
            
                {props.options.map((val, key) => {
                    return (
                    <FormControlLabel 
                        key={key}
                        value={val} 
                        control={<Radio />} 
                        label={val} />
                    );
                })}

            </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default RadioButton;
