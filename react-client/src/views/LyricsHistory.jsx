import { useMemo, useState } from "react";
import Toast from "../components/Toast";
import "../assets/Lyrics.css";
import { readHistory, STORAGE_KEY } from "./LyricsSearch";

const formatWhen = (ts) => {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
};

const LyricsHistory = ({ onPick, onBack }) => {
  const [toast, setToast] = useState(null);
  const items = useMemo(() => readHistory(), []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToast({ type: "success", message: "Historial borrado" });
    // Forzar refresco simple
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className="lyricsPage">
      <div className="lyricsPage__top">
        <h2>Historial</h2>
        <button className="lyricsPage__link" onClick={onBack}>
          Volver
        </button>
      </div>

      <div className="lyricsHistory__actions">
        <button className="lyricsHistory__btn" onClick={clearHistory} disabled={items.length === 0}>
          Borrar historial
        </button>
      </div>

      {items.length === 0 ? (
        <p className="lyricsEmpty">Todavia no has buscado ninguna letra.</p>
      ) : (
        <div className="lyricsHistory">
          {items.map((h) => (
            <button
              key={h.id}
              className="lyricsHistory__item"
              onClick={() => onPick?.(h)}
              title="Abrir busqueda"
            >
              <div className="lyricsHistory__main">
                <span className="lyricsHistory__song">{h.song}</span>
                <span className="lyricsHistory__artist">{h.artist}</span>
              </div>
              <div className="lyricsHistory__meta">{formatWhen(h.ts)}</div>
            </button>
          ))}
        </div>
      )}

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
};

export default LyricsHistory;

