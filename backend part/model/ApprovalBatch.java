package paymentinitiationbackend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval_batches")
public class ApprovalBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "batch_name", nullable = false, length = 100)
    private String batchName;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "approval_status", length = 20)
    private String approvalStatus = "pending";

    @Column(name = "total_amount", precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "employee_count")
    private Integer employeeCount = 0;

    @Column(name = "approvers_required")
    private Integer approversRequired = 1;

    @Column(name = "approvers_assigned")
    private Integer approversAssigned = 0;

    @Column(name = "debit_account", length = 50)
    private String debitAccount;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "approval_comments", length = 1000)
    private String approvalComments;

    // Constructors
    public ApprovalBatch() {
    }

    public ApprovalBatch(Long batchId, String batchName, String createdBy, LocalDateTime createdDate,
                        String approvalStatus, BigDecimal totalAmount, String currency,
                        Integer employeeCount, String debitAccount, String description) {
        this.batchId = batchId;
        this.batchName = batchName;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.approvalStatus = approvalStatus;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.employeeCount = employeeCount;
        this.debitAccount = debitAccount;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBatchId() {
        return batchId;
    }

    public void setBatchId(Long batchId) {
        this.batchId = batchId;
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

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
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

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
    }

    public Integer getApproversRequired() {
        return approversRequired;
    }

    public void setApproversRequired(Integer approversRequired) {
        this.approversRequired = approversRequired;
    }

    public Integer getApproversAssigned() {
        return approversAssigned;
    }

    public void setApproversAssigned(Integer approversAssigned) {
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

    @Override
    public String toString() {
        return "ApprovalBatch{" +
                "id=" + id +
                ", batchId=" + batchId +
                ", batchName='" + batchName + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", createdDate=" + createdDate +
                ", approvalStatus='" + approvalStatus + '\'' +
                ", totalAmount=" + totalAmount +
                ", currency='" + currency + '\'' +
                ", employeeCount=" + employeeCount +
                ", approversRequired=" + approversRequired +
                ", approversAssigned=" + approversAssigned +
                ", debitAccount='" + debitAccount + '\'' +
                ", description='" + description + '\'' +
                ", approvedBy='" + approvedBy + '\'' +
                ", approvedDate=" + approvedDate +
                ", approvalComments='" + approvalComments + '\'' +
                '}';
    }
}
