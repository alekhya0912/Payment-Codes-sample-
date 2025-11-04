package paymentinitiationbackend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payroll_batches")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "payment_count")
    private int paymentCount = 0;

    @Column(name = "last_payment_date")
    private LocalDateTime lastPaymentDate;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "Pending";

    @Column(name = "debit_account", length = 100)
    private String debitAccount;

    @Column(name = "currency", length = 10)
    private String currency;

    // --- NEW FIELD ---
    @Column(name = "user_id", length = 50)
    private String userId;
    // --- END NEW FIELD ---

    @OneToMany(mappedBy = "batch", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();

    // --- Constructors ---
    public Batch() {
    }

    public Batch(String name) {
        this.name = name;
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
    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    // --- NEW GETTER AND SETTER ---
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    // --- END NEW GETTER AND SETTER ---


    // --- Convenience Methods ---
    public void addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setBatch(this);
    }
    public void removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setBatch(null);
    }

    // --- toString, equals, hashCode ---
    @Override
    public String toString() {
        return "Batch{" + "id=" + id + ", name='" + name + '\'' + ", paymentCount=" + paymentCount + ", lastPaymentDate=" + lastPaymentDate + ", paymentStatus='" + paymentStatus + '\'' + ", debitAccount='" + debitAccount + '\'' + ", currency='" + currency + '\'' + ", userId='" + userId + '\'' + '}';
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Batch batch = (Batch) o;
        return id != null && id.equals(batch.id);
    }
    @Override
    public int hashCode() { return getClass().hashCode(); }
}
