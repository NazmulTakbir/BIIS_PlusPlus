import React from "react";
import "./Table.css";
import CustomButton from "../CustomButton/CustomButton"

const Table = (props) => {
  const { columnLabels, dataMatrix } = props;

  let buttonMatrix = props.buttonMatrix;
  if (buttonMatrix === undefined) {
    buttonMatrix = [];
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
                    {buttonMatrix[rowNum].map((buttomDetails, columnNo) => {
                      return (
                        <div className="text-block" style={{ margin: "auto", textAlign: "center"}}>
                          <CustomButton
                            label={buttomDetails[0]}
                            variant="contained"
                            color={buttomDetails[2]}
                            bcolor={buttomDetails[1]}
                          />
                        </div>
                      );
                    })}
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
