import React from "react";
import { Button } from "../button";
import "./styles/modal.css";

export default function Modal({
  onAction = () => {},
  onClose = () => {},
  children,
  show = false,
}) {
  return (
    <>
      {show && (
        <div className="absolute-blur-box">
          <div className="modal">
            {children}
            <div className="modal-actions">
              <Button onClick={onClose} type="secondary">
                Close
              </Button>

              <Button onClick={onAction} type="primary">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
