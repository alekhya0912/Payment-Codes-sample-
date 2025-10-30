package paymentinitiationbackend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // Use BigDecimal for currency to avoid floating-point issues
    @Column(name = "salary_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal salaryAmount;

    @Column(name = "bank_details", nullable = false, length = 100)
    private String bankDetails;

    @Column(name = "payment_ref", length = 50)
    private String paymentRef;

    @Column(name = "department", length = 50)
    private String department;

    @Column(length = 255) // Text notes can be longer
    private String notes;

    // --- Relationship ---
    // Many employees can belong to one batch
    // FetchType.LAZY is preferred here
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id") // Name of the foreign key column in the employees table
    private Batch batch; // This field owns the relationship

    // --- Constructors ---
    public Employee() {
    }

    public Employee(String name, BigDecimal salaryAmount, String bankDetails, String paymentRef, String department, String notes) {
        this.name = name;
        this.salaryAmount = salaryAmount;
        this.bankDetails = bankDetails;
        this.paymentRef = paymentRef;
        this.department = department;
        this.notes = notes;
    }


    // --- Getters and Setters (NO Lombok) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getSalaryAmount() {
        return salaryAmount;
    }

    public void setSalaryAmount(BigDecimal salaryAmount) {
        this.salaryAmount = salaryAmount;
    }

    public String getBankDetails() {
        return bankDetails;
    }

    public void setBankDetails(String bankDetails) {
        this.bankDetails = bankDetails;
    }

    public String getPaymentRef() {
        return paymentRef;
    }

    public void setPaymentRef(String paymentRef) {
        this.paymentRef = paymentRef;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Batch getBatch() {
        return batch;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    // --- toString, equals, hashCode (Optional but good practice) ---
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", salaryAmount=" + salaryAmount +
                ", bankDetails='" + bankDetails + '\'' +
                ", paymentRef='" + paymentRef + '\'' +
                ", yourRef='" + department + '\'' +
                ", notes='" + notes + '\'' +
                ", batchId=" + (batch != null ? batch.getId() : "null") + // Avoid recursion
                '}';
    }

    // Basic equals/hashCode based on ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return id != null && id.equals(employee.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}