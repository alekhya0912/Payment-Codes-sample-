package paymentinitiationbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import paymentinitiationbackend.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    Optional<User> findByUserIdAndPassword(String userId, String password);
}
