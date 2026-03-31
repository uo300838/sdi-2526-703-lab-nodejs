module.exports = function (app, songsRepository) {
    const {ObjectId} = require("mongodb");

    app.get("/shop", function (req, res) {
        let filter = {};
        let options = { sort: { title: 1 } };
        if (req.query.search != null && typeof (req.query.search) != "undefined" && req.query.search != "") {
            filter = { "title": { $regex: ".*" + req.query.search + ".*" } };
        }
        let page = parseInt(req.query.page);
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
            page = 1;
        }
        songsRepository.getSongsPg(filter, options, page).then(result => {
            let lastPage = result.total / 4;
            if (result.total % 4 > 0) {
                lastPage = lastPage + 1;
            }
            let pages = [];
            for (let i = page - 2; i <= page + 2; i++) {
                if (i > 0 && i <= lastPage) {
                    pages.push(i);
                }
            }
            let response = {
                songs: result.songs,
                pages: pages,
                currentPage: page
            };
            res.render("shop.twig", response);
        }).catch(error => {
            res.send("Se ha producido un error al listar las canciones del usuario " + error);
        });
    });
    app.get('/publications', function (req, res) {
        let filter = {author: req.session.user};
        let options = {sort: {title: 1}};
        songsRepository.getSongs(filter, options).then(songs => {
            res.render("publications.twig", {songs: songs});
        }).catch(error => {
            res.send("Se ha producido un error al listar las publicaciones del usuario: " + error)
        });
    })

    app.get("/songs", function (req, res) {
        let songs = [{
            "title": "Blank space",
            "price": "1.2"
        }, {
            "title": "See you again",
            "price": "1.3"
        }, {
            "title": "Uptown Funk",
            "price": "1.1"
        }];

        let response = {
            seller: "Tienda de canciones",
            songs: songs
        };
        res.render("shop.twig", response);
    });

    app.get("/add", function (req, res) {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(response));
    });

    app.get("/songs/add", function (req, res) {
        res.render("songs/add.twig");
    });

    app.get("/songs/:id", function (req, res) {
        let filter = {_id: new ObjectId(req.params.id)};
        let options = {};
        songsRepository.findSong(filter, options).then(song => {
            res.render("songs/song.twig", {song: song});
        }).catch(error => {
            res.send("Se ha producido un error al buscar la canción " + error)
        });
    });

    app.get('/songs/edit/:id', function (req, res) {
        let filter = {_id: new ObjectId(req.params.id)};
        songsRepository.findSong(filter, {}).then(song => {
            res.render("songs/edit.twig", {song: song});
        }).catch(error => {
            res.send("Se ha producido un error al recuperar la canción " + error);
        });
    });

    app.get('/songs/delete/:id', function (req, res) {
        let filter = {_id: new ObjectId(req.params.id)};
        songsRepository.deleteSong(filter, {}).then(result => {
            if (result === null || result.deletedCount === 0) {
                res.redirect("/publications?message=" + encodeURIComponent("No se ha podido eliminar el registro") +
                    "&messageType=alert-danger");
            } else {
                res.redirect("/publications?message=" + encodeURIComponent("Canción eliminada correctamente") +
                    "&messageType=alert-success");
            }
        }).catch(error => {
            res.redirect("/publications?message=" +
                encodeURIComponent("Se ha producido un error al intentar eliminar la canción") +
                "&messageType=alert-danger");
        });
    });

    app.post('/songs/edit/:id', function (req, res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
            author: req.session.user
        };
        let songId = req.params.id;
        let filter = {_id: new ObjectId(songId)};
        const options = {upsert: false};
        songsRepository.updateSong(song, filter, options).then(() => {
            step1UpdateCover(req.files, songId, function (result) {
                if (result == null) {
                    res.redirect("/publications?message=" +
                        encodeURIComponent("Error al actualizar la portada o el audio de la canción") +
                        "&messageType=alert-danger");
                } else {
                    res.redirect("/publications?message=" +
                        encodeURIComponent("Se ha modificado el registro correctamente") +
                        "&messageType=alert-success");
                }
            });
        }).catch(error => {
            res.redirect("/publications?message=" +
                encodeURIComponent("Se ha producido un error al modificar la canción") +
                "&messageType=alert-danger");
        });
    });

    app.post('/songs/buy/:id', function (req, res) {
        let songId = new ObjectId(req.params.id);
        let shop = {
            user: req.session.user,
            song_id: songId
        };
        songsRepository.buySong(shop).then(result => {
            if (result.insertedId === null || typeof (result.insertedId) === "undefined") {
                res.redirect("/shop?message=" +
                    encodeURIComponent("Se ha producido un error al comprar la canción") +
                    "&messageType=alert-danger");
            } else {
                res.redirect("/purchases");
            }
        }).catch(() => {
            res.redirect("/shop?message=" +
                encodeURIComponent("Se ha producido un error al comprar la canción") +
                "&messageType=alert-danger");
        });
    });

    app.get('/purchases', function (req, res) {
        let filter = {user: req.session.user};
        let options = {projection: {_id: 0, song_id: 1}};
        songsRepository.getPurchases(filter, options).then(purchasedIds => {
            const purchasedSongs = purchasedIds.map(song => song.song_id);
            let songsFilter = {"_id": {$in: purchasedSongs}};
            let songsOptions = {sort: {title: 1}};
            songsRepository.getSongs(songsFilter, songsOptions).then(songs => {
                res.render("purchase.twig", {songs: songs});
            }).catch(() => {
                res.redirect("/shop?message=" +
                    encodeURIComponent("Se ha producido un error al listar las publicaciones del usuario") +
                    "&messageType=alert-danger");
            });
        }).catch(() => {
            res.redirect("/shop?message=" +
                encodeURIComponent("Se ha producido un error al listar las canciones del usuario") +
                "&messageType=alert-danger");
        });
    });

    app.get("/songs/:kind/:id", function (req, res) {
        let response = "id: " + req.params.id + "<br>"
            + "Tipo de musica: " + req.params.kind;
        res.send(response);
    });

    app.post("/songs/add", function (req, res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
            author: req.session.user
        };
        songsRepository.insertSong(song, function (result) {
            if (result.songId !== null && result.songId !== undefined) {
                if (req.files != null && req.files.cover != null) {
                    let image = req.files.cover;
                    image.mv(app.get("uploadPath") + "/public/covers/" + result.songId + ".png")
                        .then(() => {
                            if (req.files.audio != null) {
                                let audio = req.files.audio;
                                audio.mv(app.get("uploadPath") + "/public/audios/" + result.songId + ".mp3")
                                    .then(() => res.redirect("/publications?message=" +
                                        encodeURIComponent("Canción agregada correctamente") +
                                        "&messageType=alert-success"))
                                    .catch(() => res.redirect("/songs/add?message=" +
                                        encodeURIComponent("Error al subir el audio de la canción") +
                                        "&messageType=alert-danger"));
                            } else {
                                res.redirect("/publications?message=" +
                                    encodeURIComponent("Canción agregada correctamente") +
                                    "&messageType=alert-success");
                            }
                        })
                        .catch(() => res.redirect("/songs/add?message=" +
                            encodeURIComponent("Error al subir la portada de la canción") +
                            "&messageType=alert-danger"));
                } else {
                    res.redirect("/publications?message=" +
                        encodeURIComponent("Canción agregada correctamente") +
                        "&messageType=alert-success");
                }
            } else {
                res.redirect("/songs/add?message=" +
                    encodeURIComponent("Error al insertar canción") +
                    "&messageType=alert-danger");
            }
        });
    });

    app.get("/promo*", function (req, res) {
        res.send("Respuesta al patron promo*");
    });

    app.get("/pro*ar", function (req, res) {
        res.send("Respuesta al patron pro*ar");
    });

    function step1UpdateCover(files, songId, callback) {
        if (files && files.cover != null) {
            let image = files.cover;
            image.mv(app.get("uploadPath") + "/public/covers/" + songId + ".png", function (err) {
                if (err) {
                    callback(null);
                } else {
                    step2UpdateAudio(files, songId, callback);
                }
            });
        } else {
            step2UpdateAudio(files, songId, callback);
        }
    }

    function step2UpdateAudio(files, songId, callback) {
        if (files && files.audio != null) {
            let audio = files.audio;
            audio.mv(app.get("uploadPath") + "/public/audios/" + songId + ".mp3", function (err) {
                if (err) {
                    callback(null);
                } else {
                    callback(true);
                }
            });
        } else {
            callback(true);
        }
    }
};
