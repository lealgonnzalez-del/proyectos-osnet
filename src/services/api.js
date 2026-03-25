import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 10000,
});

// 🔐 INTERCEPTOR REQUEST (envía token automáticamente)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 INTERCEPTOR RESPONSE (manejo global de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error);

    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🟡 IGNORAR errores 401 en MFA
    const esMFA =
      url.includes("/auth/mfa/generate") ||
      url.includes("/auth/mfa/verify");

    // 🔴 SOLO cerrar sesión si NO es MFA
    if (status === 401 && !esMFA) {
      console.warn("Token expirado o no autorizado");

      // limpiar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirigir al login
      window.location.href = "/";
    }

    // 🔴 Error servidor
    if (status === 500) {
      console.error("Error interno del servidor");
    }

    // 🔴 Sin conexión
    if (!error.response) {
      console.error("No hay conexión con el backend");
    }

    return Promise.reject(error);
  }
);

export default api;