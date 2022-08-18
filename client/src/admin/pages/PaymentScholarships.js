import React, { useEffect, useContext } from "react";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Header from "../../shared/components/Header/Header";
import { SidebarData } from "../components/SidebarData";

import { AuthContext } from "../../shared/context/AuthContext";
import "../../shared/components/MainContainer.css";

const PaymentDues = () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/comptroller/pendingscholarships`, {
          headers: { Authorization: "Bearer " + auth.token },
        });
        let jsonData = (await response.json())["message"];
        console.log(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  return (
    <React.Fragment>
      <div className="App">
        <Header />
        <div className="wrapper">
          <Sidebar SidebarData={SidebarData} />
          <div className="main_container">
            <div className="content">
              <h5>PendingScholarships - mark as paid from table: similar to advisor approving course reg req</h5>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PaymentDues;
