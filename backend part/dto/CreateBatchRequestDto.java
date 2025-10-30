package paymentinitiationbackend.dto;
public class CreateBatchRequestDto {
    private String name;
    public CreateBatchRequestDto() {
    }
    public CreateBatchRequestDto(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}