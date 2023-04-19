import { createRouter, createWebHashHistory } from 'vue-router'
import SalesProductImport from './components/Sales-Product-import.vue'
import SalesProductIndex from './components/Sales-Product-index.vue'
import SalesProductView from './components/Sales-Product-view.vue'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: SalesProductIndex },
        { path: '/view/:id', component: SalesProductView, props: true},
        { path: '/import', component: SalesProductImport}
    ]
});