module.exports = function (app) {
  // Endpoint "servidor" de ejemplo: acepta un anuncio en JSON y lo devuelve con un id.
  app.post("/api/v1.0/ads", function (req, res) {
    const ad = {
      description: req.body?.description,
      price: req.body?.price,
    };

    return res.status(201).json({
      message: "Anuncio creado",
      ad: { _id: Date.now().toString(), ...ad },
    });
  });

  // Endpoint "cliente" de ejemplo: hace una petición POST usando request (app.get('rest')).
  app.post("/api/v1.0/ads/insert", function (req, res) {
    const ads = {
      description: req.body?.description ?? "Nuevo anuncio",
      price: req.body?.price ?? "10",
    };

    const settings = {
      url: "http://localhost:8081/api/v1.0/ads",
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: ads,
    };

    const rest = app.get("rest");
    rest(settings, function (error, response, body) {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(response?.statusCode ?? 500).json(body);
    });
  });
};

