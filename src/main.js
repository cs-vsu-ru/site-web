import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import axios from "axios"
import { GDialog } from 'gitart-vue-dialog'
import 'gitart-vue-dialog/dist/style.css'
import CKEditor from '@ckeditor/ckeditor5-vue';

axios.defaults.baseURL = process.env.VUE_APP_BASE_DEV_URL
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

axios.interceptors.response.use(
    response => {
        // If the request was successful, just return the response
        return response
    },
    error => {
        // If the request resulted in an error, check the status
        if (error.response && error.response.status === 500) {
            // If the status is 500, redirect to the login page or refresh the token
            // router.push('/login')
        } else {
            // If the status is not 500, reject the promise with the error
            return Promise.reject(error)
        }
    }
)

const pinia = createPinia()

createApp(App).use(pinia).use(router).use(CKEditor).component('GDialog', GDialog).mount('#app')