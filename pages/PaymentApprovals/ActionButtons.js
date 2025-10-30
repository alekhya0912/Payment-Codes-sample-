import React from 'react';
import "./ApprovalPayment.css";
const ActionButtons = ({ onApprove, onReject, isLoading = false }) => {
  return (
    <div className="action-buttons">
      <button 
        className="btn btn-success"
        onClick={onApprove}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Approve'} 
      </button>
      <button 
        className="btn btn-danger"
        onClick={onReject}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Reject'} 
      </button>
    </div>
  );
};

export default ActionButtons;