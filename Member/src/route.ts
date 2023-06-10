import { createRouter, createWebHashHistory } from 'vue-router'
import MemberIndex from './components/MemberIndex.vue'
import MemberShow from './components/MemberShow.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: MemberIndex },
    { path: '/show/:id', component: MemberShow, props: true }
  ]
})
