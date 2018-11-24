import Vue from 'vue'

export default {
  SET_CLAIMS(state, claims) {
    Vue.set(state, 'claims', claims)
  },
  SET_TOKENS(state, tokens) {
    state.tokens = tokens
  },
  SET_AUTH(state, bool) {
    state.auth = bool
  },
  SET_SIGNATURE(state, sig) {
    state.signature = sig
  },
  SET_ACCOUNT(state, acct) {
    state.account = acct
  },
  SET_CHAT(state, data) {
    state.chats = data
  },
  ADD_CHAT(state, data) {
    state.chats.push(data)
  },
  SET_SUBSCRIPTION(state, subscription) {
    state.subscription = subscription
  },
  SET_NAME(state, name) {
    state.chatName = name
  },
  SET_BLOCKIE(state, {address, blockie}) {
    Vue.set(state.blockies, address, blockie)
  },
  SET_HIDE(state, bool) {
    state.hide = bool
  }
}