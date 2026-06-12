import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:8080";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  /* =========================
     AUTO LOGIN
  ========================= */

  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    if (!storedToken) return;

    const decoded = parseJwt(storedToken);

    if (!decoded) {
      localStorage.removeItem("token");
      return;
    }

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return;
    }

    setToken(storedToken);

    setUser({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

  }, []);

  /* =========================
     LOGIN
  ========================= */

  const login = async (data) => {

    try {

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        const text = await response.text().catch(() => null);
        console.error('Login: non-JSON response', text);
        return { error: 'Réponse invalide du serveur' };
      }

      if (!response.ok) {
        console.warn('Login failed:', result);
        return { error: result?.error || 'Erreur connexion' };
      }

      if (result.token) {
        const decoded = parseJwt(result.token);
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
      }

      return result;

    } catch (error) {
      console.error("Erreur login:", error);
      return { error: "Erreur serveur" };
    }

  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (data) => {

    try {

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        const text = await response.text().catch(() => null);
        console.error('Register: non-JSON response', text);
        return { error: 'Réponse invalide du serveur' };
      }

      if (!response.ok) {
        console.warn('Register failed:', result);
        return { error: result?.error || 'Erreur inscription' };
      }

      if (result.token) {
        const decoded = parseJwt(result.token);
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
      }

      return result;

    } catch (error) {
      console.error("Erreur register:", error);
      return { error: "Erreur serveur" };
    }

  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK (CORRIGÉ)
========================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}