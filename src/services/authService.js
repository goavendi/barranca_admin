import axios from "axios";
import { getTanant } from "./helper";
// import {baseURL} from './config/config'

export function init() {
  //this will also work..
  // axios.defaults.baseURL = baseURL;
  axios.interceptors.request.use(
    (config) => {
      const access_token = localStorage.getItem("accessToken");
      if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`;

        config.headers["tenant"] = getTanant();
      }
      return config;
    },
    (err) => {
      Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      if (err.response && err.response.status === 401) {

        console.log("LOGOUT 100!!!!", "$$$$");
        localStorage.removeItem('accessToken')
        localStorage.removeItem('avendi_user')
        window.location.pathname = "/";
        //@toto call for refresh token later...
        /*if (
          err.response.data.code &&
          err.response.data.code === "token_not_valid"
        ) {
          logout();
        }*/
      }
      return Promise.reject(err);
    }
  );
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.pathname = "/";
}
