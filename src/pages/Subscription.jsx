import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionPlans, annualPlans } from '../data/subscriptions.js';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription.css';

const FAQS = [
  { q: "Puis-je changer de plan ?",          a: "Oui, upgrade ou downgrade à tout moment. Les changements sont effectifs immédiatement." },
  { q: "Y a-t-il une période d'essai ?",     a: "Oui ! 7 jours d'essai gratuit pour tester notre service sans engagement." },
  { q: "Puis-je annuler à tout moment ?",    a: "Bien sûr ! Annulez sans frais ni préavis, votre accès reste actif jusqu'à la fin de la période." },
  { q: "Quels moyens de paiement ?",         a: "Cartes bancaires, PayPal, Apple Pay et Google Pay." },
  { q: "Les audiolivres sont-ils inclus ?",  a: "Oui, dans les plans Premium et Illimité. Le plan Découverte propose un accès limité." },
  { q: "Téléchargement hors-ligne ?",        a: "Plans Premium et Illimité uniquement — téléchargement illimité pour lire sans connexion." },
];

const BENEFITS = [
  { icon: "📚", title: "10 000+ titres",      desc: "Tous les genres, toutes les langues, mis à jour chaque semaine." },
  { icon: "⚡", title: "Accès instantané",    desc: "Sur tous vos appareils — mobile, tablette, ordinateur." },
  { icon: "🎯", title: "Recommandations IA",  desc: "Des sélections adaptées à vos goûts et à votre humeur du moment." },
  { icon: "👥", title: "Partage familial",    desc: "Jusqu'à 5 profils inclus dans le plan Illimité." },
];

const PLAN_ICONS = { decouverte: "🌱", premium: "⭐", illimite: "♾️" };

export default function Subscription() {
  const { subscription, subscribe, unsubscribe } = useSubscription();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual]   = useState(false);
  const [openFaq, setOpenFaq]     = useState(null);
  const [confirming, setConfirming] = useState(null); // plan id being confirmed

  const plans = isAnnual ? annualPlans : subscriptionPlans;

  const handleSubscribe = async (plan) => {
    if (subscription?.id === plan.id) return;
    setConfirming(plan.id);
    await subscribe({
      id: plan.id, name: plan.name, price: plan.price,
      duration: plan.duration, features: plan.features,
      subscribedAt: new Date().toISOString(),
    });
    setConfirming(null);
  };

  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  return (
    <div className="sub-shell">

      {/* ══ HERO ══ */}
      <section className="sub-hero">
        <div className="sub-hero__inner">
          <p className="sub-hero__eyebrow">Plans & Tarifs</p>
          <h1 className="sub-hero__title">
            Lisez sans limites,<br/><em>au prix qui vous convient.</em>
          </h1>
          <p className="sub-hero__sub">
            Rejoignez des milliers de lecteurs qui ont choisi Ombrelune pour explorer
            des univers sans fin.
          </p>

          {/* Active sub banner */}
          {subscription && (
            <div className="sub-active-banner">
              <span>{PLAN_ICONS[subscription.id] || "✓"}</span>
              <div>
                <strong>Vous êtes abonné au plan {subscription.name}</strong>
                <p>Abonné depuis le {new Date(subscription.subscribedAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}</p>
              </div>
              <button onClick={() => navigate("/profile")}>Voir mon profil →</button>
            </div>
          )}
        </div>
      </section>

      {/* ══ TOGGLE ══ */}
      <div className="sub-toggle-wrap">
        <div className="sub-toggle">
          <button
            className={`sub-toggle__btn ${!isAnnual ? "active" : ""}`}
            onClick={() => setIsAnnual(false)}
          >
            Mensuel
          </button>
          <button
            className={`sub-toggle__btn ${isAnnual ? "active" : ""}`}
            onClick={() => setIsAnnual(true)}
          >
            Annuel
            <span className="sub-toggle__badge">−40%</span>
          </button>
        </div>
        {isAnnual && (
          <p className="sub-toggle__hint">💡 Facturé en une fois — économisez jusqu'à 40% par rapport au mensuel</p>
        )}
      </div>

      {/* ══ PLANS ══ */}
      <section className="sub-plans">
        {plans.map((plan) => {
          const isActive    = subscription?.id === plan.id;
          const isLoading   = confirming === plan.id;

          return (
            <div
              key={plan.id}
              className={`sub-card ${plan.popular ? "sub-card--popular" : ""} ${isActive ? "sub-card--active" : ""}`}
            >
              {plan.popular && !isActive && (
                <div className="sub-card__badge">⭐ Le plus populaire</div>
              )}
              {isActive && (
                <div className="sub-card__badge sub-card__badge--active">✓ Votre plan actuel</div>
              )}

              <div className="sub-card__head">
                <span className="sub-card__icon">{PLAN_ICONS[plan.id] || "📖"}</span>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>

              <div className="sub-card__pricing">
                {plan.originalPrice && (
                  <s className="sub-card__old">{plan.originalPrice.toFixed(2)}€</s>
                )}
                <div className="sub-card__price-row">
                  <span className="sub-card__price">{plan.price.toFixed(2)}€</span>
                  <span className="sub-card__per">{plan.duration}</span>
                </div>
                {plan.savings && (
                  <span className="sub-card__saving">Économisez {plan.savings}%</span>
                )}
              </div>

              <ul className="sub-card__features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="sub-card__actions">
                {isActive ? (
                  <>
                    <button className="sub-card__btn sub-card__btn--current" disabled>
                      ✓ Plan actuel
                    </button>
                    <button className="sub-card__cancel" onClick={handleUnsubscribe}>
                      Résilier l'abonnement
                    </button>
                  </>
                ) : (
                  <button
                    className={`sub-card__btn ${plan.popular ? "sub-card__btn--popular" : ""}`}
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><span className="sub-spinner"/>Activation…</>
                    ) : subscription ? (
                      `Passer à ${plan.name}`
                    ) : (
                      "Commencer — 7j gratuits"
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ══ BENEFITS ══ */}
      <section className="sub-benefits">
        <div className="sub-benefits__inner">
          <p className="sub-section__eyebrow">Pourquoi Ombrelune</p>
          <h2 className="sub-section__title">Tout ce dont un lecteur a besoin</h2>
          <div className="sub-benefits__grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="sub-benefit">
                <div className="sub-benefit__icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="sub-faq">
        <div className="sub-faq__inner">
          <p className="sub-section__eyebrow">Vos questions</p>
          <h2 className="sub-section__title">Foire aux questions</h2>
          <div className="sub-faq__list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`sub-faq__item ${openFaq === i ? "open" : ""}`}
              >
                <button
                  className="sub-faq__q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className="sub-faq__chevron">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="sub-faq__a">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BOTTOM ══ */}
      <section className="sub-cta">
        <h2>Prêt à plonger dans votre prochaine lecture ?</h2>
        <p>Commencez gratuitement pendant 7 jours. Aucune carte requise.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Choisir mon plan →
        </button>
      </section>

    </div>
  );
}