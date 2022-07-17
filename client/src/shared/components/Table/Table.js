import React from "react";
import "./Table.css";

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
                  {val}
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
                      {cellValue}
                    </td>
                  );
                })}
                {buttonMatrix.length > rowNum ? (
                  <td className="text-left">
                    {buttonMatrix[rowNum].map((buttomDetails, columnNo) => {
                      return (
                        <button style={{ backgroundColor: buttomDetails[1], color: buttomDetails[2] }} key={columnNo}>
                          {buttomDetails[0]}
                        </button>
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
