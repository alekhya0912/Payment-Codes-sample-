package paymentinitiationbackend.dto;
public class PaymentDetailsDto {
    private String debitAccount;
    private String payrollType;
    private String currency;
    // batchId will come from the path parameter

    // Default Constructor
    public PaymentDetailsDto() {}

    // Constructor
    public PaymentDetailsDto(String debitAccount, String payrollType, String currency) {
        this.debitAccount = debitAccount;
        this.payrollType = payrollType;
        this.currency = currency;
    }

    // Getters and Setters
    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }
    public String getPayrollType() { return payrollType; }
    public void setPayrollType(String payrollType) { this.payrollType = payrollType; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
