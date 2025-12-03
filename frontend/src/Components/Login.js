import React, { useState } from "react";
import { loginUser, getMe } from "../api";

export default function Login({ onLoginSuccess, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
      setError("Username and password required");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(username, password);
      if (data && data.token) {
        localStorage.setItem("sc_token", data.token);
        const meData = await getMe();
        onLoginSuccess && onLoginSuccess(meData.user);
        onClose && onClose();
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <h2>Login</h2>
        {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter username"
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button type="button" onClick={() => onClose && onClose()} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
