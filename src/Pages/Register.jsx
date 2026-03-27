import { Link } from "react-router";
import "./Login.css";

const Register = () => {
  return (
    <div className="auth-login">
      <header className="auth-login__header">
        <img src="/logo.png" alt="AH-OSSOOL" className="auth-login__logo" />
      </header>

      <main className="auth-login__main">
        <section className="auth-login__card">
          <h1 className="auth-login__title">Create Account</h1>

          <p className="auth-login__subtitle">
            Create your account to get started with the system.
          </p>

          <input
            type="text"
            placeholder="Full Name"
            className="auth-login__input"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="auth-login__input"
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-login__input"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-login__input"
          />

          <button className="auth-login__primary-btn">
            Create Account
          </button>

          <button className="auth-login__google-btn">
            <span className="auth-login__google-icon">G</span>
            Sign Up With Google
          </button>

          <p className="auth-login__bottom-text">
            Already have an account? <Link to="/"> Sign in </Link>
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

      <footer className="auth-login__footer">
        <div className="auth-login__footer-col">
          <h3>Product</h3>
          <p>Employee Assets</p>
          <p>Asset Tracking</p>
          <p>Asset Management</p>
          <p>Asset Service</p>
        </div>

        <div className="auth-login__footer-col">
          <h3>Information</h3>
          <p>FAQ</p>
          <p>Blog</p>
          <p>Support</p>
        </div>

        <div className="auth-login__footer-col">
          <h3>Company</h3>
          <p>About us</p>
          <p>Careers</p>
          <p>Contact us</p>
        </div>

        <div className="auth-login__footer-contact">
          <div>
            <h3>Contact Our Team</h3>
            <p>Feel free to reach out</p>
            <p>we're happy to assist you.</p>
          </div>

          <button className="auth-login__footer-btn">
            Contact Us!
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Register;