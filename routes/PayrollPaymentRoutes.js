import React from "react";
import PayrollDashboard from "../pages/PayrollPayments/PayrollDashboard/PayrollDashboard";
import Navbar from "../common/Navbar";

function PayrollPaymentRoutes() {
  return (
    <div className="app">
        <Navbar />   
        <PayrollDashboard />
    </div>
  );
}

export default PayrollPaymentRoutes;