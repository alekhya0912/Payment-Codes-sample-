import React, { useState, useEffect, useMemo } from "react";
import LandingPage from "../pages/AccountBalanceAndReporting/LandingPage";
import AccountHeader from "../pages/AccountBalanceAndReporting/AccountHeader";
import TransactionHistory from "../pages/AccountBalanceAndReporting/TransactionHistory";


// Import your API functions
// (Adjust the path if './api.js' is in a different folder)
import { getBankAccounts, getBatches, getEmployees } from "../services/payrollapi";
import Navbar from "../common/Navbar";

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("INR");

  // --- Backend Data State ---
  const [profiles, setProfiles] = useState([]); // From /api/bank-accounts
  const [batches, setBatches] = useState([]); // From /api/batches
  const [employees, setEmployees] = useState([]); // From /api/employees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Use specific API functions from your api.js
        const [accountsData, batchesData, employeesData] = await Promise.all([
          getBankAccounts(),
          getBatches(),
          getEmployees(),
        ]);

        // 1. Set profiles from bank accounts.
        const profileData = accountsData.map((acc) => ({
          id: acc.id,
          name: acc.accountName,
          accountNumber: acc.accountNumber,
          balance: acc.balance,
          currency: "INR",
          transactions: [],
        }));
        
        setProfiles(profileData);
        setBatches(batchesData);
        setEmployees(employeesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty array means this runs once on component mount

  // --- Transaction Calculation ---
  const transactionsForSelectedAccount = useMemo(() => {
    if (!selectedAccount) {
      return [];
    }

    // 1. Calculate the total salary for each batch
    // We assume employee.salaryAmount is a positive number
    const salaryTotalsByBatchId = employees.reduce((acc, employee) => {
      if (employee.batchId) {
        if (!acc[employee.batchId]) {
          acc[employee.batchId] = 0;
        }
        // Ensure salaryAmount is treated as a number
        acc[employee.batchId] += Number(employee.salaryAmount) || 0;
      }
      return acc;
    }, {});

    // 2. Filter batches that belong to the selected account
    const relevantBatches = batches.filter(
      (batch) => batch.debitAccount === selectedAccount.accountNumber
    );

    // 3. Map batches to the format TransactionHistory expects
    const formattedTransactions = relevantBatches
      .filter(batch => batch.lastPaymentDate) // Only show batches that have been paid
      .map((batch) => ({
        date: batch.lastPaymentDate.split("T")[0], // Format date as YYYY-MM-DD
        id: `TXN-00010${batch.id}`, // Use batch ID as the Transaction ID
        description: batch.name, // Use batch name for description
        amount: salaryTotalsByBatchId[batch.id] || 0, // Get the calculated sum (as a positive debit)
        approver: batch.userId || "N/A", // Use userId as the approver
      }));

    return formattedTransactions;
  }, [selectedAccount, batches, employees]);

  // --- Render Logic ---

  if (loading) {
    // A simple loading state
    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '1.2rem',
            color: '#555'
        }}>
            Loading Account Data...
        </div>
    );
  }

  if (error) {
    // A simple error state
     return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '1.2rem',
            color: 'red'
        }}>
            Error: {error}
        </div>
    );
  }

  if (!selectedAccount) {
    return (
      <>
      <Navbar/>
      <LandingPage
        profiles={profiles}
        onSelectProfile={(acc) => {
          setSelectedAccount(acc);
          setCurrency(acc.currency);
        }}
      />
      </>
    );
  }

  // Once an account is selected, render the account details
  return (
    <div>
      <Navbar/>
      <AccountHeader
        name={selectedAccount.name}
        accountNumber={selectedAccount.accountNumber}
        balance={selectedAccount.balance}
        currency={currency}
      />
      <TransactionHistory
        transactions={transactionsForSelectedAccount}
        balance={selectedAccount.balance} // Current balance
        initialBalance={selectedAccount.initialBalance} // Balance from before any transactions
        currency={currency}
        accountName={selectedAccount.name} // Pass for PDF
        accountNumber={selectedAccount.accountNumber} // Pass for PDF
        onBack={() => setSelectedAccount(null)} // Pass the function to go back
      />
    </div>
  );
}
