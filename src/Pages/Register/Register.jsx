import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

const handleRegister = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !password || !confirmPassword) {
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

  if (password !== confirmPassword) {
    setError("Passwords do not match");
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
          <h1 className="auth-login__title">Create Account</h1>

          <p className="auth-login__subtitle">
            Create your account to continue.
          </p>

  <Input
  type="text"
  placeholder="Enter your Name"
  className="auth-login__input"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

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

<Input
  type="password"
  placeholder="Confirm Password"
  className="auth-login__input"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>
{error && <p className="auth-login__error">{error}</p>}

<Button
  text="Create Account"
  onClick={handleRegister}
  className="auth-login__primary-btn"
/>

          <p className="auth-login__bottom-text">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </section>

        <section className="auth-login__image-card">
          <img
            src="/login-image.JPG"
            alt="Register Illustration"
            className="auth-login__image"
          />
        </section>
      </main>
    </div>
  );
};

export default Register;