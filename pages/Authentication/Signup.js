import React, { useState } from "react";
import bg from "../../assets/images/bg.avif";
import Header from "../../common/Header";
import { Link } from "react-router-dom";
import "./Signup.css";


function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        username: "",
        password: "",
        confirmPassword: "",
        securityQ1: "",
        securityA1: "",
        securityQ2: "",
        securityA2: "",
        securityQ3: "",
        securityA3: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return(
        <div className="signup-page" style={{ backgroundImage: `url(${bg})` }}>
            <Header />
            <div className="signup-container">
                <div className="signup-card">
                    <h2>Create New Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="signup-form-section">
                            <h3>Personal Details</h3>
                            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
                            <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                        </div>

                        <div className="signup-form-section">
                            <h3>Account Security</h3>
                            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.password} onChange={handleChange} required/>
                        </div>

                        <div className="signup-form-section">
                            <h3>Security Questions</h3>
                            <select name="securityQ1" value={formData.securityQ1} onChange={handleChange} required>
                                <option value="">Select Security Question 1</option>
                                <option value="pet">What is your first pet's name?</option>
                                <option value="school">What was your first school?</option>
                                <option value="city">In which city were you born?</option>
                            </select>
                            <input type="text" name="securityA1" placeholder="Answer 1" value={formData.securityA1} onChange={handleChange} required />

                            <select name="securityQ2" value={formData.securityQ2} onChange={handleChange} required>
                                <option value="">Select Security Question 2</option>
                                <option value="friend">What is your best friend's name?</option>
                                <option value="school">What's your favorite movie?</option>
                                <option value="city">Who was your favorite teacher?</option>
                            </select>
                            <input type="text" name="securityA2" placeholder="Answer 2" value={formData.securityA2} onChange={handleChange} required />

                            <select name="securityQ3" value={formData.securityQ3} onChange={handleChange} required>
                                <option value="">Select Security Question 3</option>
                                <option value="car">What was your first car?</option>
                                <option value="color">What is your favorite color?</option>
                                <option value="mother">What's your mother's maiden name?</option>
                            </select>
                            <input type="text" name="securityA3" placeholder="Answer 3" value={formData.securityA3} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                    </form>

                    <p className="login-link">
                        Already have an account? <Link to="/login">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;