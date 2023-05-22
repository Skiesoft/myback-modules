import { createApp } from 'vue'
import { SDK } from '@myback/sdk'
import App from './App.vue'
import { router } from './route'

SDK.init({
  API_TOKEN: 'YOUR_ADMIN_API_KEY',
  DATABASE: 'YOUR_DATABASE_ID',
  STORAGE: 'YOUR_STORAGE_ID',
})


createApp(App).use(router).mount('#app')

