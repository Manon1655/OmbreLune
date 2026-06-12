/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);

  const API = "http://localhost:8080";

  // 🔄 Charger abonnement depuis la BDD
  useEffect(() => {
    if (!user?.id) {
      setSubscription(null);
      return;
    }

    fetch(`${API}/auth/user/${user.id}/subscription`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSubscription(data);
        } else {
          setSubscription(null);
        }
      })
      .catch(() => setSubscription(null));
  }, [user]);

  // 💾 Souscrire (met à jour BDD + state)
  const subscribe = async (plan) => {
    if (!user?.id) return;

    await fetch(`${API}/auth/user/${user.id}/subscription`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_id: plan.id })
    });

    setSubscription(plan);
  };

  // ❌ Résilier
  const unsubscribe = async () => {
    if (!user?.id) return;

    await fetch(`${API}/auth/user/${user.id}/subscription`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_id: null })
    });

    setSubscription(null);
  };

  return (
    <SubscriptionContext.Provider
      value={{ subscription, subscribe, unsubscribe }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}
