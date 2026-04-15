const jwt = require("jsonwebtoken");
const express = require("express");

const userTokenRouter = express.Router();

userTokenRouter.use(function (req, res, next) {
  console.log("userTokenRouter");

  const token = req.headers["token"] || req.body?.token || req.query?.token;
  if (token != null) {
    // Verificar el token
    jwt.verify(token, "secreto", {}, function (err, infoToken) {
      if (err || (Date.now() / 1000 - infoToken.time) > 240) {
        return res.status(403).json({
          // Forbidden
          authorized: false,
          error: "Token inválido o caducado",
        });
      }

      // Dejamos correr la petición: guardamos el usuario para no volver a desencriptar.
      res.user = infoToken.user;
      return next();
    });
  } else {
    return res.status(403).json({
      authorized: false,
      error: "No hay Token",
    });
  }
});

module.exports = userTokenRouter;

