import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const state = {
  auth: false,
  account: false,
  signature: false,
  tokens: [],
  claims: {},
  chats: []
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
})