import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './RegisterSchema';
import styles from '../Login/Login.module.css';
import loginImage from '../../assets/login-image.JPG';
import logo from '../../assets/logo.png';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.authCard}>
        <div className={styles.formSection}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2>Sign Up</h2>
          <p>Create a new account to get started!</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Enter your Name" {...register('userName')} className={styles.inputField} />
              {errors.userName && <span className={styles.errorText}>{errors.userName.message}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input type="email" placeholder="Enter your Email" {...register('email')} className={styles.inputField} />
              {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input type="password" placeholder="Enter your Password" {...register('password')} className={styles.inputField} />
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>
            <button type="submit" className={styles.signInBtn}>Sign Up Now</button>
          </form>
        </div>
        <div className={styles.imageSection}>
          <img src={loginImage} alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Register;