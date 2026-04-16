const request = require("request");

class LyricsService {
  /**
   * Devuelve la letra como string. Si no existe o hay error, devuelve un mensaje legible.
   */
  async getLyrics(artist, song) {
    const safeArtist = encodeURIComponent(String(artist ?? "").trim());
    const safeSong = encodeURIComponent(String(song ?? "").trim());

    if (!safeArtist || !safeSong) {
      return "Letra no disponible";
    }

    const url = `https://api.lyrics.ovh/v1/${safeArtist}/${safeSong}`;

    try {
      const doRequest = () =>
        new Promise((resolve, reject) => {
          request(
            {
              url,
              method: "GET",
              timeout: 15000,
              headers: { Accept: "application/json" },
            },
            function (error, response, responseBody) {
              if (error) return reject(error);
              resolve({ statusCode: response?.statusCode, body: responseBody });
            }
          );
        });

      let result;
      try {
        result = await doRequest();
      } catch (e) {
        result = await doRequest();
      }

      const { statusCode, body } = result;

      if (!statusCode || statusCode < 200 || statusCode > 299) {
        return "Letra no disponible";
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return "Letra no disponible";
      }

      if (!data || typeof data.lyrics !== "string" || data.lyrics.trim() === "") {
        return "Letra no disponible";
      }

      return data.lyrics;
    } catch (error) {
      return "Error al obtener la letra";
    }
  }
}

module.exports = new LyricsService();
