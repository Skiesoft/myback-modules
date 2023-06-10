import { createApp } from 'vue'
import { SDK } from '@myback/sdk'
import App from './App.vue'
import { router } from './route'

SDK.init({
  API_TOKEN: 'YbE7jTXeaIaoPIENWOP9KLN7aDPBG2lw7mn0KGQ2fGeZK1oxlSCLmZxiBaQOvw4A',
  DATABASE: '73ee92ab-4dc2-43f9-95cb-acc868579a1d',
  STORAGE: '168c2aae-e4c3-40d3-a773-75bf22f8d81f'
})

createApp(App).use(router).mount('#app')
