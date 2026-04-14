import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User } from "lucide-react";

function Model({ show, onClose, orphanageId }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const demoAccounts = {
      "lokesh@gmail.com": "lokesh",
      "khushi@gmail.com": "khushi"
    };

    try {
      const res = await fetch("http://localhost:3200/adlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setLoading(false);
        setMsg("Login Successful! 🎉");
        localStorage.removeItem("isDemoLoggedIn"); // Clear demo flag if real login works
        if (data.token) localStorage.setItem("token", data.token);
        setTimeout(() => { onClose(); navigate(`/donate/${orphanageId || ""}`); }, 800);
      } else {
        // Fallback for demo accounts if backend exists but doesn't have them
        if (demoAccounts[email] && demoAccounts[email] === password) {
          setLoading(false);
          setMsg("Demo Login Successful! 🎉");
          localStorage.setItem("isDemoLoggedIn", "true");
          setTimeout(() => { onClose(); navigate(`/donate/${orphanageId || "demo-001"}`); }, 800);
        } else {
          setLoading(false);
          setMsg("Invalid Email or Password ❌");
        }
      }
    } catch (err) {
      // Backend is down - use demo fallback
      if (demoAccounts[email] && demoAccounts[email] === password) {
        setTimeout(() => {
          setLoading(false);
          setMsg("Demo Login Successful! 🎉 (Offline Mode)");
          localStorage.setItem("isDemoLoggedIn", "true");
          setTimeout(() => {
            onClose();
            navigate(`/donate/${orphanageId || "demo-001"}`);
          }, 800);
        }, 500);
      } else {
        setLoading(false);
        setMsg("Connection Error ❌ (Backend Offline)");
      }
    }
  };

  const autofill = (e, p) => {
    setEmail(e);
    setPassword(p);
    setMsg("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3200/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setMsg("Registration Successful 🎉 Please login");
        setIsRegister(false);
      } else {
        setMsg("Registration Failed ❌");
      }
    } catch (err) {
      setLoading(false);
      setMsg("Registration Failed ❌ (Backend Offline)");
    }
  };

  return (
    <div className="modal fade show d-block premium-modal-backdrop"
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      tabIndex="-1"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="premium-modal modal-content border-0" style={{ borderRadius: "var(--hc-radius-xl)" }}>

          {/* Header */}
          <div className="text-center pt-4 pb-2 px-4 position-relative">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div className="brand-logo" style={{ width: 36, height: 36, borderRadius: 10 }}>
                <Heart size={16} fill="currentColor" />
              </div>
              <span style={{ fontFamily: "var(--hc-font-heading)", fontWeight: 800, fontSize: "1.2rem" }}>
                HopeConnect
              </span>
            </div>
            <h5 style={{ fontFamily: "var(--hc-font-heading)", fontWeight: 700, color: "var(--hc-navy)" }}>
              {isRegister ? "Create Account" : "Welcome Back"}
            </h5>
            <p className="small" style={{ color: "var(--hc-text-secondary)" }}>
              {isRegister ? "Join us in making a difference" : "Login to continue your donation"}
            </p>
            <button
              type="button"
              className="btn-close position-absolute end-0 top-0 m-3"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="px-4 pb-4">
            {msg && (
              <div className="alert py-2 text-center" style={{
                background: msg.includes("❌") ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                color: msg.includes("❌") ? "#dc2626" : "#16a34a",
                border: "none",
                borderRadius: "var(--hc-radius)",
                fontSize: "0.9rem",
                fontWeight: 500
              }}>
                {msg}
              </div>
            )}

            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text border-0" style={{ background: "var(--hc-surface-alt)", borderRadius: "var(--hc-radius) 0 0 var(--hc-radius)" }}>
                      <User size={16} style={{ color: "var(--hc-text-muted)" }} />
                    </span>
                    <input type="text" className="premium-input form-control" style={{ borderRadius: "0 var(--hc-radius) var(--hc-radius) 0" }}
                      value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Email</label>
                <div className="input-group">
                  <span className="input-group-text border-0" style={{ background: "var(--hc-surface-alt)", borderRadius: "var(--hc-radius) 0 0 var(--hc-radius)" }}>
                    <Mail size={16} style={{ color: "var(--hc-text-muted)" }} />
                  </span>
                  <input type="email" className="premium-input form-control" style={{ borderRadius: "0 var(--hc-radius) var(--hc-radius) 0" }}
                    value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text border-0" style={{ background: "var(--hc-surface-alt)", borderRadius: "var(--hc-radius) 0 0 var(--hc-radius)" }}>
                    <Lock size={16} style={{ color: "var(--hc-text-muted)" }} />
                  </span>
                  <input type="password" className="premium-input form-control" style={{ borderRadius: "0 var(--hc-radius) var(--hc-radius) 0" }}
                    value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit" className="gradient-btn w-100" disabled={loading}
                style={{ padding: "12px", fontSize: "0.95rem" }}>
                {loading ? (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    {isRegister ? "Creating Account..." : "Signing In..."}
                  </span>
                ) : (
                  isRegister ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            {!isRegister && (
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 4, height: 16, background: "var(--hc-primary)", borderRadius: 2 }}></div>
                  <span className="small fw-bold text-uppercase" style={{ letterSpacing: "0.5px", color: "var(--hc-navy)" }}>Quick Login (Demo)</span>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => autofill("lokesh@gmail.com", "lokesh")} className="btn btn-sm flex-fill py-2"
                    style={{ background: "var(--hc-surface-alt)", color: "var(--hc-navy)", border: "1px solid var(--hc-border)", borderRadius: "var(--hc-radius)", fontSize: "0.8rem", fontWeight: 500 }}>
                    Lokesh
                  </button>
                  <button onClick={() => autofill("khushi@gmail.com", "khushi")} className="btn btn-sm flex-fill py-2"
                    style={{ background: "var(--hc-surface-alt)", color: "var(--hc-navy)", border: "1px solid var(--hc-border)", borderRadius: "var(--hc-radius)", fontSize: "0.8rem", fontWeight: 500 }}>
                    Khushi
                  </button>
                </div>
              </div>
            )}

            <div className="auth-divider mt-4">
              <span className="small" style={{ color: "var(--hc-text-muted)" }}>or</span>
            </div>

            <div className="text-center">
              <small style={{ color: "var(--hc-text-secondary)" }}>
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <span
                  style={{ color: "var(--hc-primary)", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setMsg(""); setIsRegister(!isRegister); }}
                >
                  {isRegister ? "Sign In" : "Create Account"}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;