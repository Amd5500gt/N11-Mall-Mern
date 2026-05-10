import axios from "axios"

import BASE_URL
from "../config/config"

/* AXIOS */

const api =
axios.create({

  baseURL: BASE_URL,

  headers:{
    "Content-Type":
    "application/json"
  }

})

/* ACTIVE REQUESTS */

let activeRequests = 0

/* START LOADING */

const startLoading = () => {

  activeRequests++

  window.dispatchEvent(
    new Event(
      "api-loading-start"
    )
  )

}

/* STOP LOADING */

const stopLoading = () => {

  activeRequests--

  if (activeRequests <= 0) {

    activeRequests = 0

    window.dispatchEvent(
      new Event(
        "api-loading-end"
      )
    )

  }

}

/* REQUEST */

api.interceptors.request.use(

  (config) => {

    // TOKEN

    const token =
    localStorage.getItem(
      "jwtToken"
    )

    if (token) {

      config.headers.Authorization =
      `Bearer ${token}`

    }

    startLoading()

    return config

  },

  (error) => {

    stopLoading()

    return Promise.reject(error)

  }

)

/* RESPONSE */

api.interceptors.response.use(

  (response) => {

    stopLoading()

    return response

  },

  (error) => {

    stopLoading()

    return Promise.reject(error)

  }

)

export default api