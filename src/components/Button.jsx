import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
}) => {
  const getStyles = () => {
    if (variant === "secondary") {
      return {
        background: "#ffffff",
        color: "#1f1f1f",
        border: "1px solid #e3e3e3",
      };
    }

    return {
      background: "linear-gradient(135deg, #e53935, #c62828)",
      color: "#ffffff",
      border: "none",
    };
  };

  const styles = getStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        width: "100%",
        height: "56px",
        borderRadius: "14px",
        fontSize: "18px",
        fontWeight: "700",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.7 : 1,
        ...styles,
      }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;