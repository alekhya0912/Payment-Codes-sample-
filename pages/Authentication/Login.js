import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/images/bg.avif";
import Header from "../../common/Header";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login Successful (Demo)");
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
            <Header />
            <div className="login-content">
                <div className="login-card">
                    <h1>Welcome to Payment Initiation</h1>
                    <p className="subtitle">Your secure Payment platform</p>

                    <form onSubmit={handleLogin}>
                        <label className="login-label">User ID or Email</label>
                        <input className="login-input" type="text" placeholder="UserID or Email" value={user} onChange={(e) => setUser(e.target.value)} required/>
                        <label className="login-label">Password</label>
                        <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </form>
                    <div className="remeber-section">
                        <div className="remember-left">
                            <input className="login-input" type="checkbox" id="remember"/> 
                            <label htmlFor="remember">Remeber me </label>
                        </div>
                    </div>
                    <button className="Login-btn" onClick={(e) => {handleLogin(e); navigate("/home")}} type="submit">Log In</button>
                    <span className="Need-help" onClick={() => navigate("/forget-password")}>Need help logging in</span>
                    <div className="bottom-text">
                        <p>New here?{" "}
                            <span onClick={() => navigate("/signup")}>Create an account</span>
                            
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;