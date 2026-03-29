import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    localStorage.setItem("token", "123");
    navigate("/dashboard");
  };

  return (
    <div className="auth-login">
      <header className="auth-login__header">
        <img src="/logo.png" alt="AH-OSSOOL" className="auth-login__logo" />
      </header>

      <main className="auth-login__main">
        <section className="auth-login__card">
          <h1 className="auth-login__title">Admin Login</h1>

          <p className="auth-login__subtitle">
            Welcome back! Please log in to continue to your account.
          </p>

          <Input
            type="email"
            placeholder="Enter your Email"
            className="auth-login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Enter your Password"
            className="auth-login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-login__error">{error}</p>}

          <label className="auth-login__check-row">
            <input type="checkbox" className="auth-login__checkbox" />
            <span className="auth-login__check-text">Keep me logged in</span>
          </label>

          <Button
            text="Sign In"
            onClick={handleLogin}
            className="auth-login__primary-btn"
          />

          <Button
            text="Sign In With Google"
            className="auth-login__google-btn"
          />

          <p className="auth-login__bottom-text">
            Need an account? <Link to="/register">Create one!</Link>
          </p>
        </section>

        <section className="auth-login__image-card">
          <img
            src="/login-image.JPG"
            alt="Login Illustration"
            className="auth-login__image"
          />
        </section>
      </main>
    </div>
  );
};

export default Login;