import React, { useState, useEffect } from 'react';
import PayrollDetailsModal from './PayrollDetailsModal';
import Navbar from '../../common/Navbar';
import ApprovalService from '../../services/ApprovalService';
import { getEmployees } from '../../services/payrollapi';

const ApprovalsPage = () => {
  const [allApprovals, setAllApprovals] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);

  // Load reviewed batches from API
  useEffect(() => {
    const loadReviewedBatches = async () => {
      try {
        const apiBatches = await ApprovalService.getReviewedBatches();
        const transformedBatches = apiBatches.map(ApprovalService.transformBatchData);
        setAllApprovals(transformedBatches);
      } catch (error) {
        console.error('Error loading reviewed batches:', error);
        // Fallback to empty array if API fails
        setAllApprovals([]);
      }
    };

    loadReviewedBatches();
    (async ()=>{
      try{
        const employees=await getEmployees();
        setAllEmployees(Array.isArray(employees) ? employees : []);
      }
      catch(empErr){
        console.error('Error loading employees: ',empErr);
        setAllEmployees([]);
      }
    })();

    const onUpdated =() => {
      loadReviewedBatches();
    };
    window.addEventListener('approvals:updated',onUpdated);
    return () => {
      window.removeEventListener('approvals.updated',onUpdated);
    };
  }, []);

  // Filter approvals based on selected status
  const filteredApprovals = allApprovals.filter(payroll => {
    if (filterStatus === 'all') return true;
    return payroll.status === filterStatus;
  });

  // Calculate statistics
  const stats = {
    total: allApprovals.length,
    approved: allApprovals.filter(p => p.status === 'approved').length,
    rejected: allApprovals.filter(p => p.status === 'rejected').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedPayroll(null);
  };

  return (
    <div>
      <Navbar />
    <div className="approvals-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Reviewed Batches</h1>
              <p className="page-subtitle">
                View and manage your reviewed payroll batches
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon total"></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Reviewed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved"></div>
            <div className="stat-content">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rejected"></div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('approved')}
            >
              Approved ({stats.approved})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilterStatus('rejected')}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Approvals List */}
        <div className="approvals-section">
          {filteredApprovals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No approvals found</h3>
              <p>
                {allApprovals.length === 0 
                  ? "You haven't reviewed any payroll batches yet. Go to the main dashboard to review pending batches."
                  : "No payroll batches match the selected filter."
                }
              </p>
            </div>
          ) : (
            <div className="approvals-grid">
              {filteredApprovals.map(payroll => (
                <div key={payroll.id} className="approval-card">
                  <div className="approval-card-header">
                    <div className="approval-card-title">
                      <h3>{payroll.batchName}</h3>
                      <div className={`status-badge status-${payroll.status}`}>
                        {payroll.status === 'approved' ? '✅' : '❌'} 
                        {payroll.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="approval-card-amount">
                      {formatCurrency(payroll.totalAmount, payroll.currency)}
                    </div>
                  </div>

                  <div className="approval-card-body">
                    <div className="approval-details">
                      <div className="approval-detail">
                        <span className="detail-label">Employees</span>
                        <span className="detail-value">{payroll.employeeCount}</span>
                      </div>
                      <div className="approval-detail">
                        <span className="detail-label">Debit Account</span>
                        <span className="detail-value">{payroll.debitAccount || 'N/A'}</span>
                      </div>
                      <div className="approval-detail">
                        <span className="detail-label">Created By</span>
                        <span className="detail-value">{payroll.createdBy}</span>
                      </div>
                      <div className="approval-detail">
                        <span className="detail-label">Created</span>
                        <span className="detail-value">{formatDate(payroll.createdDate)}</span>
                      </div>
                      <div className="approval-detail">
                        <span className="detail-label">
                          {payroll.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                        <span className="detail-value">{payroll.approvedDate ? formatDate(payroll.approvedDate) : '—'}</span>
                      </div>
                      {payroll.approvedBy && (
                        <div className="approval-detail">
                          <span className="detail-label">Approved By</span>
                          <span className="detail-value">{payroll.approvedBy}</span>
                        </div>
                      )}
                      {payroll.approvalComments && (
                        <div className="approval-detail">
                          <span className="detail-label">Comments</span>
                          <span className="detail-value">{payroll.approvalComments}</span>
                        </div>
                      )}
                    </div>

                    {payroll.description && (
                      <div className="approval-description">
                        <p>{payroll.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="approval-card-footer">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleViewDetails(payroll)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && (
          <PayrollDetailsModal
            payroll={selectedPayroll}
            employees={allEmployees.filter(
              (e)=>String(e.batchId || ' ') === String(selectedPayroll.id || '')
            )}
            onClose={handleCloseModal}
            onApprove={() => {}} // No approve action for completed approvals
            onReject={() => {}} // No reject action for completed approvals
            isLoading={false}
            showActionButtons={false}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default ApprovalsPage;
