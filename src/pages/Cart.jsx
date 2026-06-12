import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const API = "http://localhost:8080";

const formatPrice = (n) =>
  Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const getCover = (item) => {
  if (item.cover_image) return item.cover_image.startsWith("http") ? item.cover_image : `${API}${item.cover_image}`;
  return item.cover || null;
};

export default function Cart() {
  const { cart, removeFromCart, addToFavorites, isFavorite } = useCart();
  const navigate = useNavigate();

  const total      = cart.reduce((s, item) => s + Number(item.price), 0);
  const totalItems = cart.length;

  /* ── Empty ── */
  if (cart.length === 0) {
    return (
      <div className="cart-shell cart-shell--empty">
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M8 8h6l8 32h28l6-24H18" stroke="#6b8f6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="52" r="3" fill="#3d5c3d"/>
              <circle cx="44" cy="52" r="3" fill="#3d5c3d"/>
            </svg>
          </div>
          <h1>Votre panier est vide</h1>
          <p>Découvrez notre sélection et ajoutez les livres qui vous font envie.</p>
          <button className="cart-cta-btn" onClick={() => navigate("/library")}>
            Explorer la bibliothèque →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-shell">

      {/* ══ HERO BAND ══ */}
      <div className="cart-hero">
        <div>
          <p className="cart-hero__eyebrow">Mon panier</p>
          <h1 className="cart-hero__title">
            {totalItems} article{totalItems > 1 ? "s" : ""}
          </h1>
        </div>
        <div className="cart-hero__steps">
          <div className="cart-step cart-step--active">
            <span>1</span> Panier
          </div>
          <div className="cart-step-line" />
          <div className="cart-step">
            <span>2</span> Paiement
          </div>
          <div className="cart-step-line" />
          <div className="cart-step">
            <span>3</span> Confirmation
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="cart-content">

        {/* ── ITEMS ── */}
        <div className="cart-items">
          <div className="cart-items__header">
            <span>Livre</span>
            <span>Prix</span>
            <span>Qté</span>
            <span>Total</span>
            <span />
          </div>

          <div className="cart-list">
            {cart.map((item) => {
              const cover = getCover(item);
              const price = Number(item.price);

              return (
                <div key={item.id} className="cart-row">

                  {/* Cover */}
                  <div
                    className="cart-row__cover"
                    onClick={() => navigate(`/book/${item.id}`)}
                  >
                    {cover
                      ? <img src={cover} alt={item.title} />
                      : <div className="cart-row__cover-ph">📚</div>}
                  </div>

                  {/* Info */}
                  <div className="cart-row__info">
                    <h3 onClick={() => navigate(`/book/${item.id}`)}>{item.title}</h3>
                    <p>{item.author}</p>
                    {item.category && <span className="cart-row__cat">{item.category}</span>}

                    {/* Save for later */}
                    <button
                      className={`cart-row__save ${isFavorite(item.id) ? "cart-row__save--on" : ""}`}
                      onClick={() => addToFavorites(item)}
                    >
                      {isFavorite(item.id) ? "❤️ Dans les favoris" : "🤍 Sauvegarder"}
                    </button>
                  </div>

                  {/* Price */}
                  <div className="cart-row__price">{formatPrice(price)}</div>

                  {/* Qty */}
                  <div className="cart-row__qty">
                    <span className="cart-row__qty-badge">1</span>
                  </div>

                  {/* Line total */}
                  <div className="cart-row__total">{formatPrice(price)}</div>

                  {/* Remove */}
                  <button
                    className="cart-row__remove"
                    onClick={() => removeFromCart(item.id)}
                    title="Retirer du panier"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>

                </div>
              );
            })}
          </div>

          {/* Continuer */}
          <button className="cart-continue" onClick={() => navigate("/library")}>
            ← Continuer mes achats
          </button>
        </div>

        {/* ── SUMMARY ── */}
        <aside className="cart-summary">
          <h2>Récapitulatif</h2>

          <div className="cart-summary__lines">
            {cart.map(item => (
              <div key={item.id} className="cart-summary__line">
                <span>{item.title}</span>
                <span>{formatPrice(Number(item.price))}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary__divider" />

          <div className="cart-summary__row">
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="cart-summary__row cart-summary__row--delivery">
            <span>Livraison</span>
            <span className="cart-summary__free">Gratuite 🎁</span>
          </div>

          <div className="cart-summary__total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button
            className="cart-summary__checkout"
            onClick={() => navigate("/checkout")}
          >
            Procéder au paiement →
          </button>

          <div className="cart-summary__badges">
            <span>🔒 Paiement sécurisé</span>
            <span>↩ Retour 30j</span>
            <span>📦 Livraison 48h</span>
          </div>
        </aside>

      </div>
    </div>
  );
}