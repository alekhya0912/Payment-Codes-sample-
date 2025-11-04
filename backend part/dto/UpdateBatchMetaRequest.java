package paymentinitiationbackend.dto;

public class UpdateBatchMetaRequest{
    public String name;
    public String debitAccount;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDebitAccount() {
        return debitAccount;
    }

    public void setDebitAccount(String debitAccount) {
        this.debitAccount = debitAccount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String currency;
}
