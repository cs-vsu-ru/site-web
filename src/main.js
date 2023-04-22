import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import axios from "axios"
import { GDialog } from 'gitart-vue-dialog'
import 'gitart-vue-dialog/dist/style.css'
import CKEditor from '@ckeditor/ckeditor5-vue';

axios.defaults.baseURL = 'http://dev.fiori-vrn.online/api/'
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const pinia = createPinia()

createApp(App).use(pinia).use(router).use(CKEditor).component('GDialog', GDialog).mount('#app')