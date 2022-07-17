import React from "react";
import "./Table.css"

function Table() {
  return (
    <div className="table-container">
      
      <table className="table-custom">
        <thead>
          <tr>
            <th className="text-left">Month</th>
            <th className="text-left">Sales</th>
          </tr>
        </thead>
        
        <tbody className="table-hover">
          <tr>
            <td className="text-left">January</td>
            <td className="text-left">$ 50,000.00</td>
          </tr>
          <tr>
            <td className="text-left">February</td>
            <td className="text-left">$ 10,000.00</td>
          </tr>
          <tr>
            <td className="text-left">March</td>
            <td className="text-left">$ 85,000.00</td>
          </tr>
          <tr>
            <td className="text-left">April</td>
            <td className="text-left">$ 56,000.00</td>
          </tr>
          <tr>
            <td className="text-left">May</td>
            <td className="text-left">$ 98,000.00</td>
          </tr>

        </tbody>
      </table>

    </div>
  );
}

export default Table;
