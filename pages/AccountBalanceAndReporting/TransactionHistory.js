import React, { useState } from "react";
import "./TransactionHistory.css";
import html2pdf from "html2pdf.js";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
];

function TransactionHistory({
  transactions = [],
  currency = "USD",
  balance = 0, // Use prop from App.js
  accountName = "",
  accountNumber = "",
  onBack, // Accept the onBack prop
}) {
  const [filter, setFilter] = useState({ start: "", end: "" });

  const initialBalance = 15000000;

  const getDefaultDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return { start: oneMonthAgo, end: today };
  };

  const filtered = transactions.filter((txn) => {
    if (txn.initialBalance !== undefined) return false;
    const txnDate = new Date(txn.date);
    const defaultRange = getDefaultDateRange();
    const startDate = filter.start ? new Date(filter.start) : defaultRange.start;
    const endDate = filter.end ? new Date(filter.end) : defaultRange.end;
    return txnDate >= startDate && txnDate <= endDate;
  });

  const sortedTransactions = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const adjustedTransactions = transactions.map((txn) => ({
    ...txn,
    amount: -Math.abs(txn.amount),
  }));

  const adjustedFiltered = sortedTransactions.map((txn) => ({
    ...txn,
    amount: -Math.abs(txn.amount),
  }));

  const openingBalance = (() => {
    const defaultRange = getDefaultDateRange();
    const startDate = filter.start ? new Date(filter.start) : defaultRange.start;

    const totalBeforeStart = adjustedTransactions
      .filter((txn) => new Date(txn.date) < startDate)
      .reduce((sum, txn) => sum + txn.amount, 0);

    return initialBalance + totalBeforeStart;
  })();

  const transactionTotal = adjustedFiltered.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const closingBalance = openingBalance + transactionTotal;

  const getCurrencySymbol = (code) =>
    currencies.find((c) => c.code === code)?.symbol || "$";

    function handleDownload() {
      const symbol = getCurrencySymbol(currency);
      const today = new Date().toISOString().split("T")[0];
  
      const content = document.createElement("div");
      content.style.padding = "24px";
      content.style.fontFamily = "'Poppins', Arial, sans-serif";
      content.style.color = "#333";
      content.style.backgroundColor = "#fff";
  
      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 22px; color: #1e2a5e; margin-bottom: 6px;">Transaction Report</h1>
          <p style="font-size: 11px; color: #777;">Generated on ${new Date().toLocaleString()}</p>
        </div>
  
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
          <h3 style="font-size: 13px; color: #1e2a5e; margin-bottom: 10px; border-bottom: 2px solid #0077b6; display: inline-block; padding-bottom: 2px;">Account Details</h3>
          <div style="font-size: 11px; line-height: 1.6;">
            <div><strong>Account Name:</strong> ${accountName}</div>
            <div><strong>Account Number:</strong> ${accountNumber}</div>
            <div><strong>Bank:</strong> Standard Chartered</div>
            <div><strong>Current Balance:</strong> ${symbol} ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
  
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 13px; color: #1e2a5e; margin-bottom: 10px; border-bottom: 2px solid #0077b6; display: inline-block; padding-bottom: 2px;">Summary</h3>
          <div style="font-size: 11px; line-height: 1.6;">
            <div><strong>Opening Balance:</strong> ${symbol} ${Number(openingBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div><strong>Closing Balance:</strong> ${symbol} ${Number(closingBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
  
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.05); text-align: center;">
          <thead>
            <tr style="background-color: #0077b6; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Transaction ID</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Batch Name</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${sortedTransactions
              .map(
                (txn, index) => `
              <tr style="background-color: ${index % 2 === 0 ? "#f8f9fa" : "#ffffff"};">
                <td style="border: 1px solid #ddd; padding: 8px;">${txn.date}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${txn.id}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${txn.batchName}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${symbol} ${Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
  
        <div style="margin-top: 20px; text-align: right; font-size: 10px; color: #777; border-top: 1px solid #ccc; padding-top: 8px;">
          <em>End of Report</em>
        </div>
      `;
  
      const options = {
        margin: 10,
        filename: `transaction-report-${today}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      html2pdf().set(options).from(content).save();
    }
  

  return (
    <div className="txn-root">
      {/* Filter Section */}
      <div className="txn-filter-row">
        {/* "Back" Button Added */}
        <button className="back-btn" onClick={onBack}>
          Back
        </button>

        <div className="txn-date-filters">
          <label>
            Start Date:
            <input
              type="date"
              value={filter.start}
              onChange={(e) => setFilter({ ...filter, start: e.target.value })}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filter.end}
              onChange={(e) => setFilter({ ...filter, end: e.target.value })}
            />
          </label>
        </div>
        <div className="txn-actions">
          <button className="clear-btn" onClick={() => setFilter({ start: "", end: "" })}>
            Clear
          </button>
          <button className="download-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="txn-balances-row">
        <span className="openingBalance">
          Opening Balance:{" "}
          <strong>
            {getCurrencySymbol(currency)}{" "}
            {openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </strong>
        </span>
        <span className="closingBalance">
          Closing Balance:{" "}
          <strong>
            {getCurrencySymbol(currency)}{" "}
            {closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </strong>
        </span>
      </div>

      {/* Table */}
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Batch Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((txn, i) => (
            <tr key={txn.id || i}>
              <td>{txn.date}</td>
              <td>{txn.id}</td>
              <td>{txn.description}</td>
              <td style={{ textAlign: "right" }}>
                {getCurrencySymbol(currency)}{" "}
                {txn.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
