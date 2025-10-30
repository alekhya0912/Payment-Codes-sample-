package paymentinitiationbackend.dto;
import java.math.BigDecimal;
public class EmployeeDto {
    private Long id;
    private String name;
    private BigDecimal salaryAmount;
    private String bankDetails;
    private String paymentRef;
    private String department;
    private String notes;
    private Long batchId; // Include batchId

    // Default Constructor
    public EmployeeDto() {}

    // Constructor to map from Entity
    public EmployeeDto(Long id, String name, BigDecimal salaryAmount, String bankDetails, String paymentRef, String department, String notes, Long batchId) {
        this.id = id;
        this.name = name;
        this.salaryAmount = salaryAmount;
        this.bankDetails = bankDetails;
        this.paymentRef = paymentRef;
        this.department = department;
        this.notes = notes;
        this.batchId = batchId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getSalaryAmount() { return salaryAmount; }
    public void setSalaryAmount(BigDecimal salaryAmount) { this.salaryAmount = salaryAmount; }
    public String getBankDetails() { return bankDetails; }
    public void setBankDetails(String bankDetails) { this.bankDetails = bankDetails; }
    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }
}
