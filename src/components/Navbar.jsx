import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";
import "../styles/navbar.css";

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const PLAN_BADGE = {
  decouverte: { label: "Découverte", color: "#5a8f52" },
  premium:    { label: "Premium",    color: "#9a7a32" },
  illimite:   { label: "Illimité",   color: "#7c5cbf" },
};

const MEGA = {
  "Bibliothèque": {
    cols: [
      {
        head: "Par genre",
        items: [
          { label: "Romans & Littérature", path: "/library?genre=roman",    hint: "2 400 titres" },
          { label: "Fantasy & Sci-Fi",     path: "/library?genre=fantasy",  hint: "980 titres"   },
          { label: "Policier & Thriller",  path: "/library?genre=polar",    hint: "1 200 titres" },
          { label: "Biographies",          path: "/library?genre=bio",      hint: "540 titres"   },
          { label: "Jeunesse & Manga",     path: "/library?genre=jeunesse", hint: "760 titres"   },
          { label: "Poésie & Essais",      path: "/library?genre=poesie",   hint: "320 titres"   },
        ],
      },
      {
        head: "Explorer",
        items: [
          { label: "Nouveautés",       path: "/nouveautes",            hint: "Cette semaine"        },
          { label: "Coups de cœur",    path: "/selections",            hint: "Nos éditeurs adorent" },
          { label: "Les plus lus",     path: "/library?sort=popular",  hint: "Top 100"              },
          { label: "Séries complètes", path: "/library?filter=series", hint: "Collections entières" },
          { label: "Lecture rapide",   path: "/library?filter=short",  hint: "< 200 pages"          },
          { label: "Prix littéraires", path: "/library?filter=awards", hint: "Goncourt, Renaudot…"  },
        ],
      },
    ],
    card: {
      title: "Sélection de mars",
      sub: "10 romans incontournables sélectionnés par nos éditeurs",
      path: "/selections/mars",
      bg: "linear-gradient(145deg,#1e3a1e 0%,#2d5c2a 60%,#3d7535 100%)",
      label: "Découvrir",
    },
  },
  "Abonnements": {
    cols: [
      {
        head: "Formules",
        items: [
          { label: "Découverte — Gratuit",     path: "/subscription#decouverte", hint: "5 livres / mois"  },
          { label: "Premium — 9,99 €/mois",   path: "/subscription#premium",    hint: "30 livres / mois" },
          { label: "Illimité — 14,99 €/mois", path: "/subscription#illimite",   hint: "Accès total"      },
        ],
      },
      {
        head: "Avantages",
        items: [
          { label: "Lecture hors-ligne",  path: "/subscription", hint: "Partout, tout le temps" },
          { label: "Recommandations IA",  path: "/subscription", hint: "Sur-mesure pour vous"   },
          { label: "Accès anticipé",      path: "/subscription", hint: "Avant tout le monde"    },
          { label: "Sans publicité",      path: "/subscription", hint: "100% immersif"           },
          { label: "Ebook + Audio",       path: "/subscription", hint: "2 formats au choix"      },
        ],
      },
    ],
    card: {
      title: "1 mois offert",
      sub: "Sur le plan Premium avec le code LUNE — offre limitée",
      path: "/subscription",
      bg: "linear-gradient(145deg,#2a1a08 0%,#5c3810 60%,#8a5028 100%)",
      label: "En profiter",
    },
  },
};

const GENRES = ["Roman", "Fantasy", "Policier", "SF", "Biographie", "Jeunesse", "Manga", "Poésie"];

const USER_LINKS = (favorites, cart, subscription) => [
  { ico: "👤", label: "Mon profil",    path: "/profile"                    },
  { ico: "❤️", label: "Mes favoris",  path: "/favorites",   cnt: favorites.length || null },
  { ico: "🛍️", label: "Mon panier",   path: "/cart",        cnt: cart.length || null      },
  { ico: "📦", label: "Mes commandes", path: "/profile?tab=orders"          },
  {
    ico: "⭐",
    label: subscription ? "Mon abonnement" : "S'abonner",
    path: subscription ? "/profile?tab=subscription" : "/subscription",
  },
  { ico: "⚙️", label: "Paramètres",   path: "/settings"                    },
];

