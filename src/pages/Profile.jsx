import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";
import "../styles/profile.css";

const PLAN_ICONS  = { decouverte: "🌱", premium: "⭐", illimite: "♾️" };
const PLAN_COLORS = { decouverte: "#6b8f6b", premium: "#c4882a", illimite: "#3d5c3d" };

const API = "http://localhost:8080";

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, orders } = useCart();
  const { subscription, unsubscribe } = useSubscription();

  const [profile, setProfile]     = useState(null);
  const [bio, setBio]             = useState("");
  const [books, setBooks]         = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [bioSaved, setBioSaved]   = useState(false);

  /* — init tab depuis URL ?tab=orders — */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  /* =========================
     FETCH PROFILE + BOOKS
     (plus besoin de fetch orders ni favorites — viennent du CartContext)
  ========================= */
  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [profileRes, booksRes] = await Promise.all([
        fetch(`${API}/auth/user/${user.id}`),
        fetch(`${API}/auth/user/${user.id}/books`),
      ]);

      const profileData = await profileRes.json();
      const booksData   = await booksRes.json();

      setProfile(profileData);
      setBio(profileData.bio || "");
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    }
  }, [user]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  /* =========================
     SAVE BIO
  ========================= */
  const saveBio = async () => {
    try {
      await fetch(`${API}/auth/user/${user.id}/bio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      setProfile(prev => ({ ...prev, bio }));
      setBioSaved(true);
      setTimeout(() => setBioSaved(false), 2500);
    } catch (err) { console.error(err); }
  };

  /* =========================
     PHOTO
  ========================= */
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const res  = await fetch(`${API}/auth/user/${user.id}/photo`, { method: "POST", body: formData });
      const data = await res.json();
      setProfile(prev => ({ ...prev, profile_picture: data.photo }));
    } catch (err) { console.error(err); }
  };

  /* =========================
     HELPERS
  ========================= */
  const formatDate = (str) =>
    str
      ? new Date(str).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : "—";

  const formatPrice = (n) =>
    Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  const orderStatusLabel = (status) => {
    const map = {
      delivered: { label: "Livrée",   cls: "badge-delivered" },
      pending:   { label: "En cours", cls: "badge-pending"   },
      cancelled: { label: "Annulée",  cls: "badge-cancelled" },
    };
    return map[status] || { label: "En cours", cls: "badge-pending" };
  };

  if (!profile) return (
    <div className="profile-loading">
      <div className="loading-spinner" />
      <span>Chargement du profil…</span>
    </div>
  );

  const tabs = [
    { id: "overview",      icon: "⌂",  label: "Vue générale" },
    { id: "favorites",     icon: "♥",  label: "Favoris",      count: favorites.length },
    { id: "orders",        icon: "📦", label: "Commandes",    count: orders.length    },
    { id: "subscription",  icon: "⭐", label: "Abonnement"                            },
  ];

  return (
    <div className="profile-dashboard">

      {/* ═══ HERO ═══ */}
      <div className="profile-hero">
        <div className="hero-bg-circles" />

        <div className="avatar-wrapper">
          {profile.profile_picture ? (
            <img src={`${API}${profile.profile_picture}`} alt="Profil" className="profile-image" />
          ) : (
            <div className="avatar">
              {profile.first_name?.[0] || profile.username?.[0]}
            </div>
          )}
          <label className="edit-avatar" title="Modifier la photo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <input type="file" onChange={handlePhotoChange} hidden accept="image/*" />
          </label>
        </div>

        <div className="hero-info">
          <h1>{profile.first_name || profile.username}</h1>
          <p className="hero-handle">@{profile.username}</p>
          <span className="hero-email">{profile.email}</span>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <strong>{books.length}</strong>
            <span>Livres</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <strong>{favorites.length}</strong>
            <span>Favoris</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            {/* ✅ Nombre réel de commandes depuis CartContext */}
            <strong>{orders.length}</strong>
            <span>Commandes</span>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="profile-body">

        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                <span className="sidebar-label">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="sidebar-count">{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="profile-content">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="tab-panel" key="overview">

              {/* BIO */}
              <div className="profile-card">
                <div className="card-header"><h2>Ma bio</h2></div>
                <div className="card-body">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parle un peu de toi…"
                    rows={4}
                  />
                  <button className="btn-primary" onClick={saveBio}>
                    {bioSaved ? "✓ Enregistré !" : "Enregistrer"}
                  </button>
                </div>
              </div>

              {/* APERÇU FAVORIS */}
              {favorites.length > 0 && (
                <div className="profile-card">
                  <div className="card-header">
                    <h2>Mes favoris récents</h2>
                    <button className="card-link" onClick={() => setActiveTab("favorites")}>
                      Voir tout →
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="favorites-grid">
                      {favorites.slice(0, 4).map(book => (
                        <div key={book.id} className="fav-card">
                          <div className="fav-cover">
                            {book.cover_image
                              ? <img src={`${API}${book.cover_image}`} alt={book.title} />
                              : <span className="fav-cover-placeholder">📚</span>}
                            <button
                              className="fav-remove-btn"
                              onClick={() => removeFromFavorites(book.id)}
                              title="Retirer des favoris"
                            >♥</button>
                          </div>
                          <div className="fav-info">
                            <h4>{book.title}</h4>
                            <p>{book.author}</p>
                            {book.price && <span className="fav-price">{formatPrice(book.price)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* APERÇU DERNIÈRE COMMANDE */}
              {orders.length > 0 && (
                <div className="profile-card">
                  <div className="card-header">
                    <h2>Dernière commande</h2>
                    <button className="card-link" onClick={() => setActiveTab("orders")}>
                      Voir tout →
                    </button>
                  </div>
                  <div className="card-body">
                    {(() => {
                      const last = orders[0];
                      const { label, cls } = orderStatusLabel(last.status);
                      return (
                        <div className="order-item">
                          <div className="order-item-header">
                            <div className="order-meta">
                              <span className="order-ref">Commande #{last.id}</span>
                              <span className="order-date">{formatDate(last.created_at)}</span>
                            </div>
                            <span className={`order-badge ${cls}`}>{label}</span>
                          </div>
                          {last.items?.length > 0 && (
                            <div className="order-items">
                              {last.items.map((item, i) => (
                                <div key={i} className="order-book-row">
                                  <div className="order-book-thumb">
                                    {item.cover_image
                                      ? <img src={`${API}${item.cover_image}`} alt={item.title} />
                                      : <span>📖</span>}
                                  </div>
                                  <div className="order-book-details">
                                    <span className="order-book-title">{item.title}</span>
                                    <span className="order-book-qty">× {item.quantity || 1}</span>
                                  </div>
                                  <span className="order-book-price">{formatPrice(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="order-item-footer">
                            <span className="order-total-label">Total</span>
                            <span className="order-total-amount">{formatPrice(last.total)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* LIVRES EN COURS */}
              {books.length > 0 && (
                <div className="profile-card">
                  <div className="card-header">
                    <h2>Livres en cours</h2>
                    <span className="card-badge">{books.length}</span>
                  </div>
                  <div className="card-body">
                    <div className="book-list">
                      {books.map(book => (
                        <div key={book.id} className="book-progress-row">
                          <div className="book-progress-cover">
                            {book.cover_image
                              ? <img src={`${API}${book.cover_image}`} alt={book.title} />
                              : <span>📖</span>}
                          </div>
                          <div className="book-progress-info">
                            <span className="bk-title">{book.title}</span>
                            <span className="bk-author">{book.author}</span>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${book.progress || 0}%` }} />
                            </div>
                            <span className="progress-pct">{book.progress || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── FAVORITES ── */}
          {activeTab === "favorites" && (
            <div className="tab-panel" key="favorites">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Mes favoris</h2>
                  <span className="card-badge">{favorites.length} livre{favorites.length > 1 ? "s" : ""}</span>
                </div>
                <div className="card-body">
                  {favorites.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">♡</div>
                      <p>Vous n'avez pas encore de favoris.</p>
                      <p className="empty-sub">Ajoutez des livres depuis la bibliothèque !</p>
                    </div>
                  ) : (
                    <div className="favorites-grid">
                      {favorites.map(book => (
                        <div key={book.id} className="fav-card">
                          <div className="fav-cover">
                            {book.cover_image
                              ? <img src={`${API}${book.cover_image}`} alt={book.title} />
                              : <span className="fav-cover-placeholder">📚</span>}
                            <button
                              className="fav-remove-btn"
                              onClick={() => removeFromFavorites(book.id)}
                              title="Retirer des favoris"
                            >♥</button>
                          </div>
                          <div className="fav-info">
                            <h4>{book.title}</h4>
                            <p>{book.author}</p>
                            {book.price && <span className="fav-price">{formatPrice(book.price)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="tab-panel" key="orders">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Mes commandes</h2>
                  <span className="card-badge">{orders.length} commande{orders.length > 1 ? "s" : ""}</span>
                </div>
                <div className="card-body">
                  {orders.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <p>Aucune commande passée pour le moment.</p>
                      <p className="empty-sub">Vos commandes apparaîtront ici après le paiement.</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => {
                        const { label, cls } = orderStatusLabel(order.status);
                        return (
                          <div key={order.id} className="order-item">
                            <div className="order-item-header">
                              <div className="order-meta">
                                <span className="order-ref">Commande #{order.id}</span>
                                <span className="order-date">{formatDate(order.created_at)}</span>
                              </div>
                              <span className={`order-badge ${cls}`}>{label}</span>
                            </div>

                            {order.items?.length > 0 && (
                              <div className="order-items">
                                {order.items.map((item, i) => (
                                  <div key={i} className="order-book-row">
                                    <div className="order-book-thumb">
                                      {item.cover_image
                                        ? <img src={`${API}${item.cover_image}`} alt={item.title} />
                                        : <span>📖</span>}
                                    </div>
                                    <div className="order-book-details">
                                      <span className="order-book-title">{item.title}</span>
                                      <span className="order-book-qty">× {item.quantity || 1}</span>
                                    </div>
                                    <span className="order-book-price">{formatPrice(item.price)}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="order-item-footer">
                              <span className="order-total-label">Total</span>
                              <span className="order-total-amount">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ABONNEMENT ── */}
          {activeTab === "subscription" && (
            <div className="tab-panel" key="subscription">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Mon abonnement</h2>
                </div>
                <div className="card-body">
                  {!subscription ? (
                    <div className="empty-state">
                      <div className="empty-icon">⭐</div>
                      <p>Vous n'avez pas d'abonnement actif.</p>
                      <p className="empty-sub">Choisissez un plan pour accéder à toute notre bibliothèque.</p>
                      <button
                        className="profile-sub-cta"
                        onClick={() => navigate("/subscription")}
                      >
                        Voir les abonnements →
                      </button>
                    </div>
                  ) : (
                    <div className="profile-sub-panel">
                      {/* Badge plan */}
                      <div className="profile-sub-card" style={{"--plan-color": PLAN_COLORS[subscription.id] || "#3d5c3d"}}>
                        <div className="profile-sub-card__left">
                          <span className="profile-sub-card__icon">
                            {PLAN_ICONS[subscription.id] || "📖"}
                          </span>
                          <div>
                            <p className="profile-sub-card__label">Plan actuel</p>
                            <h3 className="profile-sub-card__name">{subscription.name}</h3>
                            <p className="profile-sub-card__date">
                              Abonné depuis le {new Date(subscription.subscribedAt).toLocaleDateString("fr-FR", {
                                day: "numeric", month: "long", year: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="profile-sub-card__right">
                          <span className="profile-sub-card__price">
                            {subscription.price?.toFixed(2)}€
                          </span>
                          <span className="profile-sub-card__per">{subscription.duration}</span>
                        </div>
                      </div>

                      {/* Fonctionnalités */}
                      {subscription.features?.length > 0 && (
                        <div className="profile-sub-features">
                          <h4>Inclus dans votre plan</h4>
                          <ul>
                            {subscription.features.map((f, i) => (
                              <li key={i}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="profile-sub-actions">
                        <button
                          className="profile-sub-upgrade"
                          onClick={() => navigate("/subscription")}
                        >
                          Changer de plan
                        </button>
                        <button
                          className="profile-sub-cancel"
                          onClick={unsubscribe}
                        >
                          Résilier l'abonnement
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}