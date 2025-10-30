// Service for handling approval-related API calls
const API_BASE_URL = 'http://localhost:8080/api';

class ApprovalService {
  
  // Get all pending batches
  static async getPendingBatches() {
    try {
      // Fetch approvals, batches, and employees to compute totals and fill gaps
      const [approvalsRes, batchesRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/approvals/pending`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`${API_BASE_URL}/batches`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`${API_BASE_URL}/employees`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      ]);

      if (!approvalsRes.ok) {
        throw new Error(`HTTP error! status: ${approvalsRes.status}`);
      }
      if (!batchesRes.ok) {
        throw new Error(`HTTP error! status: ${batchesRes.status}`);
      }
      if (!employeesRes.ok) {
        throw new Error(`HTTP error! status: ${employeesRes.status}`);
      }

      const approvalsJson = await approvalsRes.json();
      const batchesJson = await batchesRes.json();
      const employeesJson = await employeesRes.json();

      // Build totals by batchId from employees
      const totalsByBatchId = new Map();
      if (Array.isArray(employeesJson)) {
        for (const emp of employeesJson) {
          const batchId = emp.batchId != null ? String(emp.batchId) : null;
          if (!batchId) continue;
          const amt = typeof emp.salaryAmount === 'number' ? emp.salaryAmount : parseFloat(emp.salaryAmount || 0) || 0;
          totalsByBatchId.set(batchId, (totalsByBatchId.get(batchId) || 0) + amt);
        }
      }

      // Approvals already come as ApprovalBatchDto; keep only those with debitAccount & currency
      const approvalItems = (Array.isArray(approvalsJson) ? approvalsJson : [])
        .filter(a => a && String(a.debitAccount || '').trim() && String(a.currency || '').trim())
        .map(a => ({ ...a, approvalBatchId: a.id, batchId: a.batchId || null }));

      // Map payment-initiated batches (must be pending and have debitAccount & currency)
      const mappedFromBatches = (Array.isArray(batchesJson) ? batchesJson : [])
        .filter(b => (b.paymentStatus || '').toLowerCase() === 'pending')
        .filter(b => String(b.debitAccount || '').trim() && String(b.currency || '').trim())
        .map(b => {
          const mapped = ApprovalService.transformFromBatchDto(b);
          const total = totalsByBatchId.get(mapped.id) || 0;
          mapped.totalAmount = total;
          return { ...mapped, approvalBatchId: null, batchId: b.id };
        });

      // Merge by id, prefer approvalItems
      const byId = new Map();
      for (const a of approvalItems) {
        const key = String(a.id);
        byId.set(key, a);
      }
      for (const b of mappedFromBatches) {
        const key = String(b.id);
        if (!byId.has(key)) byId.set(key, b);
      }

      // Return only initiated (have debitAccount and currency)
      return Array.from(byId.values())
        .filter(i => String(i.debitAccount || '').trim() && String(i.currency || '').trim());
    } catch (error) {
      console.error('Error fetching pending batches:', error);
      throw error;
    }
  }

  // Get all reviewed batches (approved/rejected) from PayrollPayments only
  static async getReviewedBatches() {
    try {
      const [batchesRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/batches`, { headers: { 'Content-Type': 'application/json' } }),
        fetch(`${API_BASE_URL}/employees`, { headers: { 'Content-Type': 'application/json' } })
      ]);
      if (!batchesRes.ok) throw new Error(`HTTP error! status: ${batchesRes.status}`);
      if (!employeesRes.ok) throw new Error(`HTTP error! status: ${employeesRes.status}`);
      const batches = await batchesRes.json();
      const employees = await employeesRes.json();
      const totalsByBatchId = new Map();
      for (const emp of Array.isArray(employees) ? employees : []) {
        const k = emp.batchId != null ? String(emp.batchId) : null; if (!k) continue;
        const amt = typeof emp.salaryAmount === 'number' ? emp.salaryAmount : parseFloat(emp.salaryAmount || 0) || 0;
        totalsByBatchId.set(k, (totalsByBatchId.get(k) || 0) + amt);
      }
      const reviewed = (Array.isArray(batches) ? batches : [])
        .filter(b => ['approved','rejected'].includes(String(b.paymentStatus||'').toLowerCase()))
        .map(b => {
          const mapped = ApprovalService.transformFromBatchDto(b);
          mapped.totalAmount = totalsByBatchId.get(mapped.id) || 0;
          mapped.status = String(b.paymentStatus||'').toLowerCase();
          return mapped;
        });
      return reviewed;
    } catch (error) {
      console.error('Error fetching reviewed batches:', error);
      throw error;
    }
  }

  // Get a specific pending batch by ID
  static async getPendingBatchById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/pending/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending batch:', error);
      throw error;
    }
  }

  // Approve a batch
  static async approveBatch(id, approvalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your password.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error approving batch:', error);
      throw error;
    }
  }

  // Reject a batch
  static async rejectBatch(id, approvalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your password.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting batch:', error);
      throw error;
    }
  }

  // Create approval batch from a batchId
  static async createApprovalBatch(batchId, payload) {
    const response = await fetch(`${API_BASE_URL}/approval-batches/create/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Get approval statistics
  static async getApprovalStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/approvals/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching approval statistics:', error);
      throw error;
    }
  }

  // Helper method to transform API data to match frontend format
  static transformBatchData(apiBatch) {
    return {
      id: apiBatch?.id != null ? String(apiBatch.id) : '',
      batchName: apiBatch.batchName,
      createdBy: apiBatch.createdBy,
      createdDate: apiBatch.createdDate ? apiBatch.createdDate.split('T')[0] : new Date().toISOString().split('T')[0],
      status: apiBatch.status,
      totalAmount: apiBatch.totalAmount != null ? parseFloat(apiBatch.totalAmount) : 0,
      currency: apiBatch.currency,
      employeeCount: apiBatch.employeeCount,
      approversRequired: apiBatch.approversRequired,
      approversAssigned: apiBatch.approversAssigned,
      debitAccount: apiBatch.debitAccount,
      description: apiBatch.description,
      approvedBy: apiBatch.approvedBy,
      approvedDate: apiBatch.approvedDate ? apiBatch.approvedDate.split('T')[0] : null,
      approvalComments: apiBatch.approvalComments,
      // carry through metadata if present
      approvalBatchId: apiBatch.approvalBatchId != null ? apiBatch.approvalBatchId : null,
      batchId: apiBatch.batchId != null ? apiBatch.batchId : null
    };
  }

  // Map backend BatchDto (from /api/batches) to Approval-like shape expected in UI
  // Missing fields are rendered as empty/defaults per user request
  static transformFromBatchDto(batchDto) {
    const paymentStatus = (batchDto.paymentStatus || '').toLowerCase();
    return {
      id: batchDto.id != null ? batchDto.id.toString() : '',
      batchName: batchDto.name || '',
      createdBy: 'Unknown',
      createdDate: batchDto.lastPaymentDate ? String(batchDto.lastPaymentDate).split('T')[0] : new Date().toISOString().split('T')[0],
      status: paymentStatus || 'pending',
      totalAmount: 0,
      currency: batchDto.currency || 'USD',
      employeeCount: typeof batchDto.employeeCount === 'number' ? batchDto.employeeCount : 0,
      approversRequired: 1,
      approversAssigned: 0,
      debitAccount: batchDto.debitAccount || '',
      description: '',
      approvedBy: '',
      approvedDate: null,
      approvalComments: ''
    };
  }
}

export default ApprovalService;
