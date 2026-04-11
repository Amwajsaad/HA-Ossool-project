import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginSchema";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./Login.module.css";
import { login } from "../../services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

const onSubmit = async (data) => {
  setLoginError("");

  try {
    const response = await login({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    console.log("Login Response:", response);

    
    if (response && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response));

      navigate("/Home"); 
    } else {
      setLoginError(response?.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
    setLoginError(error.message || "Something went wrong");
  }
};

  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Welcome back! Please log in to continue to your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              type="email"
              placeholder="Enter your Email"
              icon="@"
              error={errors.email?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              type="password"
              placeholder="Enter your Password"
              icon="⌁"
              error={errors.password?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

        <label className={styles.checkboxRow}>
          <input type="checkbox" {...register("remember")} />
          <span>Keep me logged in</span>
        </label>

        {loginError && <p className={styles.errorText}>{loginError}</p>}

        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          className={styles.signInButton}
        >
          Sign In
        </Button>

        <Button
          type="button"
          variant="secondary"
          className={styles.googleButton}
        >
          Sign In With Google
        </Button>

        <p className={styles.bottomText}>
          Need an account? <Link to="/register">Create one!</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;