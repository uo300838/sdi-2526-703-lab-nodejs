const { ObjectId } = require("mongodb");

module.exports = function (app, songsRepository, usersRepository) {
  // POST /api/v1.0/users/login -> devuelve token JWT si credenciales son validas
  app.post("/api/v1.0/users/login", async function (req, res) {
    try {
      const securePassword = app
        .get("crypto")
        .createHmac("sha256", app.get("clave"))
        .update(req.body.password)
        .digest("hex");

      const filter = {
        email: req.body.email,
        password: securePassword,
      };

      const user = await usersRepository.findUser(filter, {});
      if (user == null) {
        return res.status(401).json({
          message: "usuario no autorizado",
          authenticated: false,
        });
      }

      const token = app.get("jwt").sign(
        { user: user.email, time: Date.now() / 1000 },
        "secreto"
      );

      return res.status(200).json({
        message: "usuario autorizado",
        authenticated: true,
        token: token,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Se ha producido un error al verificar credenciales",
        authenticated: false,
      });
    }
  });

  // GET /api/v1.0/songs -> lista de canciones
  app.get("/api/v1.0/songs", function (req, res) {
    const filter = {};
    const options = {};

    songsRepository
      .getSongs(filter, options)
      .then((songs) => {
        res.status(200).json({ songs: songs });
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "Se ha producido un error al recuperar las canciones." });
      });
  });

  // GET /api/v1.0/songs/:id -> cancion por id
  app.get("/api/v1.0/songs/:id", function (req, res) {
    let songId;
    try {
      songId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(404).json({ error: "ID invalido o no existe" });
    }

    const filter = { _id: songId };
    const options = {};

    songsRepository
      .findSong(filter, options)
      .then((song) => {
        if (song === null) {
          res.status(404).json({ error: "ID invalido o no existe" });
        } else {
          res.status(200).json({ song: song });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "Se ha producido un error a recuperar la cancion." });
      });
  });

  // DELETE /api/v1.0/songs/:id -> elimina cancion por id
  // Nota: try/catch para no delegar en el error handler global ante ObjectId invalido
  app.delete("/api/v1.0/songs/:id", function (req, res) {
    try {
      const songId = new ObjectId(req.params.id);
      const filter = { _id: songId };

      songsRepository
        .deleteSong(filter, {})
        .then((result) => {
          if (result === null || result.deletedCount === 0) {
            res
              .status(404)
              .json({
                error: "ID invalido o no existe, no se ha borrado el registro.",
              });
          } else {
            // Mantener compatibilidad con el guion: devolver el resultado serializado
            res.status(200).send(JSON.stringify(result));
          }
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Se ha producido un error:" + error.message });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1.0/songs -> crea cancion
  app.post("/api/v1.0/songs", function (req, res) {
    try {
      const song = {
        title: req.body?.title,
        kind: req.body?.kind,
        price: req.body?.price,
        author: res.user,
      };

      songsRepository.insertSong(song, function (result) {
        if (result?.error) {
          return res
            .status(500)
            .json({
              error:
                "Se ha producido un error al intentar crear la cancion: " +
                result.error,
            });
        }

        if (result?.songId === null || typeof result?.songId === "undefined") {
          return res
            .status(409)
            .json({
              error:
                "No se ha podido crear la cancion. El recurso ya existe.",
            });
        }

        res.status(201).json({
          message: "Cancion anadida correctamente.",
          _id: result.songId,
        });
      });
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            "Se ha producido un error al intentar crear la cancion: " +
            error.message,
        });
    }
  });

  // PUT /api/v1.0/songs/:id -> actualiza (parcialmente) cancion por id
  // Nota: try/catch para no delegar en el error handler global ante ObjectId invalido
  app.put("/api/v1.0/songs/:id", async function (req, res) {
    try {
      let songId;
      try {
        songId = new ObjectId(req.params.id);
      } catch (error) {
        return res.status(404).json({ error: "ID invalido o no existe" });
      }

      const filter = { _id: songId };
      // Si la _id NO existe, no crea un nuevo documento.
      const options = { upsert: false };

      const song = {
        author: res.user,
      };

      if (typeof req.body?.title !== "undefined" && req.body?.title !== null) {
        song.title = req.body.title;
      }
      if (typeof req.body?.kind !== "undefined" && req.body?.kind !== null) {
        song.kind = req.body.kind;
      }
      if (typeof req.body?.price !== "undefined" && req.body?.price !== null) {
        song.price = req.body.price;
      }

      const result = await songsRepository.updateSong(song, filter, options);

      if (result === null) {
        return res.status(404).json({
          error: "ID invalido o no existe, no se ha actualizado la cancion.",
        });
      }

      // La _id no existe o los datos enviados no difieren de los ya almacenados.
      if (result.modifiedCount === 0) {
        return res.status(409).json({ error: "No se ha modificado ninguna cancion." });
      }

      return res.status(200).json({
        message: "Cancion modificada correctamente.",
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Se ha producido un error al intentar modificar la cancion: " + error.message,
      });
    }
  });
};
