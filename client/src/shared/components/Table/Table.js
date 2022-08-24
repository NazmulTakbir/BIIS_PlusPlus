import React, { Fragment } from "react";
import "./Table.css";
import SimpleModal from "./SimpleModal";
import PlainText from "./PlainText";
import Buttons from "./Buttons";
import CheckBox from "./CheckBox";
import TextboxCell from "./TextboxCell";

const Table = (props) => {
  const { columnLabels, tableData } = props;

  const renderCell = (cellData) => {
    switch (cellData.type) {
      case "PlainText":
        return <PlainText data={cellData.data} />;
      case "SimpleModal":
        return <SimpleModal data={cellData.data} />;
      case "Buttons":
        return <Buttons data={cellData.data} />;
      case "CheckBox":
        return <CheckBox data={cellData.data} />;
      case "TextboxCell":
        return <TextboxCell data={cellData.data} />;
      case "empty":
        return <td className="text-left"></td>;
      default:
        return null;
    }
  };

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
          {tableData.map((row, rowNum) => {
            return (
              <tr className="text-left" key={rowNum}>
                {row.map((cellData, columnNo) => {
                  return <Fragment key={columnNo}>{renderCell(cellData)}</Fragment>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
