package paymentinitiationbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import paymentinitiationbackend.dto.ApprovalBatchDto;
import paymentinitiationbackend.dto.ApprovalRequestDto;
import paymentinitiationbackend.dto.ApprovalStatisticsDto;
import paymentinitiationbackend.model.ApprovalBatch;
import paymentinitiationbackend.model.Batch;
import paymentinitiationbackend.model.Employee;
import paymentinitiationbackend.repository.ApprovalBatchRepository;
import paymentinitiationbackend.repository.BatchRepository;
import paymentinitiationbackend.repository.EmployeeRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApprovalService {

    private final ApprovalBatchRepository approvalBatchRepository;
    private final BatchRepository batchRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public ApprovalService(ApprovalBatchRepository approvalBatchRepository,
                          BatchRepository batchRepository,
                          EmployeeRepository employeeRepository) {
        this.approvalBatchRepository = approvalBatchRepository;
        this.batchRepository = batchRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all pending approval batches
     */
    public List<ApprovalBatchDto> getPendingBatches() {
        List<ApprovalBatch> pendingBatches = approvalBatchRepository.findByApprovalStatus("pending");
        return pendingBatches.stream()
                .map(this::convertToApprovalBatchDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all reviewed approval batches (approved or rejected)
     */
    public List<ApprovalBatchDto> getReviewedBatches() {
        List<ApprovalBatch> reviewedBatches = approvalBatchRepository.findReviewedBatches();
        return reviewedBatches.stream()
                .map(this::convertToApprovalBatchDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific pending batch by ID
     */
    public Optional<ApprovalBatchDto> getPendingBatchById(Long id) {
        return approvalBatchRepository.findById(id)
                .filter(batch -> "pending".equals(batch.getApprovalStatus()))
                .map(this::convertToApprovalBatchDto);
    }

    /**
     * Approve a batch
     */
    public ApprovalBatchDto approveBatch(Long id, ApprovalRequestDto approvalRequest) {
        ApprovalBatch approvalBatch = approvalBatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval batch not found with id: " + id));

        if (!"pending".equals(approvalBatch.getApprovalStatus())) {
            throw new RuntimeException("Batch is not pending approval");
        }

        // Update approval batch
        approvalBatch.setApprovalStatus("approved");
        approvalBatch.setApprovedBy(approvalRequest.getApproverName());
        approvalBatch.setApprovedDate(LocalDateTime.now());
        approvalBatch.setApprovalComments(approvalRequest.getComments());

        ApprovalBatch updatedBatch = approvalBatchRepository.save(approvalBatch);

        // Update the original batch status if it exists
        updateOriginalBatchStatus(approvalBatch.getBatchId(), "approved");

        return convertToApprovalBatchDto(updatedBatch);
    }

    /**
     * Reject a batch
     */
    public ApprovalBatchDto rejectBatch(Long id, ApprovalRequestDto approvalRequest) {
        ApprovalBatch approvalBatch = approvalBatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval batch not found with id: " + id));

        if (!"pending".equals(approvalBatch.getApprovalStatus())) {
            throw new RuntimeException("Batch is not pending approval");
        }

        // Update approval batch
        approvalBatch.setApprovalStatus("rejected");
        approvalBatch.setApprovedBy(approvalRequest.getApproverName());
        approvalBatch.setApprovedDate(LocalDateTime.now());
        approvalBatch.setApprovalComments(approvalRequest.getComments());

        ApprovalBatch updatedBatch = approvalBatchRepository.save(approvalBatch);

        // Update the original batch status if it exists
        updateOriginalBatchStatus(approvalBatch.getBatchId(), "rejected");

        return convertToApprovalBatchDto(updatedBatch);
    }

    /**
     * Get approval statistics
     */
    public ApprovalStatisticsDto getApprovalStatistics() {
        long pendingCount = approvalBatchRepository.countByApprovalStatus("pending");
        long approvedCount = approvalBatchRepository.countByApprovalStatus("approved");
        long rejectedCount = approvalBatchRepository.countByApprovalStatus("rejected");

        // Calculate total pending amount
        List<ApprovalBatch> pendingBatches = approvalBatchRepository.findByApprovalStatus("pending");
        BigDecimal totalPendingAmount = pendingBatches.stream()
                .filter(batch -> batch.getTotalAmount() != null)
                .map(ApprovalBatch::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ApprovalStatisticsDto(pendingCount, approvedCount, rejectedCount, totalPendingAmount);
    }

    /**
     * Create an approval batch from a regular batch
     */
    public ApprovalBatchDto createApprovalBatch(Long batchId, String debitAccount, String description) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + batchId));

        // Check if approval batch already exists
        if (approvalBatchRepository.existsByBatchId(batchId)) {
            throw new RuntimeException("Approval batch already exists for batch id: " + batchId);
        }

        // Get employees for the batch
        List<Employee> employees = employeeRepository.findByBatchId(batchId);
        if (employees.isEmpty()) {
            throw new RuntimeException("Cannot create approval batch: Batch has no assigned employees");
        }

        // Calculate total amount
        BigDecimal totalAmount = employees.stream()
                .map(emp -> emp.getSalaryAmount() != null ? emp.getSalaryAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Determine currency (default to USD if not specified)
        String currency = "USD"; // You can add currency field to Batch model later

        // Calculate approvers required
        int approversRequired = calculateApproversRequired(totalAmount, currency);

        // Create approval batch
        ApprovalBatch approvalBatch = new ApprovalBatch(
                batchId,
                batch.getName(),
                "System", // Default created by
                LocalDateTime.now(),
                "pending",
                totalAmount,
                currency,
                employees.size(),
                debitAccount,
                description
        );

        approvalBatch.setApproversRequired(approversRequired);
        approvalBatch.setApproversAssigned(0);

        ApprovalBatch savedBatch = approvalBatchRepository.save(approvalBatch);
        return convertToApprovalBatchDto(savedBatch);
    }

    /**
     * Update the original batch status
     */
    private void updateOriginalBatchStatus(Long batchId, String status) {
        try {
            Batch originalBatch = batchRepository.findById(batchId).orElse(null);
            if (originalBatch != null) {
                // Map approval status to payment status
                String paymentStatus = "approved".equals(status) ? "Approved" : "Rejected";
                originalBatch.setPaymentStatus(paymentStatus);
                batchRepository.save(originalBatch);
            }
        } catch (Exception e) {
            // Log error but don't fail the approval process
            System.err.println("Failed to update original batch status: " + e.getMessage());
        }
    }

    /**
     * Calculate number of approvers required based on amount and currency
     */
    private int calculateApproversRequired(BigDecimal amount, String currency) {
        if (amount == null) return 1;

        if ("USD".equals(currency)) {
            // USD: Above $1,127 requires 2 approvers
            return amount.compareTo(new BigDecimal("1127")) > 0 ? 2 : 1;
        } else if ("INR".equals(currency)) {
            // INR: Above ₹1,00,000 requires 2 approvers
            return amount.compareTo(new BigDecimal("100000")) > 0 ? 2 : 1;
        }

        return 1; // Default to 1 approver
    }

    /**
     * Convert ApprovalBatch entity to DTO
     */
    private ApprovalBatchDto convertToApprovalBatchDto(ApprovalBatch approvalBatch) {
        return new ApprovalBatchDto(
                approvalBatch.getId(),
                approvalBatch.getBatchName(),
                approvalBatch.getCreatedBy() != null ? approvalBatch.getCreatedBy() : "Unknown",
                approvalBatch.getCreatedDate() != null ? approvalBatch.getCreatedDate() : LocalDateTime.now(),
                approvalBatch.getApprovalStatus(),
                approvalBatch.getTotalAmount(),
                approvalBatch.getCurrency() != null ? approvalBatch.getCurrency() : "USD",
                approvalBatch.getEmployeeCount() != null ? approvalBatch.getEmployeeCount() : 0,
                approvalBatch.getApproversRequired() != null ? approvalBatch.getApproversRequired() : 1,
                approvalBatch.getApproversAssigned() != null ? approvalBatch.getApproversAssigned() : 0,
                approvalBatch.getDebitAccount(),
                approvalBatch.getDescription(),
                approvalBatch.getApprovedBy(),
                approvalBatch.getApprovedDate(),
                approvalBatch.getApprovalComments()
        );
    }
}
