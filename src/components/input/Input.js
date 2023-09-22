import React from "react";
import "./styles/input.css";

export default function Input({ label, placeholder, onChange, value }) {
  return (
    <div className="input-box">
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
}
