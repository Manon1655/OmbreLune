import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderTracking.css";

export default function OrderTracking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(2); // étape actuelle

  const orderNumber = "#147514";
  const estimatedDate = "Livraison estimée : 22 Juin 2024";

  return (
    <div className="tracking-wrapper">
      <div className="tracking-container">

        {/* HEADER */}
        <div className="tracking-header">
          <h1>Suivi de commande</h1>
          <p>Commande {orderNumber}</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEPS */}
        <div className="steps-grid">

          <div className={`step ${step >= 1 ? "completed" : ""}`}>
            <div className="step-icon">✔</div>
            <div>
              <h4>Paiement validé</h4>
              <p>Votre paiement a été confirmé.</p>
            </div>
          </div>

          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-icon">📦</div>
            <div>
              <h4>Préparation en cours</h4>
              <p>Votre commande est en préparation.</p>
            </div>
          </div>

          <div className={`step ${step >= 3 ? "completed" : ""}`}>
            <div className="step-icon">🚚</div>
            <div>
              <h4>Expédiée</h4>
              <p>Votre colis a été expédié.</p>
            </div>
          </div>

          <div className={`step ${step >= 4 ? "completed" : ""}`}>
            <div className="step-icon">🏠</div>
            <div>
              <h4>Livrée</h4>
              <p>Colis livré à votre adresse.</p>
            </div>
          </div>

        </div>

        {/* DELIVERY CARD */}
        <div className="delivery-card">
          <div>
            <h3>Informations de livraison</h3>
            <p>{estimatedDate}</p>
            <p>Adresse : 12 Rue des Livres, Paris</p>
          </div>

          <button
            className="btn-back"
            onClick={() => navigate("/library")}
          >
            Retour à la bibliothèque
          </button>
        </div>

      </div>
    </div>
  );
}