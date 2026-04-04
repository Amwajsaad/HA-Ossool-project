import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  className = "",
  icon,
  ...rest
}) => {
  return (
    <div className={className}>
      <div style={{ position: "relative", width: "100%" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9a9a9a",
              fontSize: "16px",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          style={{
            width: "100%",
            height: "56px",
            border: error ? "1px solid #d32f2f" : "1px solid #e2e2e2",
            borderRadius: "14px",
            padding: icon ? "0 18px 0 48px" : "0 18px",
            fontSize: "16px",
            color: "#222",
            background: "#ffffff",
            boxSizing: "border-box",
            outline: "none",
          }}
          {...rest}
        />
      </div>

      {error && (
        <p
          style={{
            fontSize: "12px",
            color: "#d32f2f",
            margin: "6px 0 0",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;