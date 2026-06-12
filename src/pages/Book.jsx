import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";
import Comments from "../components/Comments";
import books from "../data/books.js";

/* ── Stars ── */
function Stars({ value, size = 16 }) {
  return (
    <span style={{ display:"inline-flex", gap:"3px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < Math.floor(value) ? "#c9a84c" : i < value ? "url(#h)" : "none"}
          stroke="#c9a84c" strokeWidth="1.5">
          {i < value && i >= Math.floor(value) && (
            <defs><linearGradient id="h"><stop offset="50%" stopColor="#c9a84c"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>
          )}
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

/* ── CSS Cover generator ── */
function CSSCover({ title, author, category }) {
  const palettes = [
    { bg:"linear-gradient(160deg,#1a2e1a 0%,#2d5230 45%,#1e3d20 100%)", accent:"#c9a84c" },
    { bg:"linear-gradient(160deg,#1a1a2e 0%,#2d2050 45%,#1a1535 100%)", accent:"#e8c96a" },
    { bg:"linear-gradient(160deg,#2e1a1a 0%,#5a2828 45%,#3d1e1e 100%)", accent:"#e8b87a" },
    { bg:"linear-gradient(160deg,#1a2535 0%,#1e3a5a 45%,#152840 100%)", accent:"#7ab8d4" },
    { bg:"linear-gradient(160deg,#2a1e0e 0%,#4a3218 45%,#3a2810 100%)", accent:"#d4a574" },
  ];
  const p = palettes[Math.abs((title?.length || 0) % palettes.length)];
  return (
    <div style={{
      width:"100%", aspectRatio:"2/3",
      background: p.bg,
      borderRadius:"3px 18px 18px 3px",
      display:"flex", flexDirection:"column",
      justifyContent:"space-between", padding:"28px 24px",
      position:"relative", overflow:"hidden",
      boxShadow:"10px 16px 50px rgba(0,0,0,.4), 2px 0 0 rgba(255,255,255,.04) inset, -2px 0 10px rgba(0,0,0,.5)",
    }}>
      {/* Texture */}
      {[...Array(16)].map((_,i) => (
        <div key={i} style={{ position:"absolute",left:0,right:0,top:`${(i+1)*6.25}%`,height:"1px",background:"rgba(255,255,255,.025)" }}/>
      ))}
      {/* Spine */}
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:"14px",background:"rgba(0,0,0,.3)" }}/>
      {/* Ornament */}
      <div style={{
        position:"absolute", top:"26%", left:"50%", transform:"translateX(-50%)",
        width:"55%", aspectRatio:"1", borderRadius:"50%",
        border:`1.5px solid ${p.accent}44`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{
          width:"74%", aspectRatio:"1", borderRadius:"50%",
          background:`radial-gradient(circle at 35% 30%, ${p.accent}88, ${p.accent}22)`,
          boxShadow:`0 0 36px ${p.accent}22`,
        }}/>
      </div>
      {/* Top label */}
      <div style={{ fontSize:"9px", letterSpacing:".22em", color:`${p.accent}99`, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:500, paddingLeft:"14px" }}>
        {category}
      </div>
      {/* Bottom */}
      <div style={{ paddingLeft:"14px" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(14px,2vw,19px)", fontWeight:600, color:"#f0e8d0", lineHeight:1.2, marginBottom:"10px", textShadow:"0 2px 8px rgba(0,0,0,.5)" }}>
          {title}
        </div>
        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"10px", fontWeight:400, letterSpacing:".12em", color:`${p.accent}cc`, textTransform:"uppercase" }}>
          {author}
        </div>
      </div>
    </div>
  );
}

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();
  const { subscription } = useSubscription();

  const [pageIdx,   setPageIdx]   = React.useState(0);
  const [inCart,    setInCart]    = React.useState(false);
  const [tab,       setTab]       = React.useState("apercu");
  const [likedMap,  setLikedMap]  = React.useState({});
  const [showForm,  setShowForm]  = React.useState(false);
  const [newReview, setNewReview] = React.useState({ name:"", text:"", rating:5 });
  const [reviews,   setReviews]   = React.useState([
    { id:1, name:"Jacques Leclerc",  initials:"JL", rating:5, date:"14 déc. 2024", text:"Une aventure épique ! Le Comte de Monte-Cristo est un immortel de la littérature française. Impossible de le lâcher.", likes:24 },
    { id:2, name:"Viviane Moreau",   initials:"VM", rating:5, date:"9 déc. 2024",  text:"Vengeance, action, amour… Tout y est. Un chef-d'œuvre absolu que je recommande à chacun. Relu trois fois.", likes:18 },
    { id:3, name:"Gustave Laurent",  initials:"GL", rating:5, date:"27 nov. 2024", text:"Dumas est un maître absolu. L'histoire la plus captivante jamais écrite, chaque page tient en haleine.", likes:31 },
    { id:4, name:"Laurence Dubois",  initials:"LD", rating:4, date:"21 nov. 2024", text:"Très long mais captivant du début à la fin. La longueur est une richesse, on s'attache profondément aux personnages.", likes:12 },
  ]);

  const book = books.find(b => b.id === parseInt(id));
  if (!book) return (
    <div style={{ padding:"120px 48px", textAlign:"center" }}>
      <h2>Livre introuvable</h2>
      <button onClick={() => navigate("/library")}>Retour</button>
    </div>
  );

  const preview   = book.preview || [];
  const canRead   = subscription?.plan;
  const fmt       = n => Number(n).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
  const ratingDist = [{s:5,p:72},{s:4,p:18},{s:3,p:6},{s:2,p:2},{s:1,p:2}];

  const handleCart = () => {
    addToCart(book);
    setInCart(true);
    setTimeout(() => setInCart(false), 2200);
  };

  const submitReview = () => {
    if (!newReview.text.trim() || !newReview.name.trim()) return;
    setReviews(p => [{
      id:Date.now(), name:newReview.name,
      initials:newReview.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
      rating:newReview.rating, date:"Aujourd'hui", text:newReview.text, likes:0,
    }, ...p]);
    setNewReview({ name:"", text:"", rating:5 });
    setShowForm(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
        :root{
          --bg:#f7f4ed; --bg-d:#ede9df; --white:#ffffff;
          --ink:#1a2218; --ink-m:#4a5a46; --ink-l:#8a9a86;
          --sage:#2d5a28; --sage-m:#4a7a44; --sage-l:rgba(45,90,40,.08);
          --gold:#c9a84c; --gold-l:rgba(201,168,76,.12);
          --rose:#c0554a;
          --border:rgba(45,90,40,.13); --border-s:rgba(45,90,40,.22);
          --shadow:0 2px 20px rgba(26,34,24,.07);
          --shadow-m:0 8px 40px rgba(26,34,24,.12);
          --shadow-l:0 20px 70px rgba(26,34,24,.16);
          --ease:cubic-bezier(.4,0,.2,1);
          --r:16px;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .bk { background:var(--bg); min-height:100vh; padding-top:106px; font-family:'Jost',sans-serif; }

        /* ── BACK ── */
        .bk-back {
          display:inline-flex; align-items:center; gap:8px;
          font-size:13px; font-weight:500; color:var(--ink-m);
          background:none; border:none; cursor:pointer;
          padding:10px 0; margin:0 0 40px;
          transition:color .2s; font-family:'Jost',sans-serif;
        }
        .bk-back:hover { color:var(--sage); }
        .bk-back svg { stroke:currentColor; }

        /* ── OUTER WRAP ── */
        .bk-outer { max-width:1240px; margin:0 auto; padding:48px 40px 80px; }

        /* ══════════════════════════════
           HERO — 2 col
        ══════════════════════════════ */
        .bk-hero {
          display:grid;
          grid-template-columns:300px 1fr;
          gap:72px;
          align-items:start;
          margin-bottom:80px;
        }

        /* Left — sticky */
        .bk-left { position:sticky; top:118px; }
        .bk-cover-wrap { position:relative; margin-bottom:24px; }
        .bk-cover-img { width:100%; height:340px; object-fit:cover; border-radius:3px 16px 16px 3px; display:block; box-shadow:10px 16px 50px rgba(0,0,0,.32), 2px 0 0 rgba(255,255,255,.04) inset; }
        .bk-cover-shadow {
          position:absolute; bottom:-18px; left:8%; right:8%;
          height:28px;
          background:radial-gradient(ellipse,rgba(0,0,0,.22) 0%,transparent 70%);
          filter:blur(10px);
        }

        /* Actions */
        .bk-actions { display:flex; flex-direction:column; gap:11px; margin-top:30px; }
        .bk-btn {
          width:100%; padding:14px 18px; border-radius:12px;
          font-family:'Jost',sans-serif; font-size:14px; font-weight:600;
          cursor:pointer; transition:all .22s var(--ease);
          display:flex; align-items:center; justify-content:center; gap:9px;
          letter-spacing:.015em; border:none;
        }
        .bk-btn--primary {
          background:var(--sage); color:#fff;
          box-shadow:0 4px 20px rgba(45,90,40,.28);
        }
        .bk-btn--primary:hover { background:var(--sage-m); box-shadow:0 6px 28px rgba(45,90,40,.38); transform:translateY(-1px); }
        .bk-btn--primary.done { background:#3d7a38; }
        .bk-btn--outline {
          background:var(--white); color:var(--ink-m);
          border:1.5px solid var(--border-s);
          box-shadow:var(--shadow);
        }
        .bk-btn--outline:hover { border-color:var(--sage); color:var(--sage); background:var(--sage-l); transform:translateY(-1px); }
        .bk-btn--fav svg { transition:fill .2s; }
        .bk-btn--fav.on { color:var(--rose); border-color:rgba(192,85,74,.3); }
        .bk-btn--fav.on svg { fill:var(--rose); stroke:var(--rose); }

        /* Price card */
        .bk-price-card {
          background:var(--white); border:1.5px solid var(--border);
          border-radius:12px; padding:16px 18px;
          display:flex; align-items:center; justify-content:space-between;
          box-shadow:var(--shadow); margin-bottom:14px;
        }
        .bk-price-lbl { font-size:11px; color:var(--ink-l); margin-bottom:3px; }
        .bk-price-val {
          font-family:'Cormorant Garamond',serif;
          font-size:30px; font-weight:600; color:var(--ink); line-height:1;
        }
        .bk-price-badge {
          font-size:11px; font-weight:600; color:var(--sage-m);
          background:rgba(45,90,40,.09); border:1px solid rgba(45,90,40,.18);
          padding:5px 11px; border-radius:20px;
        }

        /* Right — info */
        .bk-right {}
        .bk-chips { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
        .bk-chip {
          font-size:10.5px; font-weight:600; letter-spacing:.1em;
          text-transform:uppercase; padding:5px 13px; border-radius:20px;
          border:1px solid;
        }
        .bk-chip--sage { color:var(--sage-m); background:rgba(45,90,40,.07); border-color:rgba(45,90,40,.2); }
        .bk-chip--gold { color:#8a6820; background:rgba(201,168,76,.1); border-color:rgba(201,168,76,.3); }

        .bk-title {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(34px,4vw,58px); font-weight:600;
          color:var(--ink); line-height:1.05; letter-spacing:-.02em;
          margin-bottom:12px;
        }
        .bk-author {
          font-size:17px; color:var(--ink-m); margin-bottom:24px;
          font-weight:300;
        }
        .bk-author em { font-style:italic; font-family:'Cormorant Garamond',serif; font-size:19px; }

        .bk-rating-row {
          display:flex; align-items:center; gap:12px;
          margin-bottom:36px; padding-bottom:36px;
          border-bottom:1px solid var(--border);
        }
        .bk-rating-num {
          font-family:'Cormorant Garamond',serif;
          font-size:22px; font-weight:600; color:var(--ink);
        }
        .bk-rating-cnt { font-size:13px; color:var(--ink-l); }

        /* Meta strip */
        .bk-meta { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:32px; }
        .bk-meta-item {
          display:flex; align-items:center; gap:9px;
          padding:10px 16px; border-radius:10px;
          background:var(--white); border:1.5px solid var(--border);
          box-shadow:var(--shadow); flex-shrink:0;
        }
        .bk-meta-ico { font-size:17px; }
        .bk-meta-lbl { font-size:10.5px; color:var(--ink-l); display:block; }
        .bk-meta-val { font-size:13.5px; font-weight:600; color:var(--ink); display:block; margin-top:1px; }

        /* Description */
        .bk-desc {
          font-size:15.5px; line-height:1.8; color:var(--ink-m);
          font-weight:300; margin-bottom:28px;
          padding-left:20px;
          border-left:3px solid var(--sage);
        }

        /* Tags */
        .bk-tags { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:36px; }
        .bk-tag {
          padding:5px 14px; border-radius:20px;
          background:var(--bg-d); border:1px solid var(--border);
          font-size:12.5px; color:var(--ink-m);
        }

        /* Sub banner */
        .bk-sub {
          display:flex; align-items:center; gap:16px;
          padding:18px 22px; border-radius:14px;
          background:linear-gradient(90deg,rgba(45,90,40,.07),rgba(45,90,40,.03));
          border:1.5px solid rgba(45,90,40,.18);
        }
        .bk-sub__ico { font-size:24px; flex-shrink:0; }
        .bk-sub__t { font-size:13.5px; font-weight:600; color:var(--sage); margin-bottom:2px; }
        .bk-sub__s { font-size:12px; color:var(--ink-l); }
        .bk-sub__btn {
          flex-shrink:0; padding:9px 18px; border-radius:9px;
          background:var(--sage); color:#fff; border:none;
          font-family:'Jost',sans-serif; font-size:13px; font-weight:600;
          cursor:pointer; transition:background .2s;
          white-space:nowrap;
        }
        .bk-sub__btn:hover { background:var(--sage-m); }

        /* ══════════════════════════════
           TABS
        ══════════════════════════════ */
        .bk-tabs {
          display:flex; gap:0;
          border-bottom:2px solid var(--border);
          margin-bottom:52px;
        }
        .bk-tab {
          padding:15px 28px; background:none; border:none; cursor:pointer;
          font-family:'Jost',sans-serif; font-size:14.5px; font-weight:500;
          color:var(--ink-l); position:relative; transition:color .2s;
        }
        .bk-tab:hover { color:var(--ink-m); }
        .bk-tab.on { color:var(--sage); }
        .bk-tab.on::after {
          content:''; position:absolute; bottom:-2px; left:0; right:0;
          height:2.5px; background:var(--sage); border-radius:3px 3px 0 0;
        }
        .bk-tab-cnt {
          display:inline-flex; align-items:center; justify-content:center;
          width:21px; height:21px; border-radius:50%;
          background:var(--sage-l); color:var(--sage);
          font-size:10.5px; font-weight:700; margin-left:7px;
        }

        /* ══════════════════════════════
           APERÇU
        ══════════════════════════════ */
        .bk-reader {
          background:var(--white);
          border:1.5px solid var(--border);
          border-radius:var(--r);
          box-shadow:var(--shadow-l);
          overflow:hidden;
        }
        .bk-reader-top {
          padding:28px 40px;
          border-bottom:1px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          background:var(--bg-d);
        }
        .bk-reader-chap {
          font-size:10.5px; font-weight:600; letter-spacing:.14em;
          text-transform:uppercase; color:var(--ink-l); margin-bottom:4px;
        }
        .bk-reader-title {
          font-family:'Cormorant Garamond',serif;
          font-size:26px; font-weight:500; color:var(--ink); font-style:italic;
        }
        .bk-reader-dots { display:flex; gap:7px; }
        .bk-reader-dot {
          width:9px; height:9px; border-radius:50%; cursor:pointer;
          background:var(--border); border:none; transition:background .2s;
          padding:0;
        }
        .bk-reader-dot.on { background:var(--sage); }

        .bk-reader-body {
          padding:52px 64px;
          font-family:'Cormorant Garamond',serif;
          font-size:18px; line-height:1.95;
          color:#2a3228;
          max-height:480px; overflow-y:auto;
          scrollbar-width:thin; scrollbar-color:var(--border) transparent;
          text-align:justify;
        }
        .bk-reader-body p { margin-bottom:1.5em; text-indent:2.5em; }
        .bk-reader-body p:first-child { text-indent:0; }
        .bk-reader-body p:first-child::first-letter {
          font-size:3.4em; font-weight:600; float:left;
          line-height:.82; margin-right:.1em; margin-top:.04em;
          color:var(--sage); font-family:'Cormorant Garamond',serif;
        }

        .bk-reader-nav {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 40px;
          border-top:1px solid var(--border);
          background:var(--bg-d);
        }
        .bk-reader-nav-btn {
          display:flex; align-items:center; gap:7px;
          padding:10px 20px; border-radius:10px;
          border:1.5px solid var(--border); background:var(--white);
          font-family:'Jost',sans-serif; font-size:13px; font-weight:500;
          color:var(--ink-m); cursor:pointer; transition:all .18s;
        }
        .bk-reader-nav-btn:hover:not(:disabled) { border-color:var(--sage); color:var(--sage); }
        .bk-reader-nav-btn:disabled { opacity:.3; cursor:default; }
        .bk-reader-nav-btn--next { background:var(--sage); color:#fff; border-color:var(--sage); }
        .bk-reader-nav-btn--next:hover { background:var(--sage-m) !important; }
        .bk-reader-pg { font-size:12px; color:var(--ink-l); }

        /* Gate */
        .bk-gate {
          padding:40px; text-align:center;
          border-top:1px solid var(--border);
          background:linear-gradient(180deg,transparent,var(--bg-d) 60%);
        }
        .bk-gate p { font-size:14px; color:var(--ink-l); margin-bottom:16px; }

        /* ══════════════════════════════
           AVIS
        ══════════════════════════════ */
        .bk-rating-summary {
          display:grid; grid-template-columns:180px 1fr;
          gap:48px; align-items:center;
          padding:36px; background:var(--white);
          border:1.5px solid var(--border); border-radius:var(--r);
          margin-bottom:32px; box-shadow:var(--shadow);
        }
        .bk-rs-big { text-align:center; }
        .bk-rs-big__n {
          font-family:'Cormorant Garamond',serif;
          font-size:72px; font-weight:600; color:var(--ink); line-height:1;
        }
        .bk-rs-big__t { font-size:12px; color:var(--ink-l); margin-top:8px; }
        .bk-rs-bars { display:flex; flex-direction:column; gap:10px; }
        .bk-rs-bar { display:flex; align-items:center; gap:12px; }
        .bk-rs-bar-s { font-size:12px; color:var(--ink-l); width:28px; text-align:right; flex-shrink:0; }
        .bk-rs-bar-track { flex:1; height:8px; background:var(--bg-d); border-radius:4px; overflow:hidden; }
        .bk-rs-bar-fill { height:100%; background:linear-gradient(90deg,#c9a84c,#e8d49a); border-radius:4px; transition:width .7s var(--ease); }
        .bk-rs-bar-pct { font-size:12px; color:var(--ink-l); width:38px; flex-shrink:0; }

        /* Review head */
        .bk-reviews-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
        .bk-reviews-title {
          font-family:'Cormorant Garamond',serif;
          font-size:24px; font-weight:600; color:var(--ink);
        }
        .bk-add-btn {
          display:flex; align-items:center; gap:8px;
          padding:11px 22px; border-radius:11px;
          background:var(--sage); color:#fff; border:none;
          font-family:'Jost',sans-serif; font-size:13.5px; font-weight:600;
          cursor:pointer; transition:all .2s;
          box-shadow:0 3px 14px rgba(45,90,40,.25);
        }
        .bk-add-btn:hover { background:var(--sage-m); transform:translateY(-1px); }

        /* Form */
        .bk-form {
          background:var(--white); border:1.5px solid var(--border);
          border-radius:var(--r); padding:28px 32px; margin-bottom:24px;
          box-shadow:var(--shadow);
          animation:fi .22s var(--ease) both;
        }
        @keyframes fi { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .bk-form-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); margin-bottom:22px; }
        .bk-form-row { margin-bottom:18px; }
        .bk-form-lbl { font-size:11.5px; font-weight:600; color:var(--ink-m); letter-spacing:.05em; margin-bottom:7px; display:block; }
        .bk-form-input {
          width:100%; padding:12px 15px; border-radius:10px;
          border:1.5px solid var(--border); background:var(--bg-d);
          font-family:'Jost',sans-serif; font-size:14px; color:var(--ink);
          outline:none; transition:all .2s;
        }
        .bk-form-input:focus { border-color:var(--sage); background:var(--white); box-shadow:0 0 0 3px rgba(45,90,40,.08); }
        .bk-form-ta { min-height:110px; resize:vertical; }
        .bk-form-stars { display:flex; gap:8px; cursor:pointer; }
        .bk-form-star { font-size:26px; transition:transform .15s; }
        .bk-form-star:hover { transform:scale(1.18); }
        .bk-form-row-btns { display:flex; gap:10px; justify-content:flex-end; margin-top:22px; }
        .bk-form-cancel {
          padding:10px 22px; border-radius:10px;
          border:1.5px solid var(--border); background:var(--white);
          font-family:'Jost',sans-serif; font-size:13px; font-weight:500;
          color:var(--ink-m); cursor:pointer; transition:all .18s;
        }
        .bk-form-cancel:hover { border-color:var(--ink-m); }
        .bk-form-submit {
          padding:10px 24px; border-radius:10px;
          background:var(--sage); color:#fff; border:none;
          font-family:'Jost',sans-serif; font-size:13px; font-weight:600;
          cursor:pointer; transition:all .2s;
        }
        .bk-form-submit:hover { background:var(--sage-m); }

        /* Review cards */
        .bk-review {
          background:var(--white); border:1.5px solid var(--border);
          border-radius:var(--r); padding:26px 30px; margin-bottom:16px;
          box-shadow:var(--shadow); transition:all .25s var(--ease);
        }
        .bk-review:hover { box-shadow:var(--shadow-m); transform:translateY(-2px); }
        .bk-review-top { display:flex; align-items:flex-start; gap:14px; margin-bottom:16px; }
        .bk-review-ava {
          width:46px; height:46px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,var(--sage),var(--sage-m));
          display:flex; align-items:center; justify-content:center;
          font-family:'Cormorant Garamond',serif;
          font-size:19px; font-weight:600; color:#fff;
          box-shadow:0 3px 10px rgba(45,90,40,.22);
        }
        .bk-review-name { font-size:15px; font-weight:600; color:var(--ink); margin-bottom:5px; }
        .bk-review-sub { display:flex; align-items:center; gap:10px; }
        .bk-review-date { font-size:11.5px; color:var(--ink-l); }
        .bk-review-verified {
          font-size:10.5px; font-weight:500; color:var(--sage-m);
          background:var(--sage-l); padding:2px 8px; border-radius:10px;
        }
        .bk-review-text {
          font-size:15px; line-height:1.78; color:var(--ink-m);
          font-weight:300; margin-bottom:16px;
          font-family:'Cormorant Garamond',serif;
        }
        .bk-review-foot { display:flex; align-items:center; gap:14px; }
        .bk-like-btn {
          display:flex; align-items:center; gap:6px;
          padding:6px 14px; border-radius:20px;
          border:1.5px solid var(--border); background:transparent;
          font-family:'Jost',sans-serif; font-size:12px; color:var(--ink-l);
          cursor:pointer; transition:all .18s;
        }
        .bk-like-btn:hover { border-color:var(--rose); color:var(--rose); }
        .bk-like-btn.on { border-color:var(--rose); color:var(--rose); background:rgba(192,85,74,.06); }
        .bk-like-btn svg { stroke:currentColor; }
        .bk-report-btn { font-size:12px; color:var(--ink-l); background:none; border:none; cursor:pointer; transition:color .18s; font-family:'Jost',sans-serif; }
        .bk-report-btn:hover { color:var(--ink-m); }

        /* No preview */
        .bk-no-preview { padding:60px; text-align:center; color:var(--ink-l); font-size:15px; }

        @media(max-width:900px){
          .bk-hero{grid-template-columns:1fr;gap:40px;}
          .bk-left{position:static;}
          .bk-reader-body{padding:32px;}
          .bk-rating-summary{grid-template-columns:1fr;gap:24px;}
        }
      `}</style>

      <div className="bk">
        <div className="bk-outer">

          {/* Back */}
          <button className="bk-back" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Retour à la bibliothèque
          </button>

          {/* ══ HERO ══ */}
          <div className="bk-hero">

            {/* LEFT */}
            <div className="bk-left">
              <div className="bk-cover-wrap">
                {book.cover
                  ? <img src={book.cover} alt={book.title} className="bk-cover-img" />
                  : <CSSCover title={book.title} author={book.author} category={book.category}/>
                }
                <div className="bk-cover-shadow"/>
              </div>

              {/* Price */}
              <div className="bk-price-card">
                <div>
                  <div className="bk-price-lbl">Prix unitaire</div>
                  <div className="bk-price-val">{fmt(book.price)}</div>
                </div>
                <span className="bk-price-badge">Inclus Premium</span>
              </div>

              {/* Actions */}
              <div className="bk-actions">
                <button className={`bk-btn bk-btn--primary${inCart?" done":""}`} onClick={handleCart}>
                  {inCart ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Ajouté au panier</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Ajouter au panier</>
                  )}
                </button>
                <button className={`bk-btn bk-btn--outline bk-btn--fav${isFavorite(book.id)?" on":""}`} onClick={() => isFavorite(book.id) ? removeFromFavorites(book.id) : addToFavorites(book)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite(book.id)?"var(--rose)":"none"} stroke="var(--rose)" strokeWidth="2" strokeLinecap="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {isFavorite(book.id) ? "Retiré des favoris" : "Ajouter aux favoris"}
                </button>

              </div>
            </div>

            {/* RIGHT */}
            <div className="bk-right">
              <div className="bk-chips">
                <span className="bk-chip bk-chip--sage">{book.category}</span>
                {book.isBestseller && <span className="bk-chip bk-chip--gold">⭐ Best-seller</span>}
              </div>

              <h1 className="bk-title">{book.title}</h1>
              <div className="bk-author">Par <em>{book.author}</em></div>

              <div className="bk-rating-row">
                <Stars value={book.rating} size={20}/>
                <span className="bk-rating-num">{book.rating}</span>
                <span className="bk-rating-cnt">{book.reviews?.toLocaleString("fr-FR")} avis</span>
              </div>

              {/* Meta */}
              <div className="bk-meta">
                {[
                  { ico:"📅", lbl:"Édition", val: book.year || "1844" },
                  { ico:"📄", lbl:"Pages",   val: book.pages ? `${book.pages} p.` : "1 276 p." },
                  { ico:"🌍", lbl:"Langue",  val:"Français" },
                  { ico:"⏱️", lbl:"Durée",   val:"~42h" },
                ].map(m => (
                  <div key={m.lbl} className="bk-meta-item">
                    <span className="bk-meta-ico">{m.ico}</span>
                    <div>
                      <span className="bk-meta-lbl">{m.lbl}</span>
                      <span className="bk-meta-val">{m.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="bk-desc">{book.description || "Une œuvre incontournable de la littérature mondiale, portée par une intrigue captivante et des personnages inoubliables."}</p>

              <div className="bk-tags">
                {(book.tags || ["Aventure","Classique","Roman historique","Vengeance"]).map(t => (
                  <span key={t} className="bk-tag">{t}</span>
                ))}
              </div>

              {/* Sub banner */}
              <div className="bk-sub">
                <span className="bk-sub__ico">♾️</span>
                <div>
                  <div className="bk-sub__t">Inclus dans l'abonnement Illimité</div>
                  <div className="bk-sub__s">Accès à plus de 6 000 titres dès 14,99 €/mois</div>
                </div>
                <button className="bk-sub__btn" onClick={() => navigate("/subscription")}>S'abonner</button>
              </div>
            </div>
          </div>

          {/* ══ TABS ══ */}
          <div className="bk-tabs">
            {[
              { id:"apercu",  label:"Extrait" },
              { id:"avis",    label:"Avis lecteurs", cnt:reviews.length },
            ].map(t => (
              <button key={t.id} className={`bk-tab${tab===t.id?" on":""}`} onClick={() => setTab(t.id)}>
                {t.label}
                {t.cnt && <span className="bk-tab-cnt">{t.cnt}</span>}
              </button>
            ))}
          </div>

          {/* ══ APERÇU ══ */}
          {tab === "apercu" && (
            <div style={{ animation:"fi .22s var(--ease) both" }}>
              {preview.length > 0 ? (
                <div className="bk-reader">
                  <div className="bk-reader-top">
                    <div>
                      <div className="bk-reader-chap">Chapitre {pageIdx + 1} / {preview.length}</div>
                      <div className="bk-reader-title">{preview[pageIdx].title || `Chapitre ${pageIdx + 1}`}</div>
                    </div>
                    <div className="bk-reader-dots">
                      {preview.map((_,i) => (
                        <button key={i} className={`bk-reader-dot${i===pageIdx?" on":""}`} onClick={() => setPageIdx(i)}/>
                      ))}
                    </div>
                  </div>

                  <div className="bk-reader-body">
                    {String(preview[pageIdx].content || "").split("\n\n").map((p,i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <div className="bk-reader-nav">
                    <button className="bk-reader-nav-btn" disabled={pageIdx===0} onClick={() => setPageIdx(p=>p-1)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
                      Précédent
                    </button>
                    <span className="bk-reader-pg">Chapitre {pageIdx+1} / {preview.length}</span>
                    {pageIdx < preview.length - 1 ? (
                      <button className="bk-reader-nav-btn bk-reader-nav-btn--next" onClick={() => setPageIdx(p=>p+1)}>
                        Suivant
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    ) : (
                      <div className="bk-gate">
                        {!canRead && <p>Pour continuer la lecture, souscrivez à un abonnement.</p>}
                        <button className="bk-sub__btn" style={{ padding:"11px 26px",borderRadius:"11px",fontSize:"14px" }} onClick={() => navigate("/subscription")}>
                          Voir les abonnements →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bk-no-preview">📖 Aucun extrait disponible pour ce livre.</div>
              )}
            </div>
          )}

          {/* ══ AVIS ══ */}
          {tab === "avis" && (
            <div style={{ animation:"fi .22s var(--ease) both" }}>

              {/* Rating summary */}
              <div className="bk-rating-summary">
                <div className="bk-rs-big">
                  <div className="bk-rs-big__n">{book.rating}</div>
                  <Stars value={book.rating} size={18}/>
                  <div className="bk-rs-big__t">{book.reviews?.toLocaleString("fr-FR")} avis</div>
                </div>
                <div className="bk-rs-bars">
                  {ratingDist.map(r => (
                    <div key={r.s} className="bk-rs-bar">
                      <div className="bk-rs-bar-s">{r.s}★</div>
                      <div className="bk-rs-bar-track">
                        <div className="bk-rs-bar-fill" style={{ width:`${r.p}%` }}/>
                      </div>
                      <div className="bk-rs-bar-pct">{r.p}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Head */}
              <div className="bk-reviews-head">
                <div className="bk-reviews-title">
                  Avis lecteurs <span style={{ color:"var(--ink-l)", fontSize:"18px", fontWeight:400 }}>({reviews.length})</span>
                </div>
                <button className="bk-add-btn" onClick={() => setShowForm(p=>!p)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Laisser un avis
                </button>
              </div>

              {/* Form */}
              {showForm && (
                <div className="bk-form">
                  <div className="bk-form-title">Votre avis</div>
                  <div className="bk-form-row">
                    <label className="bk-form-lbl">Votre nom</label>
                    <input className="bk-form-input" placeholder="Jean Dupont"
                      value={newReview.name} onChange={e => setNewReview(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-lbl">Note</label>
                    <div className="bk-form-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="bk-form-star"
                          onClick={() => setNewReview(p=>({...p,rating:s}))}>
                          {s <= newReview.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-lbl">Commentaire</label>
                    <textarea className="bk-form-input bk-form-ta"
                      placeholder="Partagez votre expérience de lecture…"
                      value={newReview.text} onChange={e => setNewReview(p=>({...p,text:e.target.value}))}/>
                  </div>
                  <div className="bk-form-row-btns">
                    <button className="bk-form-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                    <button className="bk-form-submit" onClick={submitReview}>Publier</button>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.map(r => (
                <div key={r.id} className="bk-review">
                  <div className="bk-review-top">
                    <div className="bk-review-ava">{r.initials}</div>
                    <div>
                      <div className="bk-review-name">{r.name}</div>
                      <div className="bk-review-sub">
                        <Stars value={r.rating} size={13}/>
                        <span className="bk-review-date">{r.date}</span>
                        <span className="bk-review-verified">✓ Achat vérifié</span>
                      </div>
                    </div>
                  </div>
                  <p className="bk-review-text">{r.text}</p>
                  <div className="bk-review-foot">
                    <button
                      className={`bk-like-btn${likedMap[r.id]?" on":""}`}
                      onClick={() => setLikedMap(p=>({...p,[r.id]:!p[r.id]}))}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24"
                        fill={likedMap[r.id]?"currentColor":"none"} strokeWidth="2" strokeLinecap="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      {r.likes + (likedMap[r.id]?1:0)} utile{r.likes+(likedMap[r.id]?1:0)>1?"s":""}
                    </button>
                    <button className="bk-report-btn">Signaler</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}