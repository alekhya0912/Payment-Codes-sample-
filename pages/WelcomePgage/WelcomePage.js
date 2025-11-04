import React, { useEffect, useState } from "react";
import Navbar from "../../common/Navbar";
import "./WelcomePage.css"; 
import { Link } from "react-router-dom";
import Payroll from "../../assets/images/Payroll.jpg";
import Transaction from "../../assets/images/Transaction.jpg";
import Approvals from "../../assets/images/Approvals.jpg";
import Accounts from "../../assets/images/Accounts.jpg";
import { getCurrentUser } from "../../services/api";

const WelcomePage = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUserId(data.userId);
      } catch (err) {
        setError("Could not load user");
        console.error(err);
      }
    }
    fetchUser();
  }, [])
  return (
    <div className="welcome-container">
      
      <Navbar /> 
      
      <div className="welcome-message">
        <h1>Welcome {userId}</h1>
        <p>Manage Payroll, Transactions, Approvals, and Account Details with ease.</p>
      </div>

      <div className="cards-grid">
        <div className="feature-card">
          <img src={Payroll} alt="Payroll" />
          <h3>Payroll Management</h3>
          <p>Manage and process employee payroll securely and efficiently.</p>
          <Link to="/Payroll-payments"><button className="learn-btn">Learn more</button></Link>
        </div>
        <div className="feature-card">
          <img src={Transaction} alt="Transaction" />
          <h3>Transaction Overview</h3>
          <p>Track and analyze all your company's transactions in one place.</p>
          <Link to="/Transaction-history"><button className="learn-btn">Learn more</button></Link>
        </div>
        <div className="feature-card">
          <img src={Approvals} alt="Approvals" />
          <h3>Approvals & Workflows</h3>
          <p>Approve or reject requests seamlessly with real-time notifications.</p>
          <Link to="/Approval-page"><button className="learn-btn">Learn more</button></Link>
        </div>
        <div className="feature-card">
          <img src={Accounts} alt="Accounts" />
          <h3>Account Balance</h3>
          <p>View, manage, and track your accounts with live balance updates.</p>
          <Link to="/Account-balance-and-history"><button className="learn-btn">Learn more</button></Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
