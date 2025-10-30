import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./ApprovalPayment.css";
const ApprovalNavbar = () => {
  const location = useLocation();
  const isApprovalsPage = location.pathname === '/approvals';

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/Approval-page" className="navbar-logo">
              Approvals Dashboard
            </Link>
          </div>
          
          <div className="navbar-right">
            <div className="navbar-user">
              <Link 
                to="/reviewed-batches"
                className={`navbar-user-button ${isApprovalsPage ? 'active' : ''}`}
              >
                <div className="user-info">
                  <div className="user-name">Reviewed Batches</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ApprovalNavbar;