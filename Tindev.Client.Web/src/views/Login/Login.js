import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import Api from "../../services/api";
import "./Login.css";

export default function Login({ history }) {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const { data } = await Api.post("/devs", { user });
    if (data.success) history.push(`/dev/${data.data._id}`);
    else setError(data.data);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="Tindev" />
        <input
          placeholder="Digite o seu usuário no GitHub"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        {!!error && <span className="error">{error}</span>}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
