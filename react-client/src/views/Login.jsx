import { useState } from "react";
import "../assets/Login.css";
import { login } from "../services/service";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);

    login({ email, password })
      .then((data) => {
        if (!data?.token) {
          setError("Usuario o contrasena invalidos");
          return;
        }
        localStorage.setItem("token", data.token);
        onLogin?.();
      })
      .catch(() => {
        setError("No se pudo iniciar sesion");
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesion</h2>
      <input
        type="email"
        placeholder="email@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="contrasena"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Aceptar"}
      </button>
    </div>
  );
};

export default Login;
