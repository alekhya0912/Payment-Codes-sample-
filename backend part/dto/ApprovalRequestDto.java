package paymentinitiationbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ApprovalRequestDto {
    
    @Schema(description = "The action to perform on the batch", example = "approve", allowableValues = {"approve", "reject"})
    private String action;
    
    @Schema(description = "Password for authentication", example = "approver123")
    private String password;
    
    @Schema(description = "Comments or notes for the approval decision", example = "Approved after review")
    private String comments;
    
    @Schema(description = "Name of the approver", example = "John Doe")
    private String approverName;
    
    // Default constructor
    public ApprovalRequestDto() {}
    
    // Constructor
    public ApprovalRequestDto(String action, String password, String comments, String approverName) {
        this.action = action;
        this.password = password;
        this.comments = comments;
        this.approverName = approverName;
    }
    
    // Getters and Setters
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public String getApproverName() {
        return approverName;
    }
    
    public void setApproverName(String approverName) {
        this.approverName = approverName;
    }
}
