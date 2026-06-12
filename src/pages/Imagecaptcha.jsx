import { useState, useCallback, useEffect } from "react";
import "../styles/captcha.css";

/* ═══════════════════════════════════════════════
   BANQUE DE DÉFIS  (images Unsplash, seed fixes)
═══════════════════════════════════════════════ */
const CHALLENGES = [
  {
    label: "plages",
    instruction: "Sélectionnez toutes les photos de plage",
    emoji: "🏖️",
    images: [
      { id:"pl1", url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"pl2", url:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"pl3", url:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"pl4", url:"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"pl5", url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"pl6", url:"https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"pl7", url:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"pl8", url:"https://images.unsplash.com/photo-1533760881669-80db4d7b341f?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"pl9", url:"https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=200&h=200&fit=crop&auto=format", correct:true  },
    ],
  },
  {
    label: "chats",
    instruction: "Sélectionnez toutes les photos de chat",
    emoji: "🐱",
    images: [
      { id:"ca1", url:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"ca2", url:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"ca3", url:"https://images.unsplash.com/photo-1561948955-570b270e7c36?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"ca4", url:"https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"ca5", url:"https://images.unsplash.com/photo-1548366086-7f1b76106622?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"ca6", url:"https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"ca7", url:"https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"ca8", url:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"ca9", url:"https://images.unsplash.com/photo-1478827387698-1527781a4887?w=200&h=200&fit=crop&auto=format", correct:false },
    ],
  },
  {
    label: "forêts",
    instruction: "Sélectionnez toutes les photos de forêt",
    emoji: "🌲",
    images: [
      { id:"fo1", url:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"fo2", url:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"fo3", url:"https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"fo4", url:"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"fo5", url:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"fo6", url:"https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"fo7", url:"https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"fo8", url:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"fo9", url:"https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=200&h=200&fit=crop&auto=format", correct:false },
    ],
  },
  {
    label: "montagnes",
    instruction: "Sélectionnez toutes les photos de montagne",
    emoji: "⛰️",
    images: [
      { id:"mo1", url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"mo2", url:"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"mo3", url:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"mo4", url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"mo5", url:"https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"mo6", url:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"mo7", url:"https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=200&h=200&fit=crop&auto=format", correct:true  },
      { id:"mo8", url:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&h=200&fit=crop&auto=format", correct:false },
      { id:"mo9", url:"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=200&h=200&fit=crop&auto=format", correct:true  },
    ],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickChallenge() {
  const ch = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  return { ...ch, images: shuffle(ch.images) };
}

/* ═══════════════════════════════════════════════
   COMPOSANT MODALE CAPTCHA
═══════════════════════════════════════════════ */
export default function ImageCaptcha({ open, onVerified, onClose }) {
  const [challenge, setChallenge] = useState(() => pickChallenge());
  const [selected,  setSelected]  = useState(new Set());
  const [status,    setStatus]    = useState("idle"); // idle | error | success
  const [attempts,  setAttempts]  = useState(0);
  const [loaded,    setLoaded]    = useState(new Set());
  const [shake,     setShake]     = useState(false);
  const [closing,   setClosing]   = useState(false);

  const correctIds = new Set(challenge.images.filter(i => i.correct).map(i => i.id));

  const reset = useCallback(() => {
    setChallenge(pickChallenge());
    setSelected(new Set());
    setStatus("idle");
    setLoaded(new Set());
    setShake(false);
  }, []);

  /* Fermer la modale avec animation */
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); reset(); }, 280);
  }, [onClose, reset]);

  /* Fermer sur Escape */
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, handleClose]);

  /* Bloquer le scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open && !closing) return null;

  const toggle = (id) => {
    if (status === "success") return;
    setStatus("idle");
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const verify = () => {
    const ok = [...correctIds].every(id => selected.has(id)) &&
               [...selected].every(id => correctIds.has(id));
    if (ok) {
      setStatus("success");
      setTimeout(() => { onVerified?.(); handleClose(); }, 1100);
    } else {
      setAttempts(a => a + 1);
      setStatus("error");
      setShake(true);
      setTimeout(() => { setShake(false); reset(); }, 820);
    }
  };

  return (
    <div className={`cap-backdrop${closing ? " cap-backdrop--out" : ""}`} onClick={handleClose}>
      <div
        className={`cap-modal${shake ? " cap-modal--shake" : ""}${status === "success" ? " cap-modal--ok" : ""}${closing ? " cap-modal--out" : ""}`}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Vérification CAPTCHA"
      >

        {/* ── En-tête ── */}
        <div className="cap-modal__head">
          <div className="cap-modal__headleft">
            <div className="cap-modal__shield">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <p className="cap-modal__title">Je ne suis pas un robot</p>
              <p className="cap-modal__brand">Ombrelune · Vérification sécurisée</p>
            </div>
          </div>
          <button className="cap-modal__close" onClick={handleClose} aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {status !== "success" ? (
          <>
            {/* ── Consigne ── */}
            <div className="cap-modal__instr">
              <span className="cap-modal__emoji">{challenge.emoji}</span>
              <div>
                <p className="cap-modal__instrtext">{challenge.instruction}</p>
                <p className="cap-modal__instrsub">Cliquez sur chaque image correspondante, puis sur Vérifier</p>
              </div>
              <span className="cap-modal__count">
                {selected.size} / {correctIds.size}
              </span>
            </div>

            {/* ── Grille 3×3 ── */}
            <div className="cap-modal__grid">
              {challenge.images.map((img, idx) => {
                const sel      = selected.has(img.id);
                const isLoaded = loaded.has(img.id);
                return (
                  <button
                    key={img.id}
                    type="button"
                    className={`cap-cell${sel ? " cap-cell--sel" : ""}`}
                    onClick={() => toggle(img.id)}
                    style={{ animationDelay: `${idx * 35}ms` }}
                    aria-pressed={sel}
                  >
                    {!isLoaded && <div className="cap-skeleton"/>}
                    <img
                      src={img.url} alt=""
                      draggable={false}
                      onLoad={() => setLoaded(p => new Set([...p, img.id]))}
                      style={{ opacity: isLoaded ? 1 : 0 }}
                    />
                    {sel && (
                      <div className="cap-cell__overlay">
                        <div className="cap-cell__check">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className="cap-cell__num">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Message erreur ── */}
            {status === "error" && (
              <div className="cap-modal__error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Sélection incorrecte — nouvelles images chargées.
              </div>
            )}

            {/* ── Pied de page ── */}
            <div className="cap-modal__foot">
              <div className="cap-modal__footleft">
                {attempts > 0 && (
                  <span className="cap-modal__attempts">
                    {attempts} essai{attempts > 1 ? "s" : ""}
                  </span>
                )}
                <button type="button" className="cap-modal__refresh" onClick={reset}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Actualiser
                </button>
              </div>
              <button
                type="button"
                className={`cap-modal__verify${selected.size === 0 ? " cap-modal__verify--off" : ""}`}
                onClick={verify}
                disabled={selected.size === 0}
              >
                Vérifier
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* ── Succès ── */
          <div className="cap-modal__success">
            <div className="cap-success__ring">
              <div className="cap-success__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <p className="cap-success__title">Vérification réussie</p>
            <p className="cap-success__sub">Vous êtes bien humain — connexion en cours…</p>
            <div className="cap-success__bar"><div className="cap-success__fill"/></div>
          </div>
        )}
      </div>
    </div>
  );
}