import React, { useState, useEffect } from 'react';
import PayrollCard from './PayrollCard';
import PayrollDetailsModal from './PayrollDetailsModal';
import ApprovalService from '../../services/ApprovalService';
import { getEmployees } from '../../services/payrollapi';

const ApproverPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [authError, setAuthError] = useState('');

  // Load pending payrolls from API
  useEffect(() => {
    const loadPendingBatches = async () => {
      setIsLoading(true);
      try {
        const apiBatches = await ApprovalService.getPendingBatches();
        const transformedBatches = apiBatches
          .map(ApprovalService.transformBatchData)
          .filter(b => (b.debitAccount && String(b.debitAccount).trim() !== '') && (b.currency && String(b.currency).trim() !== ''));
        setPayrolls(transformedBatches);
        try {
          const employees = await getEmployees();
          setAllEmployees(Array.isArray(employees) ? employees : []);
        } catch (empErr) {
          console.error('Error loading employees:', empErr);
          setAllEmployees([]);
        }
      } catch (error) {
        console.error('Error loading pending batches:', error);
        // Fallback to empty array if API fails
        setPayrolls([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingBatches();
  }, []);

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedPayroll(null);
  };

  const handleAuthPrompt = (action, payrollId) => {
    setPendingAction({ action, payrollId });
    setShowAuthModal(true);
    setAuthPassword('');
    setAuthError('');
  };

  const handleAuthSubmit = () => {
    // Simple password check - in real app, this would be more secure
    const correctPassword = 'approver123';
    
    if (authPassword === correctPassword) {
      setShowAuthModal(false);
      setAuthError('');
      
      // Execute the pending action
      if (pendingAction.action === 'approve') {
        handleApprove(pendingAction.payrollId);
      } else if (pendingAction.action === 'reject') {
        handleReject(pendingAction.payrollId);
      }
      
      setPendingAction(null);
    } else {
      setAuthError('Invalid password. Please try again.');
    }
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
    setPendingAction(null);
    setAuthPassword('');
    setAuthError('');
  };

  const handleApprove = async (payrollId) => {
    setIsLoading(true);
    
    try {
      const item = payrolls.find(p => p.id === payrollId);
      const batchId = item?.batchId || item?.id;
      const approvalData = {
        action: 'approve',
        password: authPassword,
        comments: 'Approved by approver',
        approverName: 'Approver'
      };
      
      await ApprovalService.approveBatch(batchId, approvalData);
      
      // Remove from pending list
      setPayrolls(prevPayrolls => 
        prevPayrolls.filter(payroll => payroll.id !== payrollId)
      );
      
      // Close modal if open
      if (showDetailsModal) {
        handleCloseModal();
      }
      
      // Show success message
      alert('Payroll batch approved successfully!');
      try {
        window.dispatchEvent(new Event('approvals:updated'));
      } catch (_) {}
    } catch (error) {
      console.error('Error approving batch:', error);
      alert(`Error approving batch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (payrollId) => {
    setIsLoading(true);
    
    try {
      const item = payrolls.find(p => p.id === payrollId);
      const batchId = item?.batchId || item?.id;
      const approvalData = {
        action: 'reject',
        password: authPassword,
        comments: 'Rejected by approver',
        approverName: 'Approver'
      };
      
      await ApprovalService.rejectBatch(batchId, approvalData);
      
      // Remove from pending list
      setPayrolls(prevPayrolls => 
        prevPayrolls.filter(payroll => payroll.id !== payrollId)
      );
      
      // Close modal if open
      if (showDetailsModal) {
        handleCloseModal();
      }
      
      // Show success message
      alert('Payroll batch rejected successfully!');
      try {
        window.dispatchEvent(new Event('approvals:updated'));
      } catch (_) {}
    } catch (error) {
      console.error('Error rejecting batch:', error);
      alert(`Error rejecting batch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter only pending payrolls and apply search filter
  const pendingPayrolls = payrolls.filter(payroll => {
    const isPending = payroll.status === 'pending';
    const matchesSearch = searchId === '' || payroll.id.toLowerCase().includes(searchId.toLowerCase());
    return isPending && matchesSearch;
  }).sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)); // Sort by created date (oldest first)

  return (
    <div className="approver-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Payroll Approval Dashboard</h1>
          <p className="page-subtitle">
            Review and approve pending payroll batches
          </p>
        </div>

        {/* Statistics */}
        <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon pending"></div>
            <div className="stat-content">
              <div className="stat-value">{pendingPayrolls.length}</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
          </div>
              <div className="stat-card">
                <div className="stat-icon usd"></div>
            <div className="stat-content">
              <div className="stat-value">
                {pendingPayrolls
                  .filter(p => p.currency === 'USD')
                  .reduce((sum, p) => sum + p.totalAmount, 0)
                  .toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  })}
              </div>
              <div className="stat-label">USD Amount</div>
            </div>
          </div>
              <div className="stat-card">
                <div className="stat-icon inr"></div>
            <div className="stat-content">
              <div className="stat-value">
                {pendingPayrolls
                  .filter(p => p.currency === 'INR')
                  .reduce((sum, p) => sum + p.totalAmount, 0)
                  .toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0
                  })}
              </div>
              <div className="stat-label">INR Amount</div>
            </div>
          </div>
              <div className="stat-card">
                <div className="stat-icon employees"></div>
            <div className="stat-content">
              <div className="stat-value">
                {pendingPayrolls.reduce((sum, p) => sum + p.employeeCount, 0)}
              </div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-group">
                  <div className="search-icon"></div>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Batch ID (e.g., USD-2024-001, INR-2024-001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              {searchId && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchId('')}
                >
×
                </button>
              )}
            </div>
            <div className="search-info">
              {searchId ? (
                <span>Showing {pendingPayrolls.length} result{pendingPayrolls.length !== 1 ? 's' : ''} for "{searchId}"</span>
              ) : (
                <span>Search by batch ID to filter results</span>
              )}
            </div>
          </div>
        </div>

        {/* Payroll Cards */}
        <div className="payrolls-section">
          <div className="section-header">
            <h2 className="section-title">Pending Payroll Batches</h2>
            <div className="section-count">
              {pendingPayrolls.length} batch{pendingPayrolls.length !== 1 ? 'es' : ''} pending
            </div>
          </div>

          {pendingPayrolls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>All caught up!</h3>
              <p>No payroll batches are currently pending approval.</p>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '14px' }}>What would you like to do next?</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    className="btn btn-outline"
                    onClick={() => window.location.reload()}
                    style={{ fontSize: '14px' }}
                  >
                    🔄 Refresh Page
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      // Clear localStorage to reset demo data
                      localStorage.removeItem('approvals');
                      window.location.reload();
                    }}
                    style={{ fontSize: '14px' }}
                  >
                    🔄 Reset Demo Data
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/approvals'}
                    style={{ fontSize: '14px' }}
                  >
                    📋 View Reviewed Batches
                  </button>
                </div>
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '400px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>
                    <strong>Demo Tip:</strong> Click "Reset Demo Data" to restore all sample batches for testing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="payrolls-grid">
              {pendingPayrolls.map(payroll => (
                <PayrollCard
                  key={payroll.id}
                  payroll={payroll}
                  onViewDetails={handleViewDetails}
                  onApprove={(id) => handleAuthPrompt('approve', id)}
                  onReject={(id) => handleAuthPrompt('reject', id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && (
          <PayrollDetailsModal
            payroll={selectedPayroll}
            employees={allEmployees.filter(e => String(e.batchId || '') === String(selectedPayroll?.id || ''))}
            onClose={handleCloseModal}
            onApprove={(id) => handleAuthPrompt('approve', id)}
            onReject={(id) => handleAuthPrompt('reject', id)}
            isLoading={isLoading}
          />
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">Authentication Required</h3>
                <button className="modal-close" onClick={handleAuthCancel}>×</button>
              </div>
              <div className="modal-body">
                <p>Please enter your password to {pendingAction?.action} this payroll batch:</p>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                  />
                  {authError && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                      {authError}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  <strong>Demo Password:</strong> approver123
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={handleAuthCancel}>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleAuthSubmit}
                  disabled={!authPassword.trim()}
                >
                  {pendingAction?.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproverPage;
