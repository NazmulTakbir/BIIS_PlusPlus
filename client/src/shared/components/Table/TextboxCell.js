import React, { useState } from "react";

import Textbox from "../Textbox/Textbox";

const TextboxCell = (props) => {
  const [value, setValue] = useState("");
  const { callback, callbackArguments } = props.data;

  return (
    <td className="text-left">
      <div className="text-block" style={{ margin: "auto", textAlign: "center" }}>
        <Textbox
          width="100px"
          height="40px"
          resize="none"
          padding="0px"
          fontSize="15px"
          value={value}
          onChange={(e) => callback(e.target.value, callbackArguments, setValue)}
        />
      </div>
    </td>
  );
};

export default TextboxCell;
