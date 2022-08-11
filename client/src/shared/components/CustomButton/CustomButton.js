import React from "react";
import "./CustomButton.css";
import Button from "@mui/material/Button";

const CustomButton = (props) => {
  const renderButtom = () => {
    if (props.onClickFunction === undefined) {
      return (
        <Button
          type={props.type}
          className="btn-custom"
          variant={props.variant}
          style={{
            color: props.color,
            backgroundColor: props.bcolor,
            margin: props.margin,
            padding: props.padding,
            fontSize: props.fontSize,
          }}
        >
          {props.label}
        </Button>
      );
    } else {
      return (
        <Button
          type={props.type}
          className="btn-custom"
          variant={props.variant}
          style={{
            color: props.color,
            backgroundColor: props.bcolor,
            margin: props.margin,
            padding: props.padding,
            fontSize: props.fontSize,
          }}
          onClick={() => props.onClickFunction(props.onClickArguments)}
        >
          {props.label}
        </Button>
      );
    }
  };

  return <div className="btn-container">{renderButtom()}</div>;
};

export default CustomButton;
