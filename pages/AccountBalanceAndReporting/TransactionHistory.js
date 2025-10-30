// TransactionHistory.js
import React, { useState } from "react";
import "./TransactionHistory.css";

export default function TransactionHistory({
  transactions, openingBalance, closingBalance, currency
}) {
  const [filter, setFilter] = useState({ start: "", end: "" });

  const filteredTxns = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    const startDate = filter.start ? new Date(filter.start) : null;
    const endDate = filter.end ? new Date(filter.end) : null;
    return (!startDate || txnDate >= startDate) && (!endDate || txnDate <= endDate);
  });

  return (
    <div className="txn-root">
      <div className="txn-filter-row">
        <div className="txn-date-filters">
          <label>
            Start Date:
            <input
              type="date"
              value={filter.start}
              onChange={e => setFilter({ ...filter, start: e.target.value })}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filter.end}
              onChange={e => setFilter({ ...filter, end: e.target.value })}
            />
          </label>
        </div>
        <div className="txn-actions">
          <button className="clear-btn" onClick={() => setFilter({ start: "", end: "" })}>Clear</button>
          <button className="download-btn">Download PDF</button>
        </div>
      </div>
      <div className="txn-balances-row">
        <span>Opening Balance: <strong>{currency === "USD" ? "$" : "₹"}{openingBalance.toLocaleString(undefined, {minimumFractionDigits:2})}</strong></span>
        <span>Closing Balance: <strong>{currency === "USD" ? "$" : "₹"}{closingBalance.toLocaleString(undefined, {minimumFractionDigits:2})}</strong></span>
      </div>
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          {filteredTxns.map((txn, i) => (
            <tr key={txn.id || i}>
              <td>{txn.date}</td>
              <td>{txn.id}</td>
              <td>{txn.description}</td>
              <td>{currency === "USD" ? "$" : "₹"}{txn.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td>{txn.approver}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}