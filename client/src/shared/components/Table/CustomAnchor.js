import React, { useRef } from "react";
import CustomButton from "../CustomButton/CustomButton";

const CustomAnchor = (props) => {
  const anchorRef = useRef();
  const { url } = props.data;

  const handleOnClick = () => {
    anchorRef.current.click();
  };

  return (
    <td className="text-left">
      <div
        className="text-block"
        style={{
          margin: "auto",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-evenly",
          width: "90%",
        }}
      >
        <CustomButton
          width={100}
          label="Download Application"
          variant="contained"
          color="#ffffff"
          bcolor="#DB6066"
          onClickFunction={handleOnClick}
        />
      </div>
      <a ref={anchorRef} href={url} style={{ display: "none" }} target="_blank" rel="noopener noreferrer"></a>
    </td>
  );
};

export default CustomAnchor;
