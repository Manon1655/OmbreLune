import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 6)  s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const STRENGTH_LABEL = ["", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
const STRENGTH_COLOR = ["", "#e74c3c", "#e67e22", "#f1c40f", "#27ae60", "#1a8a4a"];

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", firstName: "", lastName: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Email et mot de passe sont obligatoires"); return; }
    if (form.password.length < 6)      { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }
    setLoading(true);
    try {
      const result = await register({
        username: form.username, email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
      });
      if (result?.token) { navigate("/home"); }
      else               { setError(result?.error || "Erreur lors de l'inscription"); }
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      {/* ── Left brand panel ── */}
      <div className="auth-brand">
        <div className="auth-brand__inner">
          <div className="auth-brand__logo"><span>O</span></div>
          <h2 className="auth-brand__name">Ombrelune</h2>
          <p className="auth-brand__tagline">
            Rejoignez une communauté de lecteurs<br/>
            <em>passionnés par les mots.</em>
          </p>

          <div className="auth-brand__perks">
            {[
              { icon: "📚", title: "10 000+ livres",       desc: "Tous les genres, nouvelles parutions chaque semaine." },
              { icon: "❤️", title: "Favoris & listes",     desc: "Organisez vos lectures et partagez vos coups de cœur." },
              { icon: "⭐", title: "Plans flexibles",       desc: "Gratuit, Premium ou Illimité — à votre rythme." },
              { icon: "🔒", title: "Compte sécurisé",      desc: "Vos données sont protégées et ne sont jamais revendues." },
            ].map(p => (
              <div key={p.title} className="auth-perk">
                <span className="auth-perk__icon">{p.icon}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel auth-panel--register">
        <div className="auth-form auth-form--register">

          <div className="auth-form__head">
            <p className="auth-form__eyebrow">Inscription gratuite</p>
            <h1>Créer un compte</h1>
            <p className="auth-form__sub">
              Déjà membre ?{" "}
              <Link to="/login" className="auth-inline-link">Se connecter →</Link>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form__fields">

            {/* Nom d'utilisateur */}
            <div className="auth-field">
              <label>Nom d'utilisateur *</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input type="text" placeholder="ex: jean_dupont" value={form.username} onChange={set("username")} required autoComplete="username"/>
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label>Adresse email *</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" placeholder="jean@exemple.com" value={form.email} onChange={set("email")} required autoComplete="email"/>
              </div>
            </div>

            {/* Prénom + Nom */}
            <div className="auth-row">
              <div className="auth-field">
                <label>Prénom</label>
                <div className="auth-input-wrap">
                  <input type="text" placeholder="Jean" value={form.firstName} onChange={set("firstName")} autoComplete="given-name"/>
                </div>
              </div>
              <div className="auth-field">
                <label>Nom</label>
                <div className="auth-input-wrap">
                  <input type="text" placeholder="Dupont" value={form.lastName} onChange={set("lastName")} autoComplete="family-name"/>
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div className="auth-field">
              <label>Mot de passe *</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 6 caractères"
                  value={form.password} onChange={set("password")}
                  required autoComplete="new-password"
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Barre de force */}
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength__bar">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className="auth-strength__seg"
                        style={{ background: i <= strength ? STRENGTH_COLOR[strength] : "var(--parch-mid)" }}
                      />
                    ))}
                  </div>
                  <span style={{ color: STRENGTH_COLOR[strength] }}>{STRENGTH_LABEL[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner"/> Création du compte…</>
              ) : (
                "Créer mon compte gratuitement"
              )}
            </button>

            <p className="auth-legal">
              En créant un compte, vous acceptez nos{" "}
              <a href="#">Conditions d'utilisation</a> et notre{" "}
              <a href="#">Politique de confidentialité</a>.
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}