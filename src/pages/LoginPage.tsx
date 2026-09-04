import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiMoon, FiSun } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { getApiErrorMessage, login } from "../api/subscriptionService";
import Brand from "../components/Brand";
import "../styles/login.css";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!usuario.trim() || !senha.trim()) {
      setError("Informe seu e-mail e sua senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(usuario.trim(), senha);
      signIn(response.token, response.user);
      navigate("/assinaturas");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível entrar. Confira os dados e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`login-page ${isDarkMode ? "dark" : ""}`}>
      <section className="login-story" aria-label="Visão geral do produto">
        <div className="login-story-content">
          <Brand inverse />
          <div className="story-copy">
            <span className="eyebrow">Tecnologia que conecta</span>
            <h1>Assinaturas organizadas. Decisões mais simples.</h1>
            <p>Acompanhe planos, pessoas e renovações com uma visão clara de toda a operação.</p>
          </div>
          <div className="story-card" aria-hidden="true">
            <div className="story-card-head"><span>Resumo mensal</span><span className="live-dot">Atualizado</span></div>
            <strong>24 assinaturas ativas</strong>
            <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="story-card-footer"><span><FiCheck /> Limites monitorados</span><b>+12%</b></div>
          </div>
        </div>
        <span className="orb orb-one" /><span className="orb orb-two" />
      </section>

      <main className="login-panel">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={isDarkMode ? "Usar tema claro" : "Usar tema escuro"}>
          {isDarkMode ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>

        <div className="mobile-brand"><Brand /></div>
        <div className="login-heading">
          <span className="eyebrow">Área de acesso</span>
          <h2>Boas-vindas</h2>
          <p>Entre com as credenciais configuradas na API.</p>
        </div>

        {error && <div className="login-error" role="alert">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-usuario">E-mail</label>
          <div className="input-wrapper">
            <FiMail aria-hidden="true" />
            <input id="login-usuario" type="email" placeholder="voce@exemplo.com" value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" disabled={loading} />
          </div>

          <div className="password-label"><label htmlFor="login-senha">Senha</label><span>Definida no backend</span></div>
          <div className="input-wrapper">
            <FiLock aria-hidden="true" />
            <input id="login-senha" type={showSenha ? "text" : "password"} placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} autoComplete="current-password" disabled={loading} />
            <button type="button" className="password-toggle" onClick={() => setShowSenha((visible) => !visible)} aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}>
              {showSenha ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
            </button>
          </div>

          <button id="btn-entrar" type="submit" className="login-submit" disabled={loading}>
            <span>{loading ? "Entrando..." : "Entrar na plataforma"}</span>
            {loading ? <i className="button-spinner" /> : <FiArrowRight aria-hidden="true" />}
          </button>
        </form>

        <p className="login-footnote">Um produto demonstrativo da Nexora.</p>
      </main>
    </div>
  );
}
