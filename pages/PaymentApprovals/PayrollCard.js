import React from 'react';
import ActionButtons from './ActionButtons';

const PayrollCard = ({ payroll, onViewDetails, onApprove, onReject, isLoading }) => {
  const formatCurrency = (amount, currency) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="payroll-card">
      <div className="payroll-card-header">
        <div className="payroll-card-title">
          <div className="batch-id">ID: {payroll.id}</div>
          <h3>{payroll.batchName}</h3>
          <div className={`status-badge status-${payroll.status}`}>
            {payroll.status.toUpperCase()}
          </div>
        </div>
        <div className="payroll-card-amount">
          {formatCurrency(payroll.totalAmount, payroll.currency)}
        </div>
      </div>

      <div className="payroll-card-body">
        <div className="payroll-card-details">
          <div className="payroll-detail">
            <span className="detail-label">Employees</span>
            <span className="detail-value">{payroll.employeeCount}</span>
          </div>
          <div className="payroll-detail">
            <span className="detail-label">Debit Account</span>
            <span className="detail-value">{payroll.debitAccount || 'N/A'}</span>
          </div>
          <div className="payroll-detail">
            <span className="detail-label">Currency</span>
            <span className="detail-value">{payroll.currency}</span>
          </div>
          <div className="payroll-detail">
            <span className="detail-label">Approvers</span>
            <span className="detail-value">
              {payroll.approversAssigned}/{payroll.approversRequired}
            </span>
          </div>
          <div className="payroll-detail">
            <span className="detail-label">Created By</span>
            <span className="detail-value">{payroll.createdBy}</span>
          </div>
          <div className="payroll-detail">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(payroll.createdDate)}</span>
          </div>
        </div>

        {payroll.description && (
          <div className="payroll-card-description">
            <p>{payroll.description}</p>
          </div>
        )}
      </div>

      <div className="payroll-card-footer">
        <button 
          className="btn btn-outline"
          onClick={() => onViewDetails(payroll)}
        >
          View Details
        </button>
        
        <ActionButtons
          onApprove={() => onApprove(payroll.id)}
          onReject={() => onReject(payroll.id)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PayrollCard;