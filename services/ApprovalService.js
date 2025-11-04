// ✅ ApprovalService.js
// Handles all approval-related API calls with JWT token automatically attached

import { apiFetch } from "./api"; // make sure path is correct (e.g., './api')

class ApprovalService {
  
  // ------------------ Get all pending batches ------------------
  static async getPendingBatches() {
    try {
      const [approvalsRes, batchesRes, employeesRes] = await Promise.all([
        apiFetch("/api/approvals/pending", { method: "GET" }),
        apiFetch("/api/batches", { method: "GET" }),
        apiFetch("/api/employees", { method: "GET" })
      ]);

      if (!approvalsRes.ok || !batchesRes.ok || !employeesRes.ok) {
        throw new Error(`Error fetching pending data`);
      }

      const approvalsJson = await approvalsRes.json();
      const batchesJson = await batchesRes.json();
      const employeesJson = await employeesRes.json();

      // Calculate totals by batchId
      const totalsByBatchId = new Map();
      if (Array.isArray(employeesJson)) {
        for (const emp of employeesJson) {
          const batchId = emp.batchId != null ? String(emp.batchId) : null;
          if (!batchId) continue;
          const amt = typeof emp.salaryAmount === "number"
            ? emp.salaryAmount
            : parseFloat(emp.salaryAmount || 0) || 0;
          totalsByBatchId.set(batchId, (totalsByBatchId.get(batchId) || 0) + amt);
        }
      }

      const approvalItems = (Array.isArray(approvalsJson) ? approvalsJson : [])
        .filter(a => a && String(a.debitAccount || "").trim() && String(a.currency || "").trim())
        .map(a => ({ ...a, approvalBatchId: a.id, batchId: a.batchId || null }));

      const mappedFromBatches = (Array.isArray(batchesJson) ? batchesJson : [])
        .filter(b => (b.paymentStatus || "").toLowerCase() === "pending")
        .filter(b => String(b.debitAccount || "").trim() && String(b.currency || "").trim())
        .map(b => {
          const mapped = ApprovalService.transformFromBatchDto(b);
          const total = totalsByBatchId.get(mapped.id) || 0;
          mapped.totalAmount = total;
          return { ...mapped, approvalBatchId: null, batchId: b.id };
        });

      const byId = new Map();
      for (const a of approvalItems) byId.set(String(a.id), a);
      for (const b of mappedFromBatches) {
        const key = String(b.id);
        if (!byId.has(key)) byId.set(key, b);
      }

      return Array.from(byId.values())
        .filter(i => String(i.debitAccount || "").trim() && String(i.currency || "").trim());
    } catch (error) {
      console.error("Error fetching pending batches:", error);
      throw error;
    }
  }

  // ------------------ Get all reviewed batches ------------------
  static async getReviewedBatches() {
    try {
      const [batchesRes, employeesRes] = await Promise.all([
        apiFetch("/api/batches", { method: "GET" }),
        apiFetch("/api/employees", { method: "GET" })
      ]);
      if (!batchesRes.ok || !employeesRes.ok) throw new Error("Error fetching reviewed data");
      
      const batches = await batchesRes.json();
      const employees = await employeesRes.json();
      
      const totalsByBatchId = new Map();
      for (const emp of Array.isArray(employees) ? employees : []) {
        const k = emp.batchId != null ? String(emp.batchId) : null;
        if (!k) continue;
        const amt = typeof emp.salaryAmount === "number"
          ? emp.salaryAmount
          : parseFloat(emp.salaryAmount || 0) || 0;
        totalsByBatchId.set(k, (totalsByBatchId.get(k) || 0) + amt);
      }

      const reviewed = (Array.isArray(batches) ? batches : [])
        .filter(b => ["approved", "rejected"].includes(String(b.paymentStatus || "").toLowerCase()))
        .map(b => {
          const mapped = ApprovalService.transformFromBatchDto(b);
          mapped.totalAmount = totalsByBatchId.get(mapped.id) || 0;
          mapped.status = String(b.paymentStatus || "").toLowerCase();
          return mapped;
        });

      return reviewed;
    } catch (error) {
      console.error("Error fetching reviewed batches:", error);
      throw error;
    }
  }

