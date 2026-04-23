import { useEffect, useState } from "react";
import LyricsSearchForm from "../components/LyricsSearchForm";
import LyricsViewer from "../components/LyricsViewer";
import Toast from "../components/Toast";
import { getLyrics } from "../services/service";
import "../assets/Lyrics.css";

const STORAGE_KEY = "lyrics_history_v1";

const readHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeHistory = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
};

const LyricsSearch = ({ preset, onGoHistory }) => {
  const [artist, setArtist] = useState(preset?.artist || "");
  const [song, setSong] = useState(preset?.song || "");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!preset) return;
    setArtist(preset.artist || "");
    setSong(preset.song || "");
    setLyrics(preset.lyrics || "");
    setError("");
  }, [preset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLyrics("");

    const a = artist.trim();
    const s = song.trim();
    if (!a || !s) {
      setError("Indica artista y cancion");
      return;
    }

    setLoading(true);
    try {
      const data = await getLyrics({ artist: a, song: s });
      const text = String(data?.lyrics || "").trim();
      setLyrics(text);

      const now = Date.now();
      const item = { id: `${a}::${s}::${now}`, artist: a, song: s, lyrics: text, ts: now };
      const next = [item, ...readHistory().filter((h) => `${h.artist}::${h.song}` !== `${a}::${s}`)];
      writeHistory(next);

      setToast({ type: text ? "success" : "info", message: text ? "Letra cargada" : "Letra no disponible" });
    } catch (err) {
      setError(err?.message || "Error al buscar letra");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics || "");
      setToast({ type: "success", message: "Copiado al portapapeles" });
    } catch {
      setToast({ type: "error", message: "No se pudo copiar" });
    }
  };

  return (
    <div className="lyricsPage">
      <div className="lyricsPage__top">
        <h2>Buscador de letras</h2>
        <button className="lyricsPage__link" onClick={onGoHistory}>
          Ver historial
        </button>
      </div>

      <LyricsSearchForm
        artist={artist}
        song={song}
        onArtistChange={setArtist}
        onSongChange={setSong}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {error && <div className="lyricsError">{error}</div>}
      {!error && loading && <p className="lyricsLoading">Consultando API...</p>}

      <LyricsViewer artist={artist} song={song} lyrics={lyrics} onCopy={handleCopy} />

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export { STORAGE_KEY, readHistory, writeHistory };
export default LyricsSearch;

