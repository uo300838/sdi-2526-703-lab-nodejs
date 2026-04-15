const songRequestSchema = {
  type: "object",
  required: ["title", "kind", "price"],
  properties: {
    title: {
      type: "string",
      description: "Titulo de la cancion",
    },
    kind: {
      type: "string",
      description: "Genero de la cancion",
    },
    price: {
      type: "number",
      description: "Precio de la cancion",
    },
  },
  example: {
    title: "Cuarto Movimiento: La Realidad",
    kind: "Rock",
    price: 18.0,
  },
};

module.exports = {
  SongRequest: songRequestSchema,
};

