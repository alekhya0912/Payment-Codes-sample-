package paymentinitiationbackend.dto;
public class PaymentDetailsDto {
    private String debitAccount;
    private String payrollType;
    private String currency;
    private String userId;
    public PaymentDetailsDto() {}
    public PaymentDetailsDto(String debitAccount, String payrollType, String currency, String userId) {
        this.debitAccount = debitAccount;
        this.payrollType = payrollType;
        this.currency = currency;
        this.userId = userId;
    }
    public String getDebitAccount() { return debitAccount; }
    public void setDebitAccount(String debitAccount) { this.debitAccount = debitAccount; }
    public String getPayrollType() { return payrollType; }
    public void setPayrollType(String payrollType) { this.payrollType = payrollType; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
