package paymentinitiationbackend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use Long for primary key

    @Column(nullable = false, unique = true, length = 100)
    private String accountNumber; // Renamed from 'number' for clarity

    @Column(length = 100)
    private String accountName; // Added a name/label for the account

    @Column(nullable = false, precision = 12, scale = 2) // Allow larger balance
    private BigDecimal balance;

    // --- Constructors ---
    public BankAccount() {
    }

    public BankAccount(String accountNumber, String accountName, BigDecimal balance) {
        this.accountNumber = accountNumber;
        this.accountName = accountName;
        this.balance = balance;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    // --- toString, equals, hashCode ---
    @Override
    public String toString() {
        return "BankAccount{" +
                "id=" + id +
                ", accountNumber='" + accountNumber + '\'' +
                ", accountName='" + accountName + '\'' +
                ", balance=" + balance +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BankAccount that = (BankAccount) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}