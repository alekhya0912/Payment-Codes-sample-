import React, { useState } from "react";
import bg from "../../assets/images/bg.avif";
import Header from "../../common/Header";
import "./ForgetPassword.css";

function ForgotPassword() {
    const [step,setStep] = useState(1);

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return(
        <div className="forgotpassword-page" style={{ backgroundImage: `url(${bg})` }}>
            <Header />
            <div className="forgotpassword-container">
                <div className="forgotpassword-card">
                    {step === 1 ? (
                        <>
                            <h2>Forgot Password</h2>
                            <form className="forgotpassword-form" onSubmit={handleNext}>
                                <div className="forgot-form-group">
                                    <label>User ID</label>
                                    <input type="text" placeholder="Enter your User ID" required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" placeholder="Enter your registered mobile number" required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Security Question</label>
                                    <select required>
                                        <option value="">Select a security question</option>
                                        <option value="pet">What is your pet's name?</option>
                                        <option value="school">What is your first school name?</option>
                                        <option value="city">In which city were you born?</option>
                                    </select>
                                    <input type="text" placeholder="Enter your answer" required />
                                </div>

                                <button type="submit" className="forgotpassword-button">
                                    Next
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Reset Password</h2>
                            <form className="forgotpassword-form">
                                <div className="forgot-form-group">
                                    <label>User ID</label>
                                    <input type="text" placeholder="Enter your User ID" required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter your new password" required />
                                </div>

                                <div className="forgot-form-group">
                                    <label>Re-type Password</label>
                                    <input type="password" placeholder="Re-enter your new password" required />
                                </div>

                                <button type="submit" className="forgotpassword-button">
                                    Reset Password
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;