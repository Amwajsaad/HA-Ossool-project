import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
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

          <input
            type="email"
            placeholder="Enter your Email"
            className="auth-login__input"
          />

          <input
            type="password"
            placeholder="Enter your Password"
            className="auth-login__input"
          />

          <label className="auth-login__check-row">
            <input type="checkbox" className="auth-login__checkbox" />
            <span className="auth-login__check-text">Keep me logged in</span>
          </label>

         <button 
  className="auth-login__primary-btn"
  onClick={() => navigate("/dashboard")}
>
  Sign In
</button>

          <button className="auth-login__google-btn">
            <span className="auth-login__google-icon">G</span>
            Sign In With Google
          </button>

          <p className="auth-login__bottom-text">
            Need an account? <Link to="/register"> create one! </Link>
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

          <button className="auth-login__footer-btn">Contact Us!</button>
        </div>
      </footer>
    </div>
  );
};

export default Login;