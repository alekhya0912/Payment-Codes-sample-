package paymentinitiationbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ApprovalBatchDto {
    
    @Schema(description = "Unique identifier for the batch", example = "1")
    private Long id;
    
    @Schema(description = "Name of the batch", example = "January 2024 Payroll")
    private String batchName;
    
    @Schema(description = "Name of the person who created the batch", example = "John Smith")
    private String createdBy;
    
    @Schema(description = "Date when the batch was created", example = "2024-01-15")
    private LocalDateTime createdDate;
    
    @Schema(description = "Current status of the batch", example = "pending", allowableValues = {"pending", "approved", "rejected"})
    private String status;
    
    @Schema(description = "Total amount for the batch", example = "125000.00")
    private BigDecimal totalAmount;
    
    @Schema(description = "Currency of the batch", example = "USD", allowableValues = {"USD", "INR"})
    private String currency;
    
    @Schema(description = "Number of employees in the batch", example = "15")
    private int employeeCount;
    
    @Schema(description = "Number of approvers required", example = "2")
    private int approversRequired;
    
    @Schema(description = "Number of approvers assigned", example = "1")
    private int approversAssigned;
    
    @Schema(description = "Debit account for the batch", example = "ACC-001-USD")
    private String debitAccount;
    
    @Schema(description = "Description of the batch", example = "Monthly payroll for January 2024")
    private String description;
    
    @Schema(description = "Name of the approver", example = "Jane Doe")
    private String approvedBy;
    
    @Schema(description = "Date when the batch was approved/rejected", example = "2024-01-16")
    private LocalDateTime approvedDate;
    
    @Schema(description = "Comments from the approver", example = "Approved after review")
    private String approvalComments;
    
    // Default constructor
    public ApprovalBatchDto() {}
    
    // Constructor
    public ApprovalBatchDto(Long id, String batchName, String createdBy, LocalDateTime createdDate, 
                           String status, BigDecimal totalAmount, String currency, int employeeCount,
                           int approversRequired, int approversAssigned, String debitAccount, 
                           String description, String approvedBy, LocalDateTime approvedDate, 
                           String approvalComments) {
        this.id = id;
        this.batchName = batchName;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.employeeCount = employeeCount;
        this.approversRequired = approversRequired;
        this.approversAssigned = approversAssigned;
        this.debitAccount = debitAccount;
        this.description = description;
        this.approvedBy = approvedBy;
        this.approvedDate = approvedDate;
        this.approvalComments = approvalComments;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBatchName() {
        return batchName;
    }
    
    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public int getEmployeeCount() {
        return employeeCount;
    }
    
    public void setEmployeeCount(int employeeCount) {
        this.employeeCount = employeeCount;
    }
    
    public int getApproversRequired() {
        return approversRequired;
    }
    
    public void setApproversRequired(int approversRequired) {
        this.approversRequired = approversRequired;
    }
    
    public int getApproversAssigned() {
        return approversAssigned;
    }
    
    public void setApproversAssigned(int approversAssigned) {
        this.approversAssigned = approversAssigned;
    }
    
    public String getDebitAccount() {
        return debitAccount;
    }
    
    public void setDebitAccount(String debitAccount) {
        this.debitAccount = debitAccount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }
    
    public void setApprovedDate(LocalDateTime approvedDate) {
        this.approvedDate = approvedDate;
    }
    
    public String getApprovalComments() {
        return approvalComments;
    }
    
    public void setApprovalComments(String approvalComments) {
        this.approvalComments = approvalComments;
    }
}
