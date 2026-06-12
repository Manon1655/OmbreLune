import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/checkout.css";

const API = "http://localhost:8080";

const formatPrice = (n) =>
  Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const getCover = (item) => {
  if (item.cover_image) return item.cover_image.startsWith("http") ? item.cover_image : `${API}${item.cover_image}`;
  return item.cover || null;
};

export default function Checkout() {
  const { cart, clearCart, addOrder } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", zip: "",
    card: "", expiry: "", cvc: "",
  });
  const [errors, setErrors] = useState({});

  const total = cart.reduce((s, item) => s + Number(item.price), 0);

  /* ── Auto-format + field update ── */
  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === "card")   val = val.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    if (field === "expiry") { val = val.replace(/\D/g,"").slice(0,4); if (val.length > 2) val = val.slice(0,2)+"/"+val.slice(2); }
    if (field === "cvc")    val = val.replace(/\D/g,"").slice(0,3);
    setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name    = "Requis";
    if (!form.email.includes("@"))    e.email   = "Email invalide";
    if (!form.address.trim())         e.address = "Requis";
    if (!form.city.trim())            e.city    = "Requis";
    if (!form.zip.trim())             e.zip     = "Requis";
    if (form.card.replace(/\s/g,"").length < 16) e.card   = "Numéro invalide";
    if (form.expiry.length < 5)       e.expiry  = "MM/AA";
    if (form.cvc.length < 3)          e.cvc     = "3 chiffres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handlePayment = () => {
    if (!validate() || cart.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      addOrder(cart, total);
      clearCart();
      navigate("/order-confirmation");
    }, 2000);
  };

  /* ── Field component ── */
  const Field = ({ label, field, type = "text", placeholder, half }) => (
    <div className={`co-field${half ? " co-field--half" : ""}`}>
      <label className="co-label">{label}</label>
      <input
        className={`co-input${errors[field] ? " co-input--error" : ""}`}
        type={type} placeholder={placeholder}
        value={form[field]} onChange={set(field)} autoComplete="off"
      />
      {errors[field] && <span className="co-error">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="co-shell">

      {/* ══ HERO ══ */}
      <div className="co-hero">
        <div>
          <p className="co-hero__eyebrow">Finaliser ma commande</p>
          <h1 className="co-hero__title">Paiement sécurisé</h1>
        </div>
        <div className="co-steps">
          <div className="co-step co-step--done"><span>✓</span>Panier</div>
          <div className="co-step-line co-step-line--done"/>
          <div className="co-step co-step--active"><span>2</span>Paiement</div>
          <div className="co-step-line"/>
          <div className="co-step"><span>3</span>Confirmation</div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="co-body">

        {/* ── FORM COLUMN ── */}
        <div className="co-form-col">

          {/* Section 1 — Livraison */}
          <div className="co-section">
            <div className="co-section__head">
              <div className="co-section__num">1</div>
              <h2>Adresse de livraison</h2>
            </div>
            <div className="co-fields">
              <Field label="Nom complet" field="name"    placeholder="Jean Dupont" />
              <Field label="Email"       field="email"   placeholder="jean@exemple.com" type="email" />
              <Field label="Adresse"     field="address" placeholder="12 rue des Lilas" />
              <div className="co-row">
                <Field label="Ville"        field="city" placeholder="Paris"  half />
                <Field label="Code postal"  field="zip"  placeholder="75001"  half />
              </div>
            </div>
          </div>

          {/* Section 2 — Paiement */}
          <div className="co-section">
            <div className="co-section__head">
              <div className="co-section__num">2</div>
              <h2>Méthode de paiement</h2>
            </div>

            <div className="co-card-logos">
              <div className="co-card-logo co-card-logo--visa">VISA</div>
              <div className="co-card-logo co-card-logo--mc">MC</div>
              <div className="co-card-logo co-card-logo--cb">CB</div>
              <div className="co-card-logo co-card-logo--amex">AMEX</div>
            </div>

            <div className="co-fields">
              <Field label="Numéro de carte" field="card"   placeholder="1234 5678 9012 3456" />
              <div className="co-row">
                <Field label="Expiration" field="expiry" placeholder="MM/AA" half />
                <Field label="CVC"        field="cvc"    placeholder="•••"   half />
              </div>
            </div>

            <div className="co-secure-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Données chiffrées SSL 256-bit — jamais stockées
            </div>
          </div>

          {/* Pay button */}
          <button
            className={`co-pay-btn${loading ? " co-pay-btn--loading" : ""}`}
            onClick={handlePayment}
            disabled={loading || cart.length === 0}
          >
            {loading ? (
              <><span className="co-spinner"/> Traitement en cours…</>
            ) : (
              <>🔒 Payer {formatPrice(total)}</>
            )}
          </button>

          <div className="co-badges">
            <span>📦 Livraison 2-3j</span>
            <span>🔒 SSL sécurisé</span>
            <span>↩ Retour 30j</span>
          </div>

        </div>

        {/* ── SUMMARY ── */}
        <aside className="co-summary">

          <div className="co-summary__card">
            <h3>Votre commande</h3>

            <div className="co-summary__items">
              {cart.map(item => {
                const cover = getCover(item);
                return (
                  <div key={item.id} className="co-summary__item">
                    <div className="co-summary__cover">
                      {cover ? <img src={cover} alt={item.title}/> : <span>📚</span>}
                      <span className="co-summary__qty">1</span>
                    </div>
                    <div className="co-summary__item-info">
                      <p className="co-summary__item-title">{item.title}</p>
                      <p className="co-summary__item-author">{item.author}</p>
                    </div>
                    <span className="co-summary__item-price">{formatPrice(Number(item.price))}</span>
                  </div>
                );
              })}
            </div>

            <div className="co-summary__divider"/>

            <div className="co-summary__rows">
              <div className="co-summary__row">
                <span>Sous-total</span><span>{formatPrice(total)}</span>
              </div>
              <div className="co-summary__row">
                <span>Livraison</span><span className="co-free">Gratuite 🎁</span>
              </div>
            </div>

            <div className="co-summary__total">
              <span>Total TTC</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          {/* Garanties */}
          <div className="co-guarantees">
            {[
              { icon: "🔒", title: "Paiement sécurisé", sub: "Cryptage SSL 256 bits" },
              { icon: "📦", title: "Livraison offerte",  sub: "2 à 3 jours ouvrés" },
              { icon: "↩",  title: "Retour gratuit",    sub: "Sous 30 jours" },
            ].map(g => (
              <div key={g.title} className="co-guarantee">
                <span className="co-guarantee__icon">{g.icon}</span>
                <div>
                  <strong>{g.title}</strong>
                  <p>{g.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </aside>
      </div>
    </div>
  );
}