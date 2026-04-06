import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterSchema";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    console.log("Register Data:", data);

    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    localStorage.setItem("registeredUser", JSON.stringify(userData));
    localStorage.setItem("token", "admin-token");
    localStorage.setItem("currentUser", JSON.stringify(userData));

    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Create a new account to get started!"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Enter your Name"
              icon="👤"
              error={errors.name?.message}
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

        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          className={styles.signUpButton}
        >
          Sign Up Now
        </Button>

        <p className={styles.bottomText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;