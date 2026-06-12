import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import books from "../data/books.js";
import "../styles/home.css";


/* ─── HELPERS ─── */
const stars  = r => "★".repeat(Math.floor(r || 0)) + (r % 1 !== 0 ? "½" : "");
const price  = n => Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

/* ─── DATA ─── */
const MOODS = [
  { id: "all",       label: "Tout voir",        icon: "✦"  },
  { id: "aventure",  label: "Aventure",          icon: "🧭"  },
  { id: "emotion",   label: "Émotion",           icon: "🌧"  },
  { id: "evasion",   label: "Évasion",           icon: "🌿"  },
  { id: "reflexion", label: "Réflexion",         icon: "🦉"  },
  { id: "frisson",   label: "Frissons",          icon: "🌙"  },
];
const MOOD_MAP = {
  aventure:  ["Aventure","Action","Science-Fiction","Fantasy"],
  emotion:   ["Roman","Romance","Drame","Jeunesse"],
  evasion:   ["Voyage","Nature","BD","Manga"],
  reflexion: ["Philosophie","Histoire","Essai","Biographie"],
  frisson:   ["Policier","Thriller","Horreur","Mystère"],
};
const getMood = (m, list) => {
  if (m === "all") return list;
  const cats = MOOD_MAP[m] || [];
  const f = list.filter(b => cats.includes(b.category));
  return f.length ? f : list;
};

const TESTI = [
  { name:"Camille R.", role:"Lectrice fidèle", text:"Une sélection vraiment soignée — je trouve toujours ma prochaine lecture ici. La qualité des coups de cœur est remarquable.", s:5 },
  { name:"Thomas M.",  role:"Abonné Premium",  text:"Interface magnifique, livraison rapide. Ma librairie préférée depuis deux ans. L'expérience est tout simplement irremplaçable.", s:5 },
  { name:"Sophie L.",  role:"Bibliophile",     text:"Les recommandations sont toujours excellentes. Je fais entièrement confiance au travail éditorial de cette maison.", s:5 },
];

