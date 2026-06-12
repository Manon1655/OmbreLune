import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/favorites.css";

const API = "http://localhost:8080";

const formatPrice = (n) =>
  Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const renderStars = (r = 0) =>
  "★".repeat(Math.floor(r)) + (r % 1 !== 0 ? "½" : "");

const SORTS = [
  { id: "added",  label: "Ajoutés récemment" },
  { id: "price-asc",  label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "alpha",  label: "A → Z" },
];

export default function Favorites() {
  const { favorites, removeFromFavorites, addToCart } = useCart();
  const navigate = useNavigate();
  const [sort, setSort]         = useState("added");
  const [addedMap, setAddedMap] = useState({});

  const handleCart = (e, book) => {
    e.stopPropagation();
    addToCart(book);
    setAddedMap(p => ({ ...p, [book.id]: true }));
    setTimeout(() => setAddedMap(p => ({ ...p, [book.id]: false })), 1800);
  };

  const sorted = [...favorites].sort((a, b) => {
    if (sort === "price-asc")  return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    if (sort === "alpha")      return a.title.localeCompare(b.title);
    return 0; // added = original order
  });

  const totalVal = favorites.reduce((s, b) => s + Number(b.price), 0);

  const getCover = (book) => {
    if (book.cover_image) return book.cover_image.startsWith("http") ? book.cover_image : `${API}${book.cover_image}`;
    return book.cover || null;
  };

  /* ── Empty ── */
  if (favorites.length === 0) {
    return (
      <div className="fav-shell fav-shell--empty">
        <div className="fav-empty-box">
          <div className="fav-empty-icon">
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M32 56S8 40 8 22a14 14 0 0 1 24-9.8A14 14 0 0 1 56 22c0 18-24 34-24 34z"
                stroke="#7a9e7e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Aucun favori pour l'instant</h1>
          <p>Explorez notre bibliothèque et ajoutez les livres qui vous font envie en cliquant sur ❤️</p>
          <button className="fav-cta-btn" onClick={() => navigate("/library")}>
            Découvrir la bibliothèque →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-shell">

      {/* ══ HERO BAND ══ */}
      <div className="fav-hero">
        <div className="fav-hero__left">
          <p className="fav-hero__eyebrow">Ma collection</p>
          <h1 className="fav-hero__title">Mes favoris</h1>
          <p className="fav-hero__sub">
            {favorites.length} livre{favorites.length > 1 ? "s" : ""} sélectionné{favorites.length > 1 ? "s" : ""} avec soin
          </p>
        </div>

        <div className="fav-hero__right">
          {/* Mini stack preview */}
          <div className="fav-hero__stack">
            {sorted.slice(0, 3).map((book, i) => {
              const cover = getCover(book);
              return (
                <div key={book.id} className="fav-hero__stack-book" style={{"--i": i}}>
                  {cover
                    ? <img src={cover} alt={book.title} />
                    : <div className="fav-stack-placeholder">📚</div>}
                </div>
              );
            })}
          </div>

          {/* Valeur totale */}
          <div className="fav-hero__total">
            <span>Valeur totale</span>
            <strong>{formatPrice(totalVal)}</strong>
          </div>
        </div>
      </div>

      {/* ══ TOOLBAR ══ */}
      <div className="fav-toolbar">
        <p className="fav-toolbar__label">
          <strong>{favorites.length}</strong> livre{favorites.length > 1 ? "s" : ""}
        </p>
        <div className="fav-toolbar__right">
          <span className="fav-sort-label">Trier par</span>
          <select
            className="fav-sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="fav-content">
        <div className="fav-grid">
          {sorted.map((book) => {
            const cover = getCover(book);
            return (
              <article key={book.id} className="fav-card">
                <div className="fav-card__img" onClick={() => navigate(`/book/${book.id}`)}>
                  {cover
                    ? <img src={cover} alt={book.title} loading="lazy" />
                    : <div className="fav-card__placeholder"><span>📚</span></div>}

                  {book.isBestseller && <span className="fav-card__ribbon">Best-seller</span>}

                  <button
                    className="fav-card__heart"
                    onClick={e => { e.stopPropagation(); removeFromFavorites(book.id); }}
                    title="Retirer des favoris"
                  >❤️</button>

                  <div className="fav-card__overlay">
                    <button onClick={() => navigate(`/book/${book.id}`)}>Voir le livre</button>
                  </div>
                </div>

                <div className="fav-card__body">
                  {book.category && <span className="fav-card__cat">{book.category}</span>}

                  <h3 className="fav-card__title" onClick={() => navigate(`/book/${book.id}`)}>
                    {book.title}
                  </h3>
                  <p className="fav-card__author">{book.author}</p>

                  {book.rating && (
                    <div className="fav-card__rating">
                      <span className="fav-card__stars">{renderStars(book.rating)}</span>
                      {book.reviews && <span className="fav-card__rev">({book.reviews.toLocaleString()})</span>}
                    </div>
                  )}

                  <div className="fav-card__footer">
                    <div className="fav-card__prices">
                      {book.originalPrice > book.price && (
                        <s className="fav-card__old">{formatPrice(book.originalPrice)}</s>
                      )}
                      <span className="fav-card__price">{formatPrice(book.price)}</span>
                    </div>

                    <button
                      className={`fav-card__cart ${addedMap[book.id] ? "fav-card__cart--ok" : ""}`}
                      onClick={e => handleCart(e, book)}
                    >
                      {addedMap[book.id] ? "✓ Ajouté" : "Ajouter au panier"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}