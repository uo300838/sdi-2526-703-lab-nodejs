const express = require("express");
const { ObjectId } = require("mongodb");
const songsRepository = require("../repositories/songsRepository");

const userAudiosRouter = express.Router();

userAudiosRouter.use(function (req, res, next) {
    console.log("routerAudios");
    const path = require("path");
    const songId = path.basename(req.originalUrl, ".mp3");
    const filter = { _id: new ObjectId(songId) };
    songsRepository.findSong(filter, {}).then(song => {
        if (req.session.user && song.author == req.session.user) {
            next();
        } else {
            res.redirect("/shop");
        }
    }).catch(() => {
        res.redirect("/shop");
    });
});

module.exports = userAudiosRouter;
