import React from 'react';
import ActionButtons from './ActionButtons';

const PayrollDetailsModal = ({ payroll, employees = [], onClose, onApprove, onReject, isLoading, showActionButtons = true }) => {
  if (!payroll) return null;

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
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal payroll-details-modal">
        <div className="modal-header">
          <h2 className="modal-title">Payroll Batch Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Header Section */}
          <div className="details-header">
            <div className="details-title-section">
              <div className="details-batch-id">Batch ID: {payroll.id}</div>
              <h3 className="details-title">{payroll.batchName}</h3>
              <div className={`status-badge status-${payroll.status}`}>
                {payroll.status.toUpperCase()}
              </div>
            </div>
            <div className="details-amount">
              <div className="amount-value">{formatCurrency(payroll.totalAmount, payroll.currency)}</div>
              <div className="amount-label">Total Amount ({payroll.currency})</div>
            </div>
          </div>

          {/* Description */}
          {payroll.description && (
            <div className="details-description">
              <h4>Description</h4>
              <p>{payroll.description}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="details-metrics">
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">{payroll.employeeCount}</div>
                <div className="metric-label">Employees</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">{payroll.currency}</div>
                <div className="metric-label">Currency</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">
                  {payroll.approversAssigned}/{payroll.approversRequired}
                </div>
                <div className="metric-label">Approvers</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">{payroll.debitAccount || 'N/A'}</div>
                <div className="metric-label">Debit Account</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">{payroll.createdBy}</div>
                <div className="metric-label">Created By</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <div className="metric-value">{formatDate(payroll.createdDate)}</div>
                <div className="metric-label">Created Date</div>
              </div>
            </div>
          </div>

          {/* Employee Breakdown */}
          <div className="details-breakdown">
            <h4>Employee Breakdown</h4>
            <div className="breakdown-table">
              <div className="table-header">
                <div className="table-cell">Employee ID</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Department</div>
                <div className="table-cell">Amount</div>
              </div>
              {(employees && employees.length > 0
                ? employees
                : Array.from({ length: payroll.employeeCount }, (_, i) => ({
                    id: `EMP${String(i + 1).padStart(3, '0')}`,
                    name: `Employee ${i + 1}`,
                    department: '—',
                    salaryAmount: (payroll.totalAmount || 0) / Math.max(1, payroll.employeeCount)
                  }))
              ).map((emp, idx) => (
                <div key={emp.id || idx} className="table-row">
                  <div className="table-cell">{emp.id || `EMP${String(idx + 1).padStart(3, '0')}`}</div>
                  <div className="table-cell">{emp.name || `Employee ${idx + 1}`}</div>
                  <div className="table-cell">{emp.department || '—'}</div>
                  <div className="table-cell amount">{formatCurrency(Number(emp.salaryAmount || 0), payroll.currency)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Details (only for reviewed batches) */}
          {payroll.status !== 'pending' && (
            <div className="details-description">
              <h4>Decision</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Status</div>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{payroll.status?.toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Decision Date</div>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{payroll.approvedDate ? formatDate(payroll.approvedDate) : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Approved By</div>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{payroll.approvedBy || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Comments</div>
                  <div style={{ fontWeight: 600, marginTop: '4px', wordBreak: 'break-word' }}>{payroll.approvalComments || '—'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          {showActionButtons && (
            <ActionButtons
              onApprove={() => onApprove(payroll.id)}
              onReject={() => onReject(payroll.id)}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailsModal;