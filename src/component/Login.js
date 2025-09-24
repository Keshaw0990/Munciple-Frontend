import React, { useState } from "react";
import { FaUser, FaLock, FaGoogle, FaMicrosoft } from "react-icons/fa";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); // ✅ success message state
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 
    setLoading(true);

    try {
      const response = await fetch("http://45.114.143.153:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setSuccess(data.message || "Login successful ✅"); // ✅ show inside form
        setTimeout(() => {
          navigate("/dash"); // navigate after short delay
        }, 500);
      } else {
        setError(data.message || "Invalid username or password ❌");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="auth-input">
            <FaUser className="auth-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: 300 }}
            />
          </div>

          <div className="auth-input">
            <FaLock className="auth-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ show messages inside the form */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

         

          

          
        </form>
      </div>
    </div>
  );
};

export default Login;
