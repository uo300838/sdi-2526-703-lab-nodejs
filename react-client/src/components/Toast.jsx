import { useEffect } from "react";
import "../assets/Toast.css";

const Toast = ({ type = "info", message, onClose, durationMs = 2500 }) => {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(id);
  }, [message, durationMs, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      <span className="toast__msg">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
    </div>
  );
};

export default Toast;

