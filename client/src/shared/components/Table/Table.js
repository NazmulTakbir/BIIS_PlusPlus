import React, { Fragment } from "react";
import "./Table.css";
import SimpleModal from "./SimpleModal";
import PlainText from "./PlainText";
import Buttons from "./Buttons";
import CheckBox from "./CheckBox";
import TextboxCell from "./TextboxCell";
import MultiBodyModal from "./MultiBodyModal";
import CustomAnchor from "./CustomAnchor";

const Table = (props) => {
  const { columnLabels, tableData, margin_bottom, noDataMessage } = props;

  let emptyTableMessage;
  if (!noDataMessage || noDataMessage.length === 0) {
    emptyTableMessage = "You have no data for this page!";
  } else {
    emptyTableMessage = noDataMessage;
  }

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
      case "MultiBodyModal":
        return <MultiBodyModal data={cellData.data} />;
      case "CustomAnchor":
        return <CustomAnchor data={cellData.data} />;
      case "empty":
        return <td className="text-left"></td>;
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: margin_bottom }} className="table-container">
      {tableData.length === 0 ? (
        <div className="empty-table-msg">{emptyTableMessage}</div>
      ) : (
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
      )}
    </div>
  );
};

export default Table;
