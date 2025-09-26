import React, { useState, useEffect } from "react";
import "./login.css";

// removed custom monkey SVG icons; using emoji instead

const particles = [
  { style: { width: 80, height: 80, top: "10%", left: "10%" }, delay: "0s" },
  { style: { width: 120, height: 120, top: "20%", right: "10%" }, delay: "2s" },
  { style: { width: 60, height: 60, bottom: "20%", left: "20%" }, delay: "4s" },
  { style: { width: 100, height: 100, bottom: "10%", right: "20%" }, delay: "1s" },
];

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [btnText, setBtnText] = useState("Sign In");
  const [titleText, setTitleText] = useState("Ente Scheme");

  useEffect(() => {
    const originalTitle = "Ente Scheme";
    setTitleText(originalTitle);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      const user = { email, name: email.split('@')[0] };
      onLogin(user);
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = (e) => {
    e.preventDefault();
    window.location.hash = '#/register';
  };

  return (
    <div className="login-page">
      {particles.map((p, idx) => (
        <div key={idx} className="particle" style={{ ...p.style, animationDelay: p.delay }} />
      ))}

      <div className="login-container" role="main" aria-label="Login form">
        <div className="login-header">
          <div className="logo" aria-hidden>ES</div>
          <h1 className="login-title">{titleText}</h1>
          <p className="login-subtitle">Access government schemes tailored for you</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email address"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <span className="input-icon" role="img" aria-label="email">📧</span>
            <label className="field-label-right" htmlFor="email">Email</label>
          </div>

          <div className="form-group">
            <input
              type={showPwd ? "text" : "password"}
              className="form-input"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="input-icon btn-eye"
              aria-label={showPwd ? "Hide password" : "Show password"}
              onClick={() => setShowPwd((v) => !v)}
            >
              {showPwd ? "🐵" : "🙈"}
            </button>
            <label className="field-label-right" htmlFor="password">Password</label>
          </div>

          <div className="form-options">
            <button
              type="button"
              className="checkbox-container"
              onClick={() => setRemember((r) => !r)}
              aria-pressed={remember}
            >
              <div className={`checkbox${remember ? " checked" : ""}`} />
              <label>Remember me</label>
            </button>
            <button className="forgot-password" onClick={(e) => { e.preventDefault(); alert("Forgot password coming soon"); }}>Forgot password?</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" id="loginBtn" disabled={loading}>
            <span className="loading" style={{ display: loading ? "inline-block" : "none" }} />
            <span id="btnText">{loading ? 'Signing in...' : btnText}</span>
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <button onClick={navigateToRegister}>Sign up here</button>
        </div>
      </div>
    </div>
  );
}

export default Login;