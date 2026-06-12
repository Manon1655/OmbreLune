import { useNavigate } from "react-router-dom";
import "../styles/orderConfirmation.css";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  const orderNumber = "#" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
        
        <div className="confirmation-icon">
          🎉
        </div>

        <h1>Commande confirmée</h1>

        <p className="confirmation-sub">
          Merci pour votre achat.
        </p>

        <div className="order-number">
  <span className="order-label">Numéro de commande</span>
  <span className="order-id">{orderNumber}</span>
</div>

<button
  className="copy-btn"
  onClick={() => navigator.clipboard.writeText(orderNumber)}
>
  Copier
</button>

        <div className="confirmation-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/order-tracking")}
          >
            Suivre ma commande
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/library")}
          >
            Retour à la bibliothèque
          </button>
        </div>

      </div>
    </div>
  );
}