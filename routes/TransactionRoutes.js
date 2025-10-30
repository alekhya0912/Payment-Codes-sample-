import React from "react";
import Navbar from "../common/Navbar";
import BatchesContainer from "../pages/TransactionHistory/BatchContainer";

function TransactionRoutes() {
  return (
    <div>
        <Navbar />
        <BatchesContainer />
    </div>
  );
}

export default TransactionRoutes;