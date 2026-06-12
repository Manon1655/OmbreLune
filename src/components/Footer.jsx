import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

/* ─── DATA ─── */
const NAV_LINKS = [
  { label: "Accueil",       to: "/home"         },
  { label: "Bibliothèque",  to: "/library"      },
  { label: "Nouveautés",    to: "/nouveautes"   },
  { label: "Sélections",    to: "/selections"   },
  { label: "Abonnements",   to: "/subscription" },
  { label: "Mon profil",    to: "/profile"      },
  { label: "Mes favoris",   to: "/favorites"    },
];

const GENRES = [
  "Roman",          "Science-Fiction",
  "Fantasy",        "Policier & Thriller",
  "Romance",        "Histoire",
  "Biographie",     "Philosophie",
  "Jeunesse",       "Poésie & Essais",
];

const LEGAL_LINKS = [
  "Mentions légales",
  "Confidentialité",
  "Conditions d'utilisation",
  "Cookies",
];

const SOCIALS = [
  { label: "Instagram", char: "◎", href: "#" },
  { label: "Twitter/X", char: "𝕏", href: "#" },
  { label: "Facebook",  char: "f", href: "#" },
  { label: "TikTok",    char: "♪", href: "#" },
];

const CONTACT = [
  { icon: "✉", label: "Email",     value: "contact@ombrelune.fr",  href: "mailto:contact@ombrelune.fr", link: true  },
  { icon: "☎", label: "Téléphone", value: "+33 1 23 45 67 89",     href: "tel:+33123456789",            link: true  },
  { icon: "◎", label: "Adresse",   value: "12 rue des Lilas, Paris 75011",                              link: false },
  { icon: "◷", label: "Horaires",  value: "Lun – Ven, 9h – 18h",                                       link: false },
];

const TRUST = [
  { icon: "🔒", text: "Paiement 100% sécurisé" },
  { icon: "↩",  text: "Retour sous 30 jours"   },
  { icon: "📦", text: "Livraison en 48h"        },
];

/* ─── COMPONENT ─── */
export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="ft-shell">
      {/* ══ MAIN COLUMNS ══ */}
      <div className="ft-main">
        <div className="ft-main__inner">

          {/* ── Col 1 : Brand ── */}
          <div className="ft-col ft-col--brand">

            <Link to="/home" className="ft-logo">
              <div className="ft-logo__mark">
                <span className="ft-logo__letter">O</span>
              </div>
              <div className="ft-logo__text">
                <span className="ft-logo__name">Ombrelune</span>
                <span className="ft-logo__sub">Librairie numérique</span>
              </div>
            </Link>

            <p className="ft-tagline">
              Une bibliothèque vivante, nichée entre<br />
              nature et poésie. Des histoires qui transforment.
            </p>

            <div className="ft-socials">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} className="ft-social" title={s.label}>
                  {s.char}
                </a>
              ))}
            </div>

            <div className="ft-trust">
              {TRUST.map(t => (
                <div key={t.text} className="ft-trust__item">
                  <span className="ft-trust__icon">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>

          </div>

          {/* ── Col 2 : Navigation ── */}
          <div className="ft-col">
            <div className="ft-col__head">
              <span className="ft-col__eyebrow">Pages</span>
              <h4 className="ft-col__title">Navigation</h4>
            </div>
            <ul className="ft-links">
              {NAV_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 : Genres ── */}
          <div className="ft-col">
            <div className="ft-col__head">
              <span className="ft-col__eyebrow">Catalogue</span>
              <h4 className="ft-col__title">Genres</h4>
            </div>
            <ul className="ft-links">
              {GENRES.map(g => (
                <li key={g}>
                  <Link to={`/library?category=${g}`}>{g}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4 : Contact + App ── */}
          <div className="ft-col">
            <div className="ft-col__head">
              <span className="ft-col__eyebrow">Nous trouver</span>
              <h4 className="ft-col__title">Contact</h4>
            </div>

            <ul className="ft-contact">
              {CONTACT.map(c => (
                <li key={c.label}>
                  <div className="ft-contact__icon">{c.icon}</div>
                  <span>
                    {c.link
                      ? <a href={c.href}>{c.value}</a>
                      : c.value
                    }
                  </span>
                </li>
              ))}
            </ul>

            {/* App store links */}
            <div className="ft-app">
              <div className="ft-app__lbl">Application mobile</div>
              <a href="#" className="ft-app__btn">
                <div className="ft-app__icon">🍎</div>
                <div className="ft-app__info">
                  <span className="ft-app__store">Disponible sur</span>
                  <span className="ft-app__name">App Store</span>
                </div>
              </a>
              <a href="#" className="ft-app__btn">
                <div className="ft-app__icon">▶</div>
                <div className="ft-app__info">
                  <span className="ft-app__store">Disponible sur</span>
                  <span className="ft-app__name">Google Play</span>
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="ft-bottom">
        <div className="ft-bottom__inner">

          <div className="ft-bottom__copy">
            <span className="ft-bottom__logo">Ombrelune</span>
            <span className="ft-bottom__year">
              © {new Date().getFullYear()} — Tous droits réservés.
            </span>
          </div>

          <nav className="ft-legal">
            {LEGAL_LINKS.map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </nav>

          <p className="ft-made">
            Fait avec <span>♥</span> pour les lecteurs
          </p>

        </div>
      </div>

    </footer>
  );
}