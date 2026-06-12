import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import booksData from "../data/books.js";
import "../styles/library.css";

const API_BASE = "http://localhost:8080";

const GENRES = [
  { id: "all",         label: "Tous les livres",    query: "popular books"           },
  { id: "roman",       label: "Romans",              query: "subject:fiction novel"   },
  { id: "scifi",       label: "Science-Fiction",     query: "subject:science fiction" },
  { id: "fantasy",     label: "Fantasy",             query: "subject:fantasy"         },
  { id: "thriller",    label: "Thriller & Polar",    query: "subject:thriller mystery"},
  { id: "romance",     label: "Romance",             query: "subject:romance love"    },
  { id: "histoire",    label: "Histoire",            query: "subject:history"         },
  { id: "biographie",  label: "Biographie",          query: "subject:biography"       },
  { id: "philosophie", label: "Philosophie",          query: "subject:philosophy"      },
  { id: "jeunesse",    label: "Jeunesse",            query: "subject:children juvenile"},
  { id: "classique",   label: "Classiques",          query: "subject:classics literature"},
];

const SORTS = [
  { id: "default",    label: "Par défaut" },
  { id: "price-asc",  label: "Prix ↑" },
  { id: "price-desc", label: "Prix ↓" },
  { id: "rating",     label: "Mieux notés" },
  { id: "alpha",      label: "A → Z" },
];

const formatPrice = (n) =>
  Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const renderStars = (r = 0) =>
  "★".repeat(Math.floor(r)) + (r % 1 !== 0 ? "½" : "");

const getCover = (book) => {
  if (book.cover_image) return book.cover_image.startsWith("http") ? book.cover_image : `${API_BASE}${book.cover_image}`;
  return book.cover || null;
};

