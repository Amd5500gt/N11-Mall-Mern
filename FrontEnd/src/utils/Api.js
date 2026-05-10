import axios from "axios";

import BASE_URL from "../config/config";

/* AXIOS INSTANCE */

const api = axios.create({

  baseURL: BASE_URL,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json"
  }

});

/* ACTIVE REQUESTS */

let activeRequests = 0;

/* START LOADING */

const startLoading = () => {

  activeRequests++;

  window.dispatchEvent(
    new Event("api-loading-start")
  );

};

/* STOP LOADING */

const stopLoading = () => {

  activeRequests = Math.max(
    activeRequests - 1,
    0
  );

  if (activeRequests === 0) {

    window.dispatchEvent(
      new Event("api-loading-end")
    );

  }

};

/* REQUEST INTERCEPTOR */

api.interceptors.request.use(

  (config) => {

    /* TOKEN */

    const token =
    localStorage.getItem("jwtToken");

    if (token) {

      config.headers.Authorization =
      `Bearer ${token}`;

    }

    /* REQUEST START TIME */

    config.metadata = {
      startTime: new Date()
    };

    /* LOADING */

    startLoading();

    return config;

  },

  (error) => {

    stopLoading();

    return Promise.reject(error);

  }

);

/* RESPONSE INTERCEPTOR */

api.interceptors.response.use(

  (response) => {

    stopLoading();

    /* REQUEST TIME LOG */

    const endTime = new Date();

    const duration =
      endTime -
      response.config.metadata.startTime;

    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
    );

    return response;

  },

  async (error) => {

    stopLoading();

    /* NETWORK ERROR */

    if (!error.response) {

      console.log("🌐 Network Error");

      return Promise.reject({
        success: false,
        message:
        "Network error. Please check your internet connection."
      });

    }

    /* STATUS */

    const status =
    error.response.status;

    /* AUTO LOGOUT */

    if (status === 401) {

      localStorage.removeItem("jwtToken");

      localStorage.removeItem("user");

      window.location.href = "/login";

    }

    /* SERVER ERROR */

    if (status >= 500) {

      console.log("🔥 Server Error");

    }

    /* REQUEST TIME LOG */

    if (error.config?.metadata?.startTime) {

      const endTime = new Date();

      const duration =
        endTime -
        error.config.metadata.startTime;

      console.log(
        `❌ ${error.config.method?.toUpperCase()} ${error.config.url} - ${duration}ms`
      );

    }

    return Promise.reject({

      success: false,

      status,

      message:
        error.response?.data?.message ||
        "Something went wrong"

    });

  }

);

/* CANCEL DUPLICATE REQUESTS */

const pendingRequests = new Map();

const generateRequestKey = (config) => {

  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data)
  ].join("&");

};

api.interceptors.request.use((config) => {

  const requestKey =
  generateRequestKey(config);

  if (pendingRequests.has(requestKey)) {

    pendingRequests
      .get(requestKey)
      .abort();

  }

  const controller =
  new AbortController();

  config.signal =
  controller.signal;

  pendingRequests.set(
    requestKey,
    controller
  );

  return config;

});

api.interceptors.response.use(

  (response) => {

    const requestKey =
    generateRequestKey(response.config);

    pendingRequests.delete(requestKey);

    return response;

  },

  (error) => {

    if (error.config) {

      const requestKey =
      generateRequestKey(error.config);

      pendingRequests.delete(requestKey);

    }

    return Promise.reject(error);

  }

);

export default api;