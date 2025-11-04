package paymentinitiationbackend.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import paymentinitiationbackend.config.JwtTokenUtil;
import paymentinitiationbackend.dto.LoginRequest;
import paymentinitiationbackend.dto.VerifySecurityRequest;
import paymentinitiationbackend.model.User;
import paymentinitiationbackend.repository.UserRepository;


import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtTokenUtil jwtTokenUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        Optional<User> existing = userRepository.findByUserId(user.getUserId());
        if (existing.isPresent()) return ResponseEntity.badRequest().body("User already exists");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String userId = request.getUserId();
        String password = request.getPassword();
        if (userId == null || password == null)
            return ResponseEntity.badRequest().body("Missing credentials");

        Optional<User> opt = userRepository.findByUserId(userId);
        if (opt.isPresent() && passwordEncoder.matches(password, opt.get().getPassword())) {
            String token = jwtTokenUtil.generateToken(userId);
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/verify-security")
    public ResponseEntity<?> verifySecurity(@RequestBody VerifySecurityRequest request) {
        String userId = request.getUserId();
        String mobile = request.getMobileNumber();
        String question = request.getSecurityQuestion();
        String answer = request.getSecurityAnswer();
        if (userId == null) return ResponseEntity.badRequest().body("Missing userId");

        Optional<User> opt = userRepository.findByUserId(userId);
        if (opt.isPresent()) {
            User u = opt.get();
            boolean ok = Objects.equals(u.getMobileNumber(), mobile)
                    && Objects.equals(u.getSecurityQuestion(), question)
                    && u.getSecurityAnswer() != null
                    && u.getSecurityAnswer().equalsIgnoreCase(answer);
            if (ok) {
                return ResponseEntity.ok(Map.of("message", "Verification successful"));
            }
        }
        return ResponseEntity.status(400).body("Invalid details");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String userId, @RequestParam String newPassword) {
        Optional<User> opt = userRepository.findByUserId(userId);
        if (opt.isPresent()) {
            User u = opt.get();
            u.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @GetMapping("/security-questions")
    public ResponseEntity<?> getSecurityQuestions() {
        List<String> questions = userRepository.findAll()
                .stream()
                .map(User::getSecurityQuestion)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        return ResponseEntity.ok(questions);
    }


    @GetMapping("/allUserIds")
    public ResponseEntity<List<String>> getAllUserIds() {
        List<String> userIds = userRepository.findAll()
                .stream()
                .map(User::getUserId)
                .toList();

        return ResponseEntity.ok(userIds);
    }


    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUserId(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null ) {
            return ResponseEntity.status(401).body(Map.of("error", "Authorization header is missing"));
        }

        if(!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Authorization header does not start with bearer"));
        }

        String token = authHeader.substring(7);


        if(!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error","Invalid or expired token"));
        }

        String userId = jwtTokenUtil.getUsernameFromToken(token);
        return ResponseEntity.ok(Map.of("userId",userId));
    }
}
