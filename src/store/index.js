import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    chatName: state.chatName,
    account: state.account,
    blockies: state.blockies,
    signature: state.signature
  }),
})

const state = {
  hide: true,
  chatName: null,
  auth: false,
  account: false,
  signature: false,
  tokens: [],
  claims: {},
  chats: [],
  subscription: null,
  blockies: {}
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: [vuexLocal.plugin]
})