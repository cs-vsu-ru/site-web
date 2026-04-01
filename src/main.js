import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { GDialog } from "gitart-vue-dialog";
import "gitart-vue-dialog/dist/style.css";
import CKEditor from "@ckeditor/ckeditor5-vue";

const { protocol, host } = window.location;
const baseUrl = `${protocol}//${host}`;
export const API_FILES_URL = `${baseUrl}/is/api/files`;
export const NO_IMG_URL = "fn32s4s.jpeg";

axios.defaults.baseURL = `${baseUrl}/is/inf-sys-server/api/`;
let token =
  localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
axios.defaults.headers["Authorization"] = `Bearer ${token}`;

console.log(baseUrl, API_FILES_URL);

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .use(CKEditor)
  .component("GDialog", GDialog)
  .mount("#app");
export const parserAxios = axios.create({
  baseURL: `${baseUrl}/is/inf-sys-parser/api/`,
});
axios.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
