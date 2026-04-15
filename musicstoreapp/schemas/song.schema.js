const songSchema = {
  type: "object",
  properties: {
    _id: { type: "string", description: "ID unico" },
    title: { type: "string", description: "Titulo" },
    kind: { type: "string", description: "Genero de la cancion" },
    price: { type: "number", description: "Precio de la cancion" },
    author: { type: "string", description: "Autor de la cancion" },
  },
  example: {
    _id: "69c6905f5e4e6f21b204e672",
    title: "Cuarto Movimiento: La Realidad",
    kind: "Rock",
    price: 18.0,
    author: "Extremoduro",
  },
};

module.exports = {
  Song: songSchema,
};

