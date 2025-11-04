import React, { useEffect, useState } from "react";
import bg from "../../assets/images/bg.avif";
import Header from "../../common/Header";
import "./ForgetPassword.css";
import { apiFetch } from "../../services/api";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    mobileNumber: "",
    securityQuestion: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  // Fetch all security questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await apiFetch("/api/auth/security-questions", {
          method: "GET",
        });
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch security questions:", err);
      }
    }
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1 → Verify user details
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await apiFetch("/api/auth/verify-security", {
        method: "POST",
        body: JSON.stringify({
          userId: form.userId,
          mobileNumber: form.mobileNumber,
          securityQuestion: form.securityQuestion,
          securityAnswer: form.securityAnswer,
        }),
      });

      if (response.ok) {
        setMessage("Verification successful. Please reset your password.");
        setTimeout(() => setStep(2), 1000);
      } else {
        const msg = await response.text();
        setMessage(msg || "Verification failed. Check your details.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  // Step 2 → Reset password
  const handleReset = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await apiFetch(
        `/api/auth/reset-password?userId=${form.userId}&newPassword=${form.newPassword}`,
        { method: "POST" }
      );

      if (response.ok) {
        setMessage("Password reset successful. You can now login.");
        setTimeout(() => navigate("/login"), 2000);
        setForm({
          userId: "",
          mobileNumber: "",
          securityQuestion: "",
          securityAnswer: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const msg = await response.text();
        setMessage(msg || "Error resetting password.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };
  
    return(
        <div className="forgotpassword-page" style={{ backgroundImage: `url(${bg})` }}>
            <Header />
            <div className="forgotpassword-container">
                <div className="forgotpassword-card">
                    {step === 1 ? (
                        <>
                            <h2>Forgot Password</h2>
                            <form className="forgotpassword-form" onSubmit={handleVerify}>
                                <div className="forgot-form-group">
                                    <label>User ID</label>
                                    <input type="text" name="userId" placeholder="Enter your User ID" value={form.userId} onChange={handleChange} required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" name="mobileNumber" placeholder="Enter your registered mobile number" value={form.mobileNumber} onChange={handleChange} required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Security Question</label>
                                    <select name="securityQuestion" value={form.securityQuestion} onChange={handleChange} required>
                                        <option value="">-- Select a Question -- </option>
                                        {questions.map((q, i) => (
                                          <option key={i} value={q}>
                                            {q}
                                          </option>
                                        ))}
                                    </select>
                                    <input type="text" name="securityAnswer" placeholder="Enter your answer" value={form.securityAnswer} onChange={handleChange} required />
                                </div>

                                <button type="submit" className="forgotpassword-button">
                                    Verify
                                </button>
                                {message && <p className="message">{message}</p>}
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Reset Password</h2>
                            <form className="forgotpassword-form" onSubmit={handleReset}>
                                <div className="forgot-form-group">
                                    <label>User ID</label>
                                    <input type="text" name="userId" placeholder="Enter your User ID" value={form.userId} onChange={handleChange} required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>New Password</label>
                                    <input type="password" name="newPassword" placeholder="Enter your new password" value={form.newPassword} onChange={handleChange} required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Re-type Password</label>
                                    <input type="password" name="confirmPassword" placeholder="Re-enter your new password" value={form.confirmPassword} onChange={handleChange} required />
                                </div>

                                <button type="submit" className="forgotpassword-button">
                                    Reset Password
                                </button>
                                {message && <p className="message">{message}</p>}

                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
