module.exports = function(app) {

    const lyricsService = require("../../services/lyricsService");


    app.get("/api/v1.0/lyrics", async function(req, res) {

        let artist = req.query.artist;
        let song = req.query.song;

        if (!artist || !song) {
            return res.status(400).json({
                error: "Faltan parámetros (artist, song)"
            });
        }

        let lyrics = await lyricsService.getLyrics(artist, song);

        res.status(200).json({
            lyrics: lyrics
        });
    });

};
