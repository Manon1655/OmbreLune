import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection immédiate vers la page d'accueil
    navigate("/home");
  }, [navigate]);

  return null;
}
