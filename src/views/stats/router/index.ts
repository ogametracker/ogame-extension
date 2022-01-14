import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld,
  },
]

const router = new VueRouter({
  routes
})

export default router
