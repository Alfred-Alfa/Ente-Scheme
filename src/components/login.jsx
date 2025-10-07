import React, { useState } from "react";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import "./CombinedLogin.css";


function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        // Store user data in localStorage if remember me is checked
        if (remember) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Set a welcome flag for the next screen to pick up and display
        try {
          const displayName = data.user?.username || data.user?.email || 'User';
          localStorage.setItem('welcome_user_name', displayName);
        } catch (_) {
          // no-op
        }

        // Call the onLogin callback with user data
        onLogin(data.user);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = (e) => {
    e.preventDefault();
    window.location.hash = '#/register';
  };

  return (
    <div className="form-container" role="main" aria-label="Login form">
      <div className="form-header">
        <div className="logo" aria-hidden>ES</div>
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Access government schemes tailored for you</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email address"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <span className="input-icon" role="img" aria-label="email">📧</span>
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
        </div>

        <div className="form-options">
          <button
            type="button"
            className="checkbox-container"
            onClick={() => setRemember((r) => !r)}
            aria-pressed={remember}
          >
            <div className={`checkbox ${remember ? " checked" : ""}` } />
            <label>Remember me</label>
          </button>
          <button type="button" className="forgot-password" onClick={() => alert("Forgot password feature coming soon!")}>Forgot password?</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading && <span className="loading" />}
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="switch-link">
        Don't have an account? <button onClick={navigateToRegister}>Sign up here</button>
      </div>
    </div>
  );
}

export default Login;