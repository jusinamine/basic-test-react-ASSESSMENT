import React from "react";
import "./styles/button.css";

export default function Button({
  children,
  type = "primary",
  onClick = () => {},
}) {
  return (
    <button
      className={`btn ${type === "primary" ? "btn-primary" : "btn-secondary"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