export default function Library() {
  const { user } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const categoryFilter = searchParams.get("category") || "";

  const [searchTerm, setSearchTerm]   = useState(searchParams.get("search") || "");
  const [activeGenre, setActiveGenre] = useState(categoryFilter);
  const [sort, setSort]               = useState("default");
  const [priceMax, setPriceMax]       = useState(100);
  const [addedMap, setAddedMap]       = useState({});
  const [showModal, setShowModal]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [viewMode, setViewMode]       = useState("grid"); // grid | list
  const [newBook, setNewBook]         = useState({
    title:"", author:"", description:"", genre:"", price:0, rating:5, coverImage:"",
  });

  const allCategories = useMemo(
    () => [...new Set(booksData.map(b => b.category).filter(Boolean))].sort(),
    []
  );

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let list = [...booksData];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (activeGenre) list = list.filter(b => b.category === activeGenre);
    list = list.filter(b => Number(b.price) <= priceMax);
    if (sort === "price-asc")  list.sort((a,b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a,b) => Number(b.price) - Number(a.price));
    if (sort === "rating")     list.sort((a,b) => (b.rating||0) - (a.rating||0));
    if (sort === "alpha")      list.sort((a,b) => a.title.localeCompare(b.title));
    return list;
  }, [searchTerm, activeGenre, priceMax, sort]);

  const handleCart = (e, book) => {
    e.stopPropagation();
    addToCart(book);
    setAddedMap(p => ({ ...p, [book.id]: true }));
    setTimeout(() => setAddedMap(p => ({ ...p, [book.id]: false })), 1800);
  };

  const toggleFav = (e, book) => {
    e.stopPropagation();
    isFavorite(book.id) ? removeFromFavorites(book.id) : addToFavorites(book);
  };

  /* ── Add book ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook(p => ({ ...p, [name]: name === "price" || name === "rating" ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      if (res.ok) {
        setShowModal(false);
        setNewBook({ title:"",author:"",description:"",genre:"",price:0,rating:5,coverImage:"" });
      }
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  };

  /* ── Book card ── */
  const BookCard = ({ book }) => {
    const cover = getCover(book);
    const fav   = isFavorite(book.id);

    if (viewMode === "list") return (
      <div className="lb-row" onClick={() => navigate(`/book/${book.id}`)}>
        <div className="lb-row__img">
          {cover ? <img src={cover} alt={book.title}/> : <span className="lb-ph">📚</span>}
        </div>
        <div className="lb-row__info">
          <span className="lb-row__cat">{book.category}</span>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          {book.rating && <div className="lb-row__stars">{renderStars(book.rating)} <span>({book.reviews?.toLocaleString()})</span></div>}
        </div>
        <div className="lb-row__right">
          <div className="lb-row__prices">
            {book.originalPrice > book.price && <s>{formatPrice(book.originalPrice)}</s>}
            <strong>{formatPrice(book.price)}</strong>
          </div>
          <button className={`lb-row__fav ${fav ? "on":""}`} onClick={e=>toggleFav(e,book)}>{fav?"❤️":"🤍"}</button>
          <button className={`lb-row__cart ${addedMap[book.id]?"ok":""}`} onClick={e=>handleCart(e,book)}>
            {addedMap[book.id] ? "✓ Ajouté" : "+ Panier"}
          </button>
        </div>
      </div>
    );

    return (
      <article className="lb-card" onClick={() => navigate(`/book/${book.id}`)}>
        <div className="lb-card__img">
          {cover
            ? <img src={cover} alt={book.title} loading="lazy"/>
            : <div className="lb-ph">📚</div>}
          {book.isBestseller && <span className="lb-card__ribbon">Best-seller</span>}
          <button className={`lb-card__heart ${fav?"on":""}`} onClick={e=>toggleFav(e,book)} title={fav?"Retirer":"Favoris"}>
            {fav?"❤️":"🤍"}
          </button>
          <div className="lb-card__overlay">
            <button onClick={e=>{e.stopPropagation();navigate(`/book/${book.id}`);}}>Voir le livre</button>
          </div>
        </div>
        <div className="lb-card__body">
          {book.category && <span className="lb-card__cat">{book.category}</span>}
          <h3 className="lb-card__title">{book.title}</h3>
          <p  className="lb-card__author">{book.author}</p>
          {book.rating && (
            <div className="lb-card__rating">
              <span className="lb-card__stars">{renderStars(book.rating)}</span>
              <span className="lb-card__rev">({book.reviews?.toLocaleString()})</span>
            </div>
          )}
          <div className="lb-card__footer">
            <div className="lb-card__prices">
              {book.originalPrice > book.price && <s className="lb-card__old">{formatPrice(book.originalPrice)}</s>}
              <span className="lb-card__price">{formatPrice(book.price)}</span>
            </div>
            <button className={`lb-card__cart ${addedMap[book.id]?"ok":""}`} onClick={e=>handleCart(e,book)}>
              {addedMap[book.id] ? "✓" : "+"}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="lb-shell">

      {/* ══ HERO ══ */}
      <div className="lb-hero">
        <div className="lb-hero__text">
          <p className="lb-hero__eyebrow">Notre catalogue</p>
          <h1 className="lb-hero__title">
            {activeGenre ? activeGenre : "Bibliothèque"}
          </h1>
          <p className="lb-hero__sub">{booksData.length} titres soigneusement sélectionnés</p>
        </div>

        {/* Search */}
        <div className="lb-hero__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Titre, auteur…"
          />
          {searchTerm && (
            <button className="lb-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        {isAdmin && (
          <button className="lb-hero__add" onClick={() => setShowModal(true)}>
            + Ajouter un livre
          </button>
        )}
      </div>

      {/* ══ BODY ══ */}
      <div className="lb-body">

        {/* ── SIDEBAR FILTERS ── */}
        <aside className="lb-filters">
          <div className="lb-filters__section">
            <h3>Genres</h3>
            <div className="lb-genre-list">
              <button
                className={`lb-genre-btn ${!activeGenre ? "active":""}`}
                onClick={() => setActiveGenre("")}
              >
                Tous <span>{booksData.length}</span>
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  className={`lb-genre-btn ${activeGenre === cat ? "active":""}`}
                  onClick={() => setActiveGenre(cat === activeGenre ? "" : cat)}
                >
                  {cat}
                  <span>{booksData.filter(b => b.category === cat).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lb-filters__section">
            <h3>Prix max</h3>
            <div className="lb-price-range">
              <input
                type="range" min={5} max={100} step={5}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
              />
              <div className="lb-price-labels">
                <span>5 €</span>
                <span className="lb-price-val">{priceMax} €</span>
              </div>
            </div>
          </div>

          {(activeGenre || searchTerm || priceMax < 100) && (
            <button className="lb-reset" onClick={() => { setActiveGenre(""); setSearchTerm(""); setPriceMax(100); setSort("default"); }}>
              ✕ Réinitialiser
            </button>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main className="lb-main">

          {/* Toolbar */}
          <div className="lb-toolbar">
            <p className="lb-toolbar__count">
              <strong>{filtered.length}</strong> livre{filtered.length > 1 ? "s" : ""}
              {searchTerm && <> pour "<em>{searchTerm}</em>"</>}
            </p>
            <div className="lb-toolbar__right">
              <select className="lb-sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <div className="lb-view-toggle">
                <button className={viewMode==="grid"?"active":""} onClick={()=>setViewMode("grid")}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/>
                    <rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/>
                  </svg>
                </button>
                <button className={viewMode==="list"?"active":""} onClick={()=>setViewMode("list")}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="1" width="16" height="2" rx="1"/><rect x="0" y="7" width="16" height="2" rx="1"/>
                    <rect x="0" y="13" width="16" height="2" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Grid / List */}
          {filtered.length === 0 ? (
            <div className="lb-empty">
              <span>🔍</span>
              <h3>Aucun résultat</h3>
              <p>Essayez d'autres termes ou réinitialisez les filtres.</p>
              <button onClick={() => { setSearchTerm(""); setActiveGenre(""); setPriceMax(100); }}>
                Réinitialiser
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="lb-grid">
              {filtered.map(book => <BookCard key={book.id} book={book}/>)}
            </div>
          ) : (
            <div className="lb-list">
              {filtered.map(book => <BookCard key={book.id} book={book}/>)}
            </div>
          )}
        </main>
      </div>

      {/* ══ MODAL ADD BOOK ══ */}
      {showModal && (
        <div className="lb-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="lb-modal" onClick={e => e.stopPropagation()}>
            <div className="lb-modal__head">
              <h2>Ajouter un livre</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="lb-modal__form">
              <div className="lb-modal__row">
                <div className="lb-modal__field">
                  <label>Titre *</label>
                  <input name="title" value={newBook.title} onChange={handleChange} required/>
                </div>
                <div className="lb-modal__field">
                  <label>Auteur *</label>
                  <input name="author" value={newBook.author} onChange={handleChange} required/>
                </div>
              </div>
              <div className="lb-modal__field">
                <label>Genre *</label>
                <select name="genre" value={newBook.genre} onChange={handleChange} required>
                  <option value="">-- Sélectionnez --</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="lb-modal__field">
                <label>Description</label>
                <textarea name="description" value={newBook.description} onChange={handleChange} rows={3}/>
              </div>
              <div className="lb-modal__row">
                <div className="lb-modal__field">
                  <label>Prix (€)</label>
                  <input type="number" name="price" value={newBook.price} onChange={handleChange} min="0" step="0.01"/>
                </div>
                <div className="lb-modal__field">
                  <label>Note (/5)</label>
                  <input type="number" name="rating" value={newBook.rating} onChange={handleChange} min="0" max="5" step="0.1"/>
                </div>
              </div>
              <div className="lb-modal__field">
                <label>URL couverture</label>
                <input name="coverImage" value={newBook.coverImage} onChange={handleChange} placeholder="https://…"/>
              </div>
              <div className="lb-modal__actions">
                <button type="submit" disabled={loading}>{loading ? "Ajout…" : "Ajouter le livre"}</button>
                <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}