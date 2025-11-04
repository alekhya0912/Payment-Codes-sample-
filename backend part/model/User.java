package paymentinitiationbackend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String groupId;
    private String mobileNumber;
    private String securityQuestion;
    private String securityAnswer;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public User() {}

    public User(String userId, String groupId, String mobileNumber,
                String securityQuestion, String securityAnswer, String password) {
        this.userId = userId;
        this.groupId = groupId;
        this.mobileNumber = mobileNumber;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
        this.password = password;
    }

    // Getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getSecurityQuestion() { return securityQuestion; }
    public void setSecurityQuestion(String securityQuestion) { this.securityQuestion = securityQuestion; }
    public String getSecurityAnswer() { return securityAnswer; }
    public void setSecurityAnswer(String securityAnswer) { this.securityAnswer = securityAnswer; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
