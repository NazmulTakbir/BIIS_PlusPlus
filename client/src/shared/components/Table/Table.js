import React from "react";
import "./Table.css";
import CustomButton from "../CustomButton/CustomButton";
import CheckboxSingle from "../CheckboxSingle/CheckboxSingle";
import CustomModal from "../../../shared/components/CustomModal/CustomModal";

const Table = (props) => {
  const { columnLabels, dataMatrix } = props;

  let buttonMatrix = props.buttonMatrix;
  if (buttonMatrix === undefined) {
    buttonMatrix = [];
  }

  let checkBox = props.checkBox;
  if (checkBox === undefined) {
    checkBox = "";
  }

  let modal = props.modal;
  if (modal === undefined) {
    modal = "";
  }

  return (
    <div className="table-container">
      <table className="table-custom">
        <thead>
          <tr>
            {columnLabels.map((val) => {
              return (
                <th className="text-left" key={val}>
                  <div className="text-block">{val}</div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="table-hover">
          {dataMatrix.map((row, rowNum) => {
            return (
              <tr className="text-left" key={rowNum}>
                {row.map((cellValue, columnNo) => {
                  return (
                    <td className="text-left" key={columnNo}>
                      <div className="text-block">{cellValue}</div>
                    </td>
                  );
                })}

                {buttonMatrix.length > rowNum ? (
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
                      {buttonMatrix[rowNum].map((buttomDetails, columnNo) => {
                        return (
                          <CustomButton
                            key={columnNo}
                            label={buttomDetails[0]}
                            variant="contained"
                            color={buttomDetails[2]}
                            bcolor={buttomDetails[1]}
                          />
                        );
                      })}
                    </div>
                  </td>
                ) : null}

                {checkBox === "true" ? (
                  <td className="text-left">
                    <div className="text-block" style={{ margin: "auto", textAlign: "center" }}>
                      <CheckboxSingle name="checkbox" width="max-content" />
                    </div>
                  </td>
                ) : null}

                {modal === "true" ? (
                  <td className="text-left"  style={{ margin: "0", padding: "5px" }}>
                    <div className="text-block" style={{ margin: "auto", padding: "5px" }}>
                      <CustomModal buttonText="View" label="Subject" text="Hello, World!"/>
                    </div>                    
                  </td>
                ) : null}

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;