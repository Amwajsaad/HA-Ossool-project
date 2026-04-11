import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterSchema";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./Register.module.css";
import { register as registerUser } from "../../services/AuthService";

const Register = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const response = await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      console.log("Register Response:", response);

      if (response?.isAuthenticated) {
        setRegisterSuccess("Account created successfully ✅");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setRegisterError(response?.message || "Registration failed ❌");
      }
    } catch (error) {
      console.error("Register error:", error);
      setRegisterError("Something went wrong while creating your account ❌");
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Create a new account to get started!"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Enter your First Name"
              icon="👤"
              error={errors.firstName?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Enter your Last Name"
              icon="👤"
              error={errors.lastName?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Enter your Username"
              icon="👤"
              error={errors.username?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              type="password"
              placeholder="Confirm your Password"
              icon="⌁"
              error={errors.confirmPassword?.message}
              className={styles.inputGroup}
              {...field}
            />
          )}
        />

        <label className={styles.checkboxRow}>
          <input type="checkbox" {...register("remember")} />
          <span>Keep me logged in</span>
        </label>

        {registerError && <p className={styles.errorText}>{registerError}</p>}
        {registerSuccess && <p className={styles.successText}>{registerSuccess}</p>}

        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          className={styles.signUpButton}
        >
          {isSubmitting ? "Creating account..." : "Sign Up Now"}
        </Button>

        <p className={styles.bottomText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;