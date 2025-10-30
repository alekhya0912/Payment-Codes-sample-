import React from "react";
import NavbarAlekhya from "../pages/PaymentApprovals/ApprovalNavbar";
import ApproverPage from "../pages/PaymentApprovals/ApproverPage";
import Navbar from "../common/Navbar";

function Approval() {
  return (
    <div className="app">
        <Navbar />
        <NavbarAlekhya />      
        <ApproverPage />
    </div>
  );
}

export default Approval;