package paymentinitiationbackend.dto;
import java.util.List;

public class BatchDetailsView extends BatchCardView{
    private List<TransactionRow> transactions;

    public List<TransactionRow> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionRow> transactions) {
        this.transactions = transactions;
    }


}
