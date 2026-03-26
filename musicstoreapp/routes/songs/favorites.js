module.exports = function (app, songsRepository, favoriteSongsRepository) {
    const { ObjectId } = require("mongodb");

    app.get("/songs/favorites", function (req, res) {
        let filter = { user: req.session.user };
        let options = { sort: { date: -1 } };
        favoriteSongsRepository.getFavorites(filter, options).then(favorites => {
            let total = 0;
            for (let i = 0; i < favorites.length; i++) {
                let price = parseFloat(favorites[i].price);
                if (!isNaN(price)) {
                    total += price;
                }
            }
            res.render("favorites.twig", { favorites: favorites, total: total.toFixed(2) });
        }).catch(error => {
            res.send("Se ha producido un error al listar los favoritos: " + error);
        });
    });

    app.post("/songs/favorites/add/:song_id", function (req, res) {
        let filter = { _id: new ObjectId(req.params.song_id) };
        songsRepository.findSong(filter, {}).then(song => {
            if (!song) {
                res.send("No se ha encontrado la canción");
                return;
            }
            let favorite = {
                song_id: song._id,
                title: song.title,
                date: new Date(),
                user: req.session.user,
                price: song.price
            };
            favoriteSongsRepository.insertFavorite(favorite).then(() => {
                res.redirect("/songs/favorites");
            }).catch(error => {
                res.send("Se ha producido un error al añadir a favoritos: " + error);
            });
        }).catch(error => {
            res.send("Se ha producido un error al buscar la canción: " + error);
        });
    });

    app.get("/songs/favorites/delete/:song_id", function (req, res) {
        let filter = { user: req.session.user, song_id: new ObjectId(req.params.song_id) };
        favoriteSongsRepository.deleteFavorite(filter, {}).then(() => {
            res.redirect("/songs/favorites");
        }).catch(error => {
            res.send("Se ha producido un error al eliminar de favoritos: " + error);
        });
    });
};
