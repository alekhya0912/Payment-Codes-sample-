package paymentinitiationbackend.dto;
import java.time.LocalDateTime;

public class BatchDto {
    private Long id;
    private String name;
    private int paymentCount;
    private LocalDateTime lastPaymentDate;
    private String paymentStatus;
    private long employeeCount;
    // --- NEW FIELDS ---
    private String debitAccount;
    private String currency;
    // --- END NEW FIELDS ---

    public BatchDto() {}

    // --- MODIFIED CONSTRUCTOR ---
    public BatchDto(Long id, String name, int paymentCount, LocalDateTime lastPaymentDate, String paymentStatus, long employeeCount, String debitAccount, String currency) {
        this.id = id;
        this.name = name;
        this.paymentCount = paymentCount;
        this.lastPaymentDate = lastPaymentDate;
        this.paymentStatus = paymentStatus;
        this.employeeCount = employeeCount;
        this.debitAccount = debitAccount;
        this.currency = currency;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getPaymentCount() { return paymentCount; }
    public void setPaymentCount(int paymentCount) { this.paymentCount = paymentCount; }
    public LocalDateTime getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDateTime lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(long employeeCount) { this.employeeCount = employeeCount; }

    // --- NEW GETTERS AND SETTERS ---
    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    // --- END NEW GETTERS AND SETTERS ---
}
