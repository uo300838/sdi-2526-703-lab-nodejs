const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

const buildUrl = (pathOrUrl) => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith("/")) return `${API_BASE_URL}/${pathOrUrl}`;
  return `${API_BASE_URL}${pathOrUrl}`;
};

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async (pathOrUrl, options = {}) => {
  const url = buildUrl(pathOrUrl);
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: localStorage.getItem("token") || "",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Puede haber respuestas sin JSON; lo tratamos como error genérico.
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      throw new ApiError("UNAUTHORIZED", { status: res.status, data });
    }
    throw new ApiError(data?.error || "Error en la API", { status: res.status, data });
  }

  return data;
};

export const login = async ({ email, password }) => {
  return apiRequest("/api/v1.0/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const listSongs = async () => apiRequest("/api/v1.0/songs");
export const getSongById = async (songId) => apiRequest(`/api/v1.0/songs/${songId}`);
export const addSong = async ({ title, kind, price }) =>
  apiRequest("/api/v1.0/songs", {
    method: "POST",
    body: JSON.stringify({ title, kind, price }),
  });
export const deleteSongById = async (songId) =>
  apiRequest(`/api/v1.0/songs/${songId}`, { method: "DELETE" });

export const getLyrics = async ({ artist, song }) => {
  const a = String(artist ?? "").trim();
  const s = String(song ?? "").trim();
  const params = new URLSearchParams({ artist: a, song: s });
  return apiRequest(`/api/v1.0/lyrics?${params.toString()}`);
};