/* ─── SVG Icons ──────────────────────────────────────────────────────────────── */
const IcSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IcBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcHeart = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IcCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IcChev = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const IcLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IcLogin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const IcArrow = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IcClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function SearchPanel({ searchTerm, setSearchTerm, onSubmit, recent, onClose }) {
  return (
    <div className="nv-panel nv-panel--search">
      <form onSubmit={onSubmit} className="nv-search-row">
        <IcSearch />
        <input
          autoFocus
          className="nv-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Titre, auteur, genre…"
          aria-label="Rechercher"
        />
        {!searchTerm && <span className="nv-search-kbd">⌘K</span>}
        {searchTerm && (
          <button
            type="button"
            className="nv-search-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Effacer"
          >
            ✕
          </button>
        )}
        <button type="submit" className="nv-search-go">Chercher</button>
      </form>

      {recent.length > 0 && (
        <div className="nv-search-sec nv-search-sec--border">
          <div className="nv-search-lbl">Récents</div>
          {recent.map((s) => (
            <button key={s} className="nv-search-item" onClick={() => setSearchTerm(s)}>
              <IcClock /> {s}
            </button>
          ))}
        </div>
      )}

      <div className="nv-search-sec">
        <div className="nv-search-lbl">Genres</div>
        <div className="nv-search-genres">
          {GENRES.map((g) => (
            <button key={g} className="nv-search-genre" onClick={onClose}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotifPanel({ notifs, onNavigate }) {
  const unread = notifs.filter((n) => n.unread).length;
  return (
    <div className="nv-panel nv-panel--notif">
      <div className="nv-ph">
        <span className="nv-ph__title">Notifications</span>
        <span className="nv-ph__badge">{unread} nouvelle{unread !== 1 ? "s" : ""}</span>
      </div>
      {notifs.map((n) => (
        <button
          key={n.id}
          className={`nv-notif-item${n.unread ? " nv-notif-item--unread" : ""}`}
          onClick={() => onNavigate(n.link)}
        >
          <div className="nv-notif-ico">{n.icon}</div>
          <div className="nv-notif-content">
            <p className="nv-notif-text">{n.text}</p>
            <span className="nv-notif-sub">{n.sub}</span>
          </div>
          <span className="nv-notif-time">{n.time}</span>
          {n.unread && <div className="nv-notif-dot" />}
        </button>
      ))}
      <div className="nv-panel-foot">
        <button className="nv-panel-foot-btn" onClick={() => onNavigate("/notifications")}>
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
}

function CartPanel({ cart, cartTotal, onNavigate }) {
  return (
    <div className="nv-panel nv-panel--cart">
      <div className="nv-ph">
        <span className="nv-ph__title">Mon panier</span>
        <span className="nv-ph__badge">{cart.length} article{cart.length !== 1 ? "s" : ""}</span>
      </div>

      {cart.length === 0 ? (
        <p className="nv-cart-empty">Votre panier est vide</p>
      ) : (
        <>
          {cart.slice(0, 4).map((item, i) => (
            <div key={i} className="nv-cart-item">
              <div className="nv-cart-cover">📚</div>
              <div className="nv-cart-details">
                <div className="nv-cart-t">{item.title || "Livre"}</div>
                <div className="nv-cart-a">{item.author || ""}</div>
                <div className="nv-cart-p">
                  {Number(item.price).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </div>
              </div>
            </div>
          ))}

          {cart.length > 4 && (
            <p className="nv-cart-more">
              +{cart.length - 4} autre{cart.length - 4 > 1 ? "s" : ""} article{cart.length - 4 > 1 ? "s" : ""}
            </p>
          )}

          <div className="nv-cart-foot">
            <div className="nv-cart-foot-row">
              <span>Total estimé</span>
              <strong>{cartTotal}</strong>
            </div>
            <button className="nv-cart-cta" onClick={() => onNavigate("/cart")}>
              Commander →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function UserPanel({ user, favorites, cart, subscription, plan, onNavigate, onLogout }) {
  const initials = user.firstName
    ? user.firstName[0].toUpperCase()
    : user.email?.[0].toUpperCase();

  return (
    <div className="nv-panel nv-panel--user">
      <div className="nv-udrop-head">
        <div className="nv-udrop-ava">{initials}</div>
        <div>
          <div className="nv-udrop-name">
            {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
          </div>
          <div className="nv-udrop-email">{user.email}</div>
        </div>
      </div>

      {plan && (
        <div className="nv-udrop-plan-row">
          <div className="nv-udrop-plan-dot" style={{ background: plan.color }} />
          <span className="nv-udrop-plan-txt">{plan.label}</span>
          <span className="nv-udrop-plan-act">actif</span>
        </div>
      )}

      <div className="nv-udrop-stats">
        {[
          { ico: "❤️", val: favorites.length, lbl: "Favoris",   path: "/favorites"          },
          { ico: "🛍️", val: cart.length,      lbl: "Panier",    path: "/cart"               },
          { ico: "📦", val: "—",              lbl: "Commandes", path: "/profile?tab=orders" },
        ].map((s) => (
          <button key={s.lbl} className="nv-udrop-stat" onClick={() => onNavigate(s.path)}>
            <span className="nv-udrop-stat__ico">{s.ico}</span>
            <span className="nv-udrop-stat__n">{s.val}</span>
            <span className="nv-udrop-stat__l">{s.lbl}</span>
          </button>
        ))}
      </div>

      <div className="nv-udrop-links">
        {USER_LINKS(favorites, cart, subscription).map((item) => (
          <button key={item.path} className="nv-udrop-link" onClick={() => onNavigate(item.path)}>
            <span className="nv-udrop-link__ico">{item.ico}</span>
            {item.label}
            {item.cnt
              ? <span className="nv-udrop-link__cnt">{item.cnt}</span>
              : <span className="nv-udrop-link__arrow"><IcArrow /></span>
            }
          </button>
        ))}
      </div>

      <div className="nv-udrop-div" />
      <button className="nv-udrop-logout" onClick={onLogout}>
        <IcLogout /> Se déconnecter
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════ */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout }    = useAuth();
  const { cart, favorites } = useCart();
  const { subscription }    = useSubscription();

  const [mega,       setMega]       = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const [recent,     setRecent]     = useState(["Amélie Nothomb", "Dune", "Molière"]);

  const navRef    = useRef(null);
  const megaTimer = useRef(null);

  const isActive = (p) => location.pathname === p;
  const plan = subscription ? PLAN_BADGE[subscription.id] : null;

  /* ─── Scroll tracking ── */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      const el = document.documentElement;
      setScrollPct((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ─── Click outside close ── */
  useEffect(() => {
    const fn = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMega(null); setSearchOpen(false); setNotifOpen(false);
        setCartOpen(false); setUserOpen(false); setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ─── Keyboard shortcuts ── */
  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") {
        setSearchOpen(false); setMega(null);
        setNotifOpen(false); setCartOpen(false); setUserOpen(false);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  /* ─── Handlers ── */
  const openMega  = (k) => { clearTimeout(megaTimer.current); if (MEGA[k]) setMega(k); };
  const closeMega = ()  => { megaTimer.current = setTimeout(() => setMega(null), 140); };

  const closeAll  = () => {
    setNotifOpen(false); setCartOpen(false); setUserOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((p) => !p);
    setNotifOpen(false); setCartOpen(false); setUserOpen(false);
  };

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const t = searchTerm.trim();
      if (!t) return;
      setRecent((p) => [t, ...p.filter((s) => s !== t)].slice(0, 5));
      navigate(`/library?search=${encodeURIComponent(t)}`);
      setSearchTerm(""); setSearchOpen(false);
    },
    [searchTerm, navigate]
  );

  const handleNavigate = (path) => {
    navigate(path);
    closeAll(); setMega(null); setMobileOpen(false);
  };

  const handleLogout = () => {
    logout(); setUserOpen(false); navigate("/login");
  };

  const cartTotal = cart
    .reduce((s, i) => s + Number(i.price), 0)
    .toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  const NOTIFS = [
    { id: 1, icon: "🌕", text: "Sélection de mars disponible",  sub: "10 nouvelles pépites vous attendent", time: "1h",  unread: true,  link: "/selections"  },
    { id: 2, icon: "💎", text: "Offre spéciale abonné",          sub: "-20% ce weekend uniquement",          time: "3h",  unread: true,  link: "/subscription" },
    { id: 3, icon: "📖", text: "Reprenez votre lecture",         sub: "Dune — Chapitre 12",                  time: "2j",  unread: false, link: "/library"      },
    { id: 4, icon: "⭐", text: "Nouveau titre ajouté",           sub: "Les Âmes Errantes est disponible",    time: "3j",  unread: false, link: "/library"      },
  ];
  const unreadCount = NOTIFS.filter((n) => n.unread).length;

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <>
      <nav className={`nv${scrolled ? " nv--scrolled" : ""}`} ref={navRef}>

      <div className="nv-inner">

        {/* ── Main bar ── */}
        <div className="nv-bar">
        <div className="nv-prog" style={{ width: `${scrollPct}%` }} />

        {/* Logo */}
        <Link to="/" className="nv-logo">
          <div className="nv-logo__mark">O</div>
          <div>
            <div className="nv-logo__name">Ombrelune</div>
            <div className="nv-logo__tag">Librairie numérique</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="nv-nav" aria-label="Navigation principale">
          <Link to="/home" className={`nv-link${isActive("/home") ? " nv-link--active" : ""}`}>
            Accueil
          </Link>

          <button
            className={`nv-link${mega === "Bibliothèque" ? " nv-link--open" : ""}${isActive("/library") ? " nv-link--active" : ""}`}
            onMouseEnter={() => openMega("Bibliothèque")}
            onMouseLeave={closeMega}
            onClick={() => navigate("/library")}
          >
            Bibliothèque
            <span className="nv-link__chev"><IcChev /></span>
          </button>

          <button
            className={`nv-link${mega === "Abonnements" ? " nv-link--open" : ""}${isActive("/subscription") ? " nv-link--active" : ""}`}
            onMouseEnter={() => openMega("Abonnements")}
            onMouseLeave={closeMega}
            onClick={() => navigate("/subscription")}
          >
            Abonnements
            {!subscription && <span className="nv-link__dot" aria-hidden="true" />}
            <span className="nv-link__chev"><IcChev /></span>
          </button>
        </nav>

        {/* Right zone */}
        <div className="nv-right">

          {/* Hamburger (mobile) */}
          <button
            className={`nv-hamburger ${mobileOpen ? "is-open" : ""}`}
            onClick={() => toggleMobile()}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
              </svg>
            )}
          </button>

          {/* Search */}
          <div className="nv-icon-wrap">
            <button
              className={`nv-icon-btn${searchOpen ? " nv-icon-btn--active" : ""}`}
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Rechercher (⌘K)"
              aria-expanded={searchOpen}
            >
              <IcSearch />
            </button>
            {searchOpen && (
              <SearchPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSubmit={handleSearch}
                recent={recent}
                onClose={() => setSearchOpen(false)}
              />
            )}
          </div>

          {/* Notifications */}
          <div className="nv-icon-wrap">
            <button
              className={`nv-icon-btn${notifOpen ? " nv-icon-btn--active" : ""}`}
              onClick={() => { setNotifOpen((p) => !p); setCartOpen(false); setUserOpen(false); }}
              aria-label={`Notifications (${unreadCount} non lues)`}
              aria-expanded={notifOpen}
            >
              <IcBell />
              {unreadCount > 0 && <span className="nv-badge nv-badge--gold">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <NotifPanel
                notifs={NOTIFS}
                onNavigate={handleNavigate}
              />
            )}
          </div>

          {/* Favourites */}
          <button
            className="nv-icon-btn"
            onClick={() => navigate("/favorites")}
            aria-label={`Favoris (${favorites.length})`}
            data-active={favorites.length > 0}
          >
            <IcHeart filled={favorites.length > 0} />
            {favorites.length > 0 && (
              <span className="nv-badge nv-badge--rose">{favorites.length}</span>
            )}
          </button>

          {/* Cart button */}
          <div className="nv-icon-wrap">
            <button
              className="nv-cart-btn"
              onClick={() => {
                cart.length > 0 ? setCartOpen((p) => !p) : navigate("/cart");
                setNotifOpen(false); setUserOpen(false);
              }}
              aria-expanded={cartOpen}
              aria-label="Panier"
            >
              <IcCart />
              {cart.length > 0 ? (
                <>
                  <span className="nv-cart-pill">{cart.length}</span>
                  <span className="nv-cart-total">{cartTotal}</span>
                </>
              ) : (
                <span className="nv-cart-empty-label">Panier</span>
              )}
            </button>
            {cartOpen && (
              <CartPanel
                cart={cart}
                cartTotal={cartTotal}
                onNavigate={handleNavigate}
              />
            )}
          </div>

          <div className="nv-sep" aria-hidden="true" />

          {/* User avatar / login */}
          {user ? (
            <div className="nv-icon-wrap">
              <button
                className={`nv-ava${userOpen ? " nv-ava--open" : ""}`}
                onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); setCartOpen(false); }}
                aria-expanded={userOpen}
                aria-label="Menu utilisateur"
              >
                {user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </button>
              {plan && <div className="nv-ava-ring" aria-hidden="true" />}
              {userOpen && (
                <UserPanel
                  user={user}
                  favorites={favorites}
                  cart={cart}
                  subscription={subscription}
                  plan={plan}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              )}
            </div>
          ) : (
            <Link to="/login" className="nv-login">
              <IcLogin /> Se connecter
            </Link>
          )}
        </div>
      </div>

        {/* ══ MEGA MENUS ══ */}
      </div>
      </nav>

      {/* Announcement bar below navbar */}
      <div className="nv-annonce">
        <div className="nv-band__text">
          <div><span className="nv-band__spark">✦</span> Code <strong className="nv-band__code">LUNE</strong> : 1 mois offert sur le plan Premium</div>
          <div style={{textAlign:'right'}}><span className="nv-band__cta" onClick={() => navigate("/subscription")}>En profiter →</span></div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="nv-mobile-menu" role="dialog" aria-label="Menu mobile">
          <div className="nv-mobile-links">
            <Link to="/home" className="nv-link" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link to="/library" className="nv-link" onClick={() => setMobileOpen(false)}>Bibliothèque</Link>
            <Link to="/subscription" className="nv-link" onClick={() => setMobileOpen(false)}>Abonnements</Link>
            <Link to="/favorites" className="nv-link" onClick={() => setMobileOpen(false)}>Favoris</Link>
            <Link to="/cart" className="nv-link" onClick={() => setMobileOpen(false)}>Panier</Link>
          </div>

          <div className="nv-mobile-user">
            {user ? (
              <>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <div className="nv-udrop-ava">{user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}</div>
                  <div>
                    <div style={{fontWeight:600}}>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}</div>
                    <div style={{fontSize:12, color:'var(--ink-mid)'}}>{plan ? plan.label : 'Utilisateur'}</div>
                  </div>
                </div>
                <div style={{marginTop:10}}>
                  <button className="nv-udrop-logout" onClick={() => { handleLogout(); setMobileOpen(false); }}>Se déconnecter</button>
                </div>
              </>
            ) : (
              <Link to="/login" className="nv-link" onClick={() => setMobileOpen(false)}>Se connecter</Link>
            )}
          </div>
        </div>
      )}

      {mega && MEGA[mega] && (
        <div
          className="nv-mega"
          style={{ top: scrolled ? "62px" : "70px" }}
          onMouseEnter={() => clearTimeout(megaTimer.current)}
          onMouseLeave={closeMega}
        >
          <div className="nv-mega-inner">
            {MEGA[mega].cols.map((col) => (
              <div key={col.head} className="nv-mega-col">
                <div className="nv-mega-col-head">{col.head}</div>
                {col.items.map((item) => (
                  <button
                    key={item.label}
                    className="nv-mega-link"
                    onClick={() => { navigate(item.path); setMega(null); }}
                  >
                    <span className="nv-mega-link__lbl">{item.label}</span>
                    <span className="nv-mega-link__hint">{item.hint}</span>
                  </button>
                ))}
              </div>
            ))}

            {/* Featured card */}
            {(() => {
              const c = MEGA[mega].card;
              return (
                <div
                  className="nv-mega-card"
                  style={{ background: c.bg }}
                  onClick={() => { navigate(c.path); setMega(null); }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="nv-mega-card__top">
                    <div className="nv-mega-card__leaf">🌿</div>
                  </div>
                  <div className="nv-mega-card__body">
                    <div className="nv-mega-card__title">{c.title}</div>
                    <div className="nv-mega-card__sub">{c.sub}</div>
                    <div className="nv-mega-card__cta">
                      {c.label} <IcArrow />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
  </>
  );

}