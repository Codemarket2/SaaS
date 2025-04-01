/**
 * Axios API
 * Middleware of api request and response
 * @format
 */

import axios from "axios";

// import { store } from "../../app/redux/store";

/**
 * Creating custom instance for config
 * server configurations.
 * baseUrl, timeout, api-token etc.
 *
 */
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  //   // "authorization": `${adminToken}`
  // },
});

/**
 * axios request interceptors for debugging
 * and modify request data
 */
httpRequest.interceptors.request.use(
  (reqConfig) => {
    // const token = store.getState().authSlice.token;
    // if (token) {
    //   reqConfig.headers.Authorization = `${token}`;
    // }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Customizing axios success and error
 * data to easily handle them in app
 */
httpRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Promise.reject(handleApiError(error));
  }
);

// Handling error
const handleApiError = (error) => {
  throw error;
};

export { httpRequest };
