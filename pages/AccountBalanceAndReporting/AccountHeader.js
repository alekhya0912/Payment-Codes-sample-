import React from "react";
import "./AccountHeader.css";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
];

function AccountHeader({ name, accountNumber, balance, currency }) {
  // ✅ Get currency symbol directly (no conversion)
  const getCurrencySymbol = (code) =>
    currencies.find((c) => c.code === code)?.symbol || "";

  return (
    <div className="account-header-root">
      <div>
        <h2>{name}</h2>
        <div className="account-header-accnum">{accountNumber}</div>
      </div>

      <div className="account-header-balance-section">
        <span className="account-header-balance-amount">
          {getCurrencySymbol(currency)}
          {Number(balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>

      </div>
    </div>
  );
}

export default AccountHeader;
