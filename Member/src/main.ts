import { createApp } from 'vue'
import { SDK } from '@myback/sdk'
import App from './App.vue'
import { router } from './route'

SDK.init({
  API_TOKEN: 'ypkpAHjYvS3tqAupuoY0mfv9CmIgNeM0UGccOnMmuVVtu9ImGdIVRq6hgmGxrwZ9',
  DATABASE: '639e216f-1880-480e-ab86-5f54f8279453',
  STORAGE: '8903024b-2a54-4f6e-9a5f-fe0af6c13447'
})

createApp(App).use(router).mount('#app')
