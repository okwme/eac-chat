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
  }
}