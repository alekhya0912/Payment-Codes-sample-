package paymentinitiationbackend.dto;
import java.math.BigDecimal;
public class BankAccountDto {
    // Keep id as Long to match entity ID
    private Long id;
    private String accountNumber;
    private String accountName; // Added field
    private BigDecimal balance;

    // Default Constructor
    public BankAccountDto() {}

    // Constructor
    public BankAccountDto(Long id, String accountNumber, String accountName, BigDecimal balance) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.accountName = accountName;
        this.balance = balance;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}