/* ─── SVG ICONS ─── */
const IcSearch = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IcCart   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IcCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcHeart  = ({ on }) => <svg viewBox="0 0 24 24" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcBook   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IcArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m5 12h14M12 5l7 7-7 7"/></svg>;
const IcPlus   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();

  const [search,  setSearch]  = React.useState("");
  const [mood,    setMood]    = React.useState("all");
  const [page,    setPage]    = React.useState(0);
  const [added,   setAdded]   = React.useState({});

  /* derived */
  const featured   = books.filter(b => b.isBestseller).slice(0, 4);
  const nouveautes = [...books].reverse().slice(0, 6);
  const moodBooks  = getMood(mood, books).slice(0, 4);
  const categories = [...new Set(books.map(b => b.category))].sort().slice(0, 7);
  const PER_PAGE   = 4;
  const pages      = Math.ceil(books.length / PER_PAGE);
  const pageBooks  = books.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSearch = () => {
    if (search.trim()) navigate(`/library?search=${encodeURIComponent(search.trim())}`);
  };
  const toggleFav = (e, book) => {
    e.stopPropagation();
    isFavorite(book.id) ? removeFromFavorites(book.id) : addToFavorites(book);
  };
  const handleAdd = (e, book) => {
    e.stopPropagation();
    addToCart(book);
    setAdded(p => ({ ...p, [book.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1800);
  };

  /* ── Universal Book Card ── */
  const BookCard = ({ book, delay = 0 }) => (
    <article
      className="bc"
      style={{ animationDelay: `${delay}s` }}
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div className="bc__cover">
        {book.isBestseller && <span className="bc__ribbon">Best-seller</span>}
        <button className={`bc__fav${isFavorite(book.id)?" bc__fav--on":""}`} onClick={e=>toggleFav(e,book)}>
          <IcHeart on={isFavorite(book.id)} />
        </button>
        <img src={book.cover} alt={book.title} loading="lazy" />
        <div className="bc__overlay">
          <button className={`bc__add${added[book.id]?" bc__add--ok":""}`} onClick={e=>handleAdd(e,book)}>
            {added[book.id] ? <IcCheck/> : <IcCart/>}
          </button>
        </div>
      </div>
      <div className="bc__body">
        <span className="bc__cat">{book.category}</span>
        <h3  className="bc__title">{book.title}</h3>
        <p   className="bc__author">{book.author}</p>
        {book.rating && (
          <div className="bc__rating">
            <span className="bc__stars">{stars(book.rating)}</span>
            <span className="bc__revs">({book.reviews?.toLocaleString("fr-FR")})</span>
          </div>
        )}
        <div className="bc__foot">
          <div>
            {book.originalPrice > book.price && <s className="bc__old">{price(book.originalPrice)}</s>}
            <span className="bc__price">{price(book.price)}</span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <main className="home">

      {/* ════════════════════════════════════════
          HERO — split editorial
      ════════════════════════════════════════ */}
      <header className="hero" role="banner" aria-label="Bannière d'accueil">

        {/* Left */}
        <div className="hero__left">
          <div className="hero__overline">
            <div className="hero__overline-dash" />
            <span className="hero__overline-text">Librairie Ombrelune</span>
          </div>

          <p className="hero__number">N° de mars 2025 — Nouvelle sélection</p>

          <h1 className="hero__title">
            Des livres<br/>
            <em>choisis avec soin,</em>
            <strong>pour vous.</strong>
          </h1>

          <div className="hero__title-rule" />

          <p className="hero__sub">
            Chaque titre de notre collection a été sélectionné par des passionnés
            de littérature. Trouvez votre prochaine lecture préférée.
          </p>

          {/* Search */}
          <div className="hero__search" role="search" aria-label="Recherche de livres">
            <IcSearch />
            <input
              aria-label="Rechercher un titre, auteur ou genre"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Titre, auteur, genre…"
            />
            <button className="hero__search-btn" onClick={handleSearch} aria-label="Lancer la recherche">Chercher</button>
          </div>

          {/* Chips */}
          <div className="hero__chips">
            {categories.map(cat => (
              <button key={cat} className="hero__chip" onClick={() => navigate(`/library?category=${cat}`)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right — book stack */}
        <div className="hero__right">
          <div className="hero__stack">
            {featured.slice(0, 3).map((book, i) => (
              <div key={book.id} className="h-stack-book" onClick={() => navigate(`/book/${book.id}`)}>
                <img src={book.cover} alt={book.title} />
                {i === 0 && (
                  <div className="h-stack-label">
                    <div className="h-stack-label__eyebrow">Coup de cœur</div>
                    <div className="h-stack-label__title">{book.title}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hero__stats">
            <div className="hero__stat"><b>{books.length}</b><span>titres</span></div>
            <div className="hero__stat-sep" />
            <div className="hero__stat"><b>{categories.length}</b><span>genres</span></div>
            <div className="hero__stat-sep" />
            <div className="hero__stat"><b>4,8 ★</b><span>note moy.</span></div>
          </div>
        </div>

      </header>

      {/* ════════════════════════════════════════
          PROMO
      ════════════════════════════════════════ */}
      <div className="promo-banner" onClick={() => navigate("/subscription")}>
        <span className="promo-banner__label">Nouveauté</span>
        <p>
          <strong>Abonnement Ombrelune Premium</strong> — Accès illimité, livraison offerte, −10% sur tous les achats.
        </p>
        <span className="promo-banner__cta">En profiter →</span>
      </div>

      {/* ════════════════════════════════════════
          MAGAZINE GRID — COUPS DE CŒUR
          (asymmetric editorial layout)
      ════════════════════════════════════════ */}
      <section className="section section--ivory" role="region" aria-label="Sélection coups de coeur">
        <div className="inner">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">Notre sélection</p>
              <h2 className="sec-title">Coups de <em>cœur</em></h2>
            </div>
            <button className="sec-more" onClick={() => navigate("/library")}>
              Voir tout le catalogue <IcArrow />
            </button>
          </div>

          <div className="mag-grid">
            {/* Feature card — large left */}
            {featured[0] && (
              <div className="mag-card--feature" onClick={() => navigate(`/book/${featured[0].id}`)}>
                <img src={featured[0].cover} alt={featured[0].title} />
                <div className="mag-card__overlay">
                  <div className="mag-card__tag">Coup de cœur de la rédaction</div>
                  <div className="mag-card__title">{featured[0].title}</div>
                  <div className="mag-card__author">{featured[0].author}</div>
                  <div className="mag-card__actions">
                    <button className="mag-card__read" onClick={e => { e.stopPropagation(); navigate(`/book/${featured[0].id}`); }}>
                      <IcBook /> Lire l'extrait
                    </button>
                    <span className="mag-card__price-tag">{price(featured[0].price)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Two small cards right */}
            {featured.slice(1, 3).map(book => (
              <div key={book.id} className="mag-card--small" onClick={() => navigate(`/book/${book.id}`)}>
                <div className="mag-card--small__img">
                  <img src={book.cover} alt={book.title} />
                </div>
                <div className="mag-card--small__body">
                  <div className="mag-card--small__cat">{book.category}</div>
                  <div className="mag-card--small__title">{book.title}</div>
                  <div className="mag-card--small__author">{book.author}</div>
                  <div className="mag-card--small__foot">
                    <span className="mag-card--small__price">{price(book.price)}</span>
                    <button className="mag-card--small__add" onClick={e => handleAdd(e, book)}>
                      {added[book.id] ? <IcCheck/> : <IcPlus/>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          NOUVEAUTÉS — featured + numbered list
      ════════════════════════════════════════ */}
      <section className="section" role="region" aria-label="Nouveautes">
        <div className="inner">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">Vient de paraître</p>
              <h2 className="sec-title">Les <em>nouveautés</em></h2>
            </div>
            <button className="sec-more" onClick={() => navigate("/library")}>
              Tout le catalogue <IcArrow />
            </button>
          </div>

          <div className="nouv-grid">
            {/* Featured left */}
            <div className="nouv-feat" onClick={() => navigate(`/book/${nouveautes[0]?.id}`)}>
              <div className="nouv-feat__img">
                <img src={nouveautes[0]?.cover} alt={nouveautes[0]?.title} />
                <span className="nouv-feat__badge">Nouveau</span>
              </div>
              <div className="nouv-feat__body">
                <span className="nouv-feat__cat">{nouveautes[0]?.category}</span>
                <h3>{nouveautes[0]?.title}</h3>
                <p className="nouv-feat__author">{nouveautes[0]?.author}</p>
                <div className="nouv-feat__stars">{stars(nouveautes[0]?.rating)}</div>
                <p className="nouv-feat__desc">
                  {nouveautes[0]?.description?.slice(0, 155) ||
                   "Une nouvelle parution à ne pas manquer dans notre sélection du moment."}…
                </p>
                <div className="nouv-feat__foot">
                  <span className="nouv-feat__price">{price(nouveautes[0]?.price)}</span>
                  <button className="nouv-feat__btn" onClick={e => handleAdd(e, nouveautes[0])}>
                    <IcCart /> Ajouter au panier
                  </button>
                </div>
              </div>
            </div>

            {/* Numbered list right */}
            <div className="nouv-list">
              {nouveautes.slice(1, 5).map((book, i) => (
                <div key={book.id} className="nouv-item" onClick={() => navigate(`/book/${book.id}`)}>
                  <span className="nouv-item__n">{String(i + 1).padStart(2, "0")}</span>
                  <img src={book.cover} alt={book.title} className="nouv-item__cover" />
                  <div className="nouv-item__body">
                    <div className="nouv-item__cat">{book.category}</div>
                    <div className="nouv-item__title">{book.title}</div>
                    <div className="nouv-item__auth">{book.author}</div>
                  </div>
                  <div className="nouv-item__right">
                    <div className="nouv-item__price">{price(book.price)}</div>
                    <button
                      className={`nouv-item__fav${isFavorite(book.id)?" nouv-item__fav--on":""}`}
                      onClick={e => toggleFav(e, book)}
                    >
                      <IcHeart on={isFavorite(book.id)} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HUMEUR — tabbed mood filter
      ════════════════════════════════════════ */}
      <section className="section section--ivory" role="region" aria-label="Humeurs et recommandations">
        <div className="inner">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">Sélection personnalisée</p>
              <h2 className="sec-title">Votre <em>humeur</em> du moment</h2>
            </div>
          </div>

          <nav className="mood-nav">
            {MOODS.map(m => (
              <button
                key={m.id}
                className={`mood-tab${mood === m.id ? " mood-tab--on" : ""}`}
                onClick={() => setMood(m.id)}
              >
                <span className="mood-tab__icon">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </nav>

          <div className="g4">
            {moodBooks.map((book, i) => (
              <BookCard key={book.id} book={book} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TOUTE LA COLLECTION — carousel paginé
      ════════════════════════════════════════ */}
      <section className="section" role="region" aria-label="Collection complète">
        <div className="inner">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">{books.length} titres disponibles</p>
              <h2 className="sec-title">Notre <em>collection</em></h2>
            </div>
            <div className="car-ctrl">
              <button className="car-arrow" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>‹</button>
              <span  className="car-pg">{page + 1} / {pages}</span>
              <button className="car-arrow" onClick={() => setPage(p => p + 1 >= pages ? 0 : p + 1)}>›</button>
            </div>
          </div>

          <div className="g4">
            {pageBooks.map((book, i) => (
              <BookCard key={book.id} book={book} delay={i * 0.05} />
            ))}
          </div>

          <div className="car-dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} className={`car-dot${i === page ? " car-dot--on" : ""}`} onClick={() => setPage(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TÉMOIGNAGES — fond sombre
      ════════════════════════════════════════ */}
      <section className="section section--dark" role="region" aria-label="Temoignages lecteurs">
        <div className="inner">
          <div className="sec-head sec-head--center" style={{ marginBottom: 52 }}>
            <p className="sec-eyebrow">Ils nous font confiance</p>
            <h2 className="sec-title" style={{ marginTop: 0 }}>
              Ce que disent<br /><em>nos lecteurs</em>
            </h2>
          </div>

          <div className="testi-grid">
            {TESTI.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">{"★".repeat(t.s)}</div>
                <p   className="testi-text">« {t.text} »</p>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINALE
      ════════════════════════════════════════ */}
      <section className="cta-section" role="region" aria-label="Appel à l'action">
        <div className="inner">
          <span className="cta-ornament">❧</span>

          <h2 className="cta-title">
            Votre prochaine lecture<br />
            <em>vous attend.</em>
          </h2>

          <p className="cta-sub">
            Des milliers de titres soigneusement sélectionnés par des passionnés de littérature.
            <br />Livraison en 48h partout en France.
          </p>

          <div className="cta-btns">
            <button className="cta-btn cta-btn--fill" onClick={() => navigate("/library")}>
              <IcBook /> Explorer la bibliothèque
            </button>
            {!user && (
              <button className="cta-btn cta-btn--line" onClick={() => navigate("/register")}>
                Créer un compte gratuit
              </button>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}