import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import axios from "axios"
import { GDialog } from 'gitart-vue-dialog'
import 'gitart-vue-dialog/dist/style.css'
import CKEditor from '@ckeditor/ckeditor5-vue';
import {userAuth} from "@/store/userAuth";

axios.defaults.baseURL = process.env.VUE_APP_BASE_SERVER_URL
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`


const pinia = createPinia()

createApp(App).use(pinia).use(router).use(CKEditor).component('GDialog', GDialog).mount('#app')
export const parserAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_PARSER_URL
});
axios.interceptors.response.use(
    response => {
        // If the request was successful, just return the response
        return response
    },
    error => {
        // If the request resulted in an error, check the status
        if (error.response && error.response.status === 500) {
            // If the status is 500, redirect to the login page or refresh the token
            console.log('500')
            const store = userAuth()
            store.setAuth('', '')
            location.reload()
        } else {
            // If the status is not 500, reject the promise with the error
            return Promise.reject(error)
        }
    }
)