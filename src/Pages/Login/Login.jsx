import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './LoginSchema';
import styles from './Login.module.css';
import loginImage from '../../assets/login-image.JPG';
import logo from '../../assets/logo.png';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.authCard}>
          <div className={styles.formSection}>
            <div className={styles.logoContainer}>
              <img src={logo} alt="AH-OSSOOL" className={styles.logo} />
            </div>
            <h2>Admin Login</h2>
            <p>Welcome back! Please log in to continue to your account.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="email" placeholder="Enter your Email" {...register('email')} className={styles.inputField} />
              {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
              <input type="password" placeholder="Enter your Password" {...register('password')} className={styles.inputField} />
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
              <button type="submit" className={styles.signInBtn}>Sign In</button>
            </form>
          </div>
          <div className={styles.imageSection}>
            <img src={loginImage} alt="Design" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;