  // ------------------ Get specific pending batch by ID ------------------
  static async getPendingBatchById(id) {
    try {
      const response = await apiFetch(`/api/approvals/pending/${id}`, { method: "GET" });
      if (!response.ok) throw new Error(`Error fetching pending batch: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching pending batch:", error);
      throw error;
    }
  }

  // ------------------ Approve batch ------------------
  static async approveBatch(id, approvalData) {
    try {
      const response = await apiFetch(`/api/approvals/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify(approvalData)
      });
      if (!response.ok) throw new Error(`Error approving batch: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error approving batch:", error);
      throw error;
    }
  }

  // ------------------ Reject batch ------------------
  static async rejectBatch(id, approvalData) {
    try {
      const response = await apiFetch(`/api/approvals/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify(approvalData)
      });
      if (!response.ok) throw new Error(`Error rejecting batch: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error rejecting batch:", error);
      throw error;
    }
  }

  // ------------------ Create approval batch ------------------
  static async createApprovalBatch(batchId, payload) {
    const response = await apiFetch(`/api/approval-batches/create/${batchId}`, {
      method: "POST",
      body: JSON.stringify(payload || {})
    });
    if (!response.ok) throw new Error(`Error creating approval batch: ${response.status}`);
    return await response.json();
  }

  // ------------------ Get approval statistics ------------------
  static async getApprovalStatistics() {
    try {
      const response = await apiFetch("/api/approvals/statistics", { method: "GET" });
      if (!response.ok) throw new Error(`Error fetching approval stats: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching approval statistics:", error);
      throw error;
    }
  }

  // ------------------ Helpers ------------------
  static transformBatchData(apiBatch) {
    return {
      id: apiBatch?.id != null ? String(apiBatch.id) : "",
      batchName: apiBatch.batchName,
      createdBy: apiBatch.createdBy,
      createdDate: apiBatch.createdDate ? apiBatch.createdDate.split("T")[0] : new Date().toISOString().split("T")[0],
      status: apiBatch.status,
      totalAmount: apiBatch.totalAmount != null ? parseFloat(apiBatch.totalAmount) : 0,
      currency: apiBatch.currency,
      employeeCount: apiBatch.employeeCount,
      approversRequired: apiBatch.approversRequired,
      approversAssigned: apiBatch.approversAssigned,
      debitAccount: apiBatch.debitAccount,
      description: apiBatch.description,
      approvedBy: apiBatch.approvedBy,
      approvedDate: apiBatch.approvedDate ? apiBatch.approvedDate.split("T")[0] : null,
      approvalComments: apiBatch.approvalComments,
      approvalBatchId: apiBatch.approvalBatchId || null,
      batchId: apiBatch.batchId || null
    };
  }

  static transformFromBatchDto(batchDto) {
    const paymentStatus = (batchDto.paymentStatus || "").toLowerCase();
    return {
      id: batchDto.id != null ? batchDto.id.toString() : "",
      batchName: batchDto.name || "",
      createdBy: batchDto.userId ?? batchDto.createdBy??'Unknown',
      createdDate: batchDto.lastPaymentDate
        ? String(batchDto.lastPaymentDate).split("T")[0]
        : new Date().toISOString().split("T")[0],
      status: paymentStatus || "pending",
      totalAmount: 0,
      currency: batchDto.currency || "USD",
      employeeCount: typeof batchDto.employeeCount === "number" ? batchDto.employeeCount : 0,
      approversRequired: 1,
      approversAssigned: 0,
      debitAccount: batchDto.debitAccount || "",
      description: "",
      approvedBy: "",
      approvedDate: null,
      approvalComments: ""
    };
  }
}

export default ApprovalService;
