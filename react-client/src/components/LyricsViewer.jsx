import "../assets/Lyrics.css";

const LyricsViewer = ({ artist, song, lyrics, onCopy }) => {
  if (!lyrics) return null;

  return (
    <section className="lyricsResult">
      <header className="lyricsResult__header">
        <div>
          <h2 className="lyricsResult__title">{song || "Letra"}</h2>
          <p className="lyricsResult__subtitle">{artist || ""}</p>
        </div>
        <div className="lyricsResult__actions">
          <button className="lyricsResult__btn" onClick={onCopy}>
            Copiar
          </button>
        </div>
      </header>
      <pre className="lyricsResult__pre">{lyrics}</pre>
    </section>
  );
};

export default LyricsViewer;

