module.exports = function (app) {
  const lyricsService = require("../services/lyricsService");

  // Página simple para buscar letras vía lyrics.ovh (GET con query params)
  app.get("/lyrics", async function (req, res) {
    const artist = req.query.artist;
    const song = req.query.song;

    // Primera carga: mostrar solo el formulario
    if (!artist && !song) {
      return res.render("lyrics.twig");
    }

    // Si falta alguno, renderizar con aviso sencillo
    if (!artist || !song) {
      return res.render("lyrics.twig", {
        artist: artist || "",
        song: song || "",
        lyrics: "Faltan parámetros (artist, song)",
      });
    }

    const lyrics = await lyricsService.getLyrics(artist, song);
    res.render("lyrics.twig", { artist: artist, song: song, lyrics: lyrics });
  });
};

