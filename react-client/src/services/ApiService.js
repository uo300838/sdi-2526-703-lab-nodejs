// Backward-compat: el resto del proyecto importaba `apiFetch`.
// Para el Ejercicio 3 centralizamos todo en `services/service.js`.
import { apiRequest } from "./service";

export const apiFetch = apiRequest;
