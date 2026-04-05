import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginSchema";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./Login.module.css";

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
    console.log(data) 

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      setLoginError("No registered account found. Please create an account first.");
      return;
    }

    if (data.email !== savedUser.email || data.password !== savedUser.password) {
      setLoginError("Invalid email or password.");
      return;
    }

    // إذا نجح التحقق
    localStorage.setItem("token", "admin-token");
    localStorage.setItem("currentUser", JSON.stringify(savedUser));
    navigate("/Home");
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