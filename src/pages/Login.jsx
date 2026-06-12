import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ImageCaptcha from "./Imagecaptcha";
import "../styles/auth.css";

export default function Login() {
  const [username,      setUsername]      = useState("");
  const [password,      setPassword]      = useState("");
  const [showPwd,       setShowPwd]       = useState(false);
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [captchaOk,     setCaptchaOk]     = useState(false);
  const [showCaptcha,   setShowCaptcha]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  /* Clic sur "Se connecter" → ouvre le CAPTCHA si pas encore validé */
  const handleConnectClick = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Tous les champs sont requis"); return; }
    if (!captchaOk) { setShowCaptcha(true); return; }
    submitLogin();
  };

  /* Appelé après validation du CAPTCHA */
  const handleCaptchaVerified = () => {
    setCaptchaOk(true);
    setShowCaptcha(false);
    submitLogin();
  };

  const submitLogin = async () => {
    setLoading(true);
    try {
      const result = await login({ username, password });
      if (!result)      { setError("Erreur serveur"); return; }
      if (result.error) { setError(result.error); return; }
      if (result.token) { navigate("/home"); }
      else              { setError("Email ou mot de passe incorrect"); }
    } catch {
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      {/* ── Modale CAPTCHA ── */}
      <ImageCaptcha
        open={showCaptcha}
        onVerified={handleCaptchaVerified}
        onClose={() => setShowCaptcha(false)}
      />

      {/* ── Panneau gauche — branding ── */}
      <div className="auth-brand">
        <div className="auth-brand__inner">
          <div className="auth-brand__logo"><span>O</span></div>
          <h2 className="auth-brand__name">Ombrelune</h2>
          <p className="auth-brand__tagline">
            Une bibliothèque vivante,<br/>
            <em>nichée entre nature et poésie.</em>
          </p>
          <div className="auth-brand__quotes">
            {[
              { text: "Un livre est un rêve que vous tenez dans vos mains.", author: "Neil Gaiman" },
              { text: "La lecture est à l'esprit ce que l'exercice est au corps.", author: "Joseph Addison" },
              { text: "Toute la vie n'est qu'un livre dont on tourne les pages.", author: "Anaïs Nin" },
            ].map((q, i) => (
              <div key={i} className="auth-quote">
                <p>"{q.text}"</p>
                <span>— {q.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="auth-panel">
        <div className="auth-form">

          <div className="auth-form__head">
            <p className="auth-form__eyebrow">Bienvenue</p>
            <h1>Connexion</h1>
            <p className="auth-form__sub">Accédez à votre bibliothèque personnelle.</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form className="auth-form__fields">

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="username">Adresse email</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="username" type="email"
                  placeholder="jean@exemple.com"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="auth-field">
              <div className="auth-field__labelrow">
                <label htmlFor="password">Mot de passe</label>
                <a href="#" className="auth-forgot">Mot de passe oublié ?</a>
              </div>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password"
                />
                <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Indicateur captcha validé */}
            {captchaOk && (
              <div className="auth-captcha-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Vérification humaine réussie
              </div>
            )}

            {/* Bouton principal */}
            <button
              type="button"
              className="auth-submit"
              disabled={loading}
              onClick={handleConnectClick}
            >
              {loading ? (
                <><span className="auth-spinner"/> Connexion…</>
              ) : (
                "Se connecter"
              )}
            </button>

          </form>

          <div className="auth-divider"><span>ou</span></div>

          <div className="auth-form__footer">
            <p>Pas encore de compte ?</p>
            <Link to="/register" className="auth-register-link">
              Créer un compte gratuitement →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}