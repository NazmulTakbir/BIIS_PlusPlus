import React, { useRef } from "react";
import CustomButton from "../CustomButton/CustomButton";

const CustomAnchor = (props) => {
  const anchorRef = useRef();
  const { auth, file_id } = props.data;

  const anchorClick = async () => {
    if (anchorRef.current.href) {
      return;
    }

    const result = await fetch(`/api/student/scholarship/applicationpdf/${file_id}`, {
      headers: { Authorization: "Bearer " + auth.token },
    });

    const blob = await result.blob();
    const href = window.URL.createObjectURL(blob);
    anchorRef.current.href = href;
    anchorRef.current.click();
  };

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
      <a
        role="button"
        ref={anchorRef}
        onClick={anchorClick}
        style={{ display: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </td>
  );
};

export default CustomAnchor;
