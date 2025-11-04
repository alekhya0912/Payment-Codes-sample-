import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/images/bg.avif";
import Header from "../../common/Header";
import { apiFetch } from "../../services/api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          setLoading(false);
          navigate("/home")
        }, 700);
      } else {
        setError("Invalid credentials. Please check your User ID or Password.");
        setLoading(false)
        setTimeout(() => setError(""), 10000);
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please check your ID or Password.");
      } else {
        setError("Server error. Please try again later.");
      }
      setLoading(false);
      setTimeout(() => setError(""), 3000);
    }
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
                        <input className="login-input" type="text" name="userId" placeholder="UserID or Email" value={form.userId} onChange={handleChange} required/>
                        <label className="login-label">Password</label>
                        <input className="login-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
                    </form>
                    <div className="remeber-section">
                        <div className="remember-left">
                            <input className="login-input" type="checkbox" id="remember"/> 
                            <label htmlFor="remember">Remeber me </label>
                        </div>
                    </div>
                    <button className="Login-btn" type="submit" onClick={handleLogin} disabled={loading}>Log In{loading ? " - Checking..." : ""}
                    </button>
                    {error && <div className="error-text">{error}</div>}
                    <span className="Need-help" onClick={() => navigate("/forget-password")}>Forgot Password ?</span>
                    {/* <div className="bottom-text">
                        <p>New here?{" "}
                            <span onClick={() => navigate("/signup")}>Create an account</span>
                            
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Login;
