import React from "react";
import "./styles/icon-box.css";
export default function IconBox({ icon, onClick = () => {} }) {
  return (
    <button onClick={onClick} className="icon-box">
      {icon}
    </button>
  );
}
