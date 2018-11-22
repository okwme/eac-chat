import Vue from 'vue'
import Router from 'vue-router'
import Room from '@/components/Room'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:room',
      name: 'Room',
      component: Room,
      props: true
    }
  ]
})
