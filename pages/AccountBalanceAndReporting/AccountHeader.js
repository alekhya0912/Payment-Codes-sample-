// AccountHeader.js
import React from "react";
import "./AccountHeader.css";

export default function AccountHeader({
  name, accountNumber, balance, currency, onCurrencyChange
}) {
  return (
    <div className="account-header-root">
      <div>
        <h2>{name}</h2>
        <div className="account-header-accnum">{accountNumber}</div>
      </div>
      <div className="account-header-balance-section">
        <span className="account-header-balance-amount">
          {currency === "USD" ? "$" : "₹"}{balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </span>
        <select
          className="account-header-select"
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
        </select>
      </div>
    </div>
  );
}
