import React, { useState } from "react";
import LandingPage from "../pages/AccountBalanceAndReporting/LandingPage";
import AccountHeader from "../pages/AccountBalanceAndReporting/AccountHeader";
import TransactionHistory from "../pages/AccountBalanceAndReporting/TransactionHistory";
import Navbar from "../common/Navbar";
const accounts = [
  {
    id: 1,
    name: "Alex Kumar",
    accountNumber: "4412 1234 7890 6753",
    bankName: "Standard Chartered",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    opening: 41000,
    closing: 168800,
    currency: "USD"
  },
  {
    id: 2,
    name: "Heisenberg",
    accountNumber: "4412 1234 7890 6753",
    bankName: "HDFC Bank",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    opening: 41000,
    closing: 168800,
    currency: "USD"
  },
  {
    id: 3,
    name: "Elon Musk",
    accountNumber: "4412 1234 7890 6753",
    bankName: "ICICI Bank",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    opening: 41000,
    closing: 168800,
    currency: "USD"
  },
  {
    id: 1,
    name: "Alex Kumar",
    accountNumber: "4412 1234 7890 6753",
    bankName: "Standard Chartered",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    opening: 41000,
    closing: 168800,
    currency: "USD"
  },
];

function AccountBalanceRoutes() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("USD");

  if (!selectedAccount) {
    return (<>
    <Navbar/>
    <LandingPage profiles={accounts} onSelectProfile={acc => { setSelectedAccount(acc); setCurrency(acc.currency); }} />;
    </>)
  }

  // You can add currency switch logic for balances here
  return (
    <div>
      <Navbar/>
      <AccountHeader
        name={selectedAccount.name}
        accountNumber={selectedAccount.accountNumber}
        balance={selectedAccount.balance}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <TransactionHistory
        transactions={selectedAccount.transactions}
        openingBalance={selectedAccount.opening}
        closingBalance={selectedAccount.closing}
        currency={currency}
      />
    </div>
  );
}

export default AccountBalanceRoutes;