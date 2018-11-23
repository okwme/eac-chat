// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import {fb} from '@/api/firebase'
import App from './App'
import router from './router'
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)
Vue.config.productionTip = false

fb.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.uid)
    if (store.state.account && store.state.signature && !store.state.auth) {
      store.dispatch('verify')
    }
    // store.commit('SET_AUTH', true)
    // console.log('user is ', user)
    // User is signed in.
  } else if (store.state.auth) {
    store.dispatch('logout')
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
