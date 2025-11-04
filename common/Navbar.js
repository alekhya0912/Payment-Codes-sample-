import React from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import "./Navbar.css";
import logo from "../assets/images/logo.png";



const Navbar = () => {

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login")
  }
  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/home" className="bank-logo-link">
          <img src={logo} alt="Bank Logo" className="bank-logo" />
        </Link>

        <div className="nav-item dropdown">
          
        <Link className="nav-item-link" to="/home">Home</Link>
          {/* <div className="dropdown-content">
            <Link to="/payroll/list1" className="dropdown-item">List 1</Link>
            <Link to="/payroll/list2" className="dropdown-item">List 2</Link>
            <Link to="/payroll/list3" className="dropdown-item">List 3</Link>
          </div> */}
        </div>
        
        <div className="nav-item dropdown">
          
          <Link className="nav-item-link" to="/Payroll-payments" >Payments</Link>
          {/* <div className="dropdown-content">
            <Link to="/payroll/list1" className="dropdown-item">List 1</Link>
            <Link to="/payroll/list2" className="dropdown-item">List 2</Link>
            <Link to="/payroll/list3" className="dropdown-item">List 3</Link>
          </div> */}
        </div>
        
        <div className="nav-item dropdown">
        <Link className="nav-item-link" to="/Transaction-history">Transactions</Link>
          {/* <div className="dropdown-content">
            <Link to="/transactions/list1" className="dropdown-item">List 1</Link>
            <Link to="/transactions/list2" className="dropdown-item">List 2</Link>
            <Link to="/transactions/list3" className="dropdown-item">List 3</Link>
          </div> */}
        </div>

        <div className="nav-item dropdown">
          <Link className="nav-item-link" to="/Approval-page">Approvals </Link>
          {/* <div className="dropdown-content">
            <Link to="/approvals/list1" className="dropdown-item">List 1</Link>
            <Link to="/approvals/list2" className="dropdown-item">List 2</Link>
            <Link to="/approvals/list3" className="dropdown-item">List 3</Link>
          </div> */}
        </div>
        
        <div className="nav-item dropdown">
          <Link className="nav-item-link" to="/Account-balance-and-history">Account Balance</Link>
          {/* <div className="dropdown-content">
            <Link to="/balance/list1" className="dropdown-item">List 1</Link>
            <Link to="/balance/list2" className="dropdown-item">List 2</Link>
            <Link to="/balance/list3" className="dropdown-item">List 3</Link>
          </div> */}
        </div>
        

      </div>

      <div className="navbar-right">
        <button className="signout-btn" onClick={handleSignOut} >Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
