package paymentinitiationbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

public class ApprovalStatisticsDto {
    
    @Schema(description = "Number of pending batches", example = "4")
    private long pendingCount;
    
    @Schema(description = "Number of approved batches", example = "1")
    private long approvedCount;
    
    @Schema(description = "Number of rejected batches", example = "1")
    private long rejectedCount;
    
    @Schema(description = "Total amount of pending batches", example = "130800.00")
    private BigDecimal totalPendingAmount;
    
    // Default constructor
    public ApprovalStatisticsDto() {}
    
    // Constructor
    public ApprovalStatisticsDto(long pendingCount, long approvedCount, long rejectedCount, BigDecimal totalPendingAmount) {
        this.pendingCount = pendingCount;
        this.approvedCount = approvedCount;
        this.rejectedCount = rejectedCount;
        this.totalPendingAmount = totalPendingAmount;
    }
    
    // Getters and Setters
    public long getPendingCount() {
        return pendingCount;
    }
    
    public void setPendingCount(long pendingCount) {
        this.pendingCount = pendingCount;
    }
    
    public long getApprovedCount() {
        return approvedCount;
    }
    
    public void setApprovedCount(long approvedCount) {
        this.approvedCount = approvedCount;
    }
    
    public long getRejectedCount() {
        return rejectedCount;
    }
    
    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }
    
    public BigDecimal getTotalPendingAmount() {
        return totalPendingAmount;
    }
    
    public void setTotalPendingAmount(BigDecimal totalPendingAmount) {
        this.totalPendingAmount = totalPendingAmount;
    }
}
