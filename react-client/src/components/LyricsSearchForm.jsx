import "../assets/Lyrics.css";

const LyricsSearchForm = ({
  artist,
  song,
  onArtistChange,
  onSongChange,
  onSubmit,
  loading,
}) => {
  return (
    <form className="lyricsForm" onSubmit={onSubmit}>
      <div className="lyricsForm__row">
        <label className="lyricsForm__label">
          Artista
          <input
            className="lyricsForm__input"
            value={artist}
            onChange={(e) => onArtistChange?.(e.target.value)}
            placeholder="Ej: Coldplay"
            autoComplete="off"
          />
        </label>
        <label className="lyricsForm__label">
          Cancion
          <input
            className="lyricsForm__input"
            value={song}
            onChange={(e) => onSongChange?.(e.target.value)}
            placeholder="Ej: Yellow"
            autoComplete="off"
          />
        </label>
      </div>
      <div className="lyricsForm__actions">
        <button className="lyricsForm__btn" type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar letra"}
        </button>
      </div>
    </form>
  );
};

export default LyricsSearchForm;

