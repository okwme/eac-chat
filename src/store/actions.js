import {fb} from '@/api/firebase'
import {web3} from '@/api/web3'

import axios from 'axios'

import {signingParams} from '@/assets/auth'
const debug = true
export default {
  getAccount({commit}) {
    if (debug) console.log('getAccount')
    return new Promise((resolve ,reject) => {
      if (!window.web3) return reject('no web3')
      window.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          return reject(err)
        } else if (accounts.length) {
          commit('SET_ACCOUNT', accounts[0])
        }
        resolve()
      })
    })
  },
  getSignature ({state, commit}) {
    if (debug) console.log('getSignature')
    return new Promise((resolve, reject) => {
      global.web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData',
          params: [signingParams, state.account],
          from: state.account
        }, (err, { result }) => {
          if (err) {
            reject(err)
          } else {
            commit('SET_SIGNATURE', result)
            resolve()
          }
        }
      )
    })
  },
  async approve() {
    if (debug) console.log('approve')
    if (window.ethereum) {
      try {
        await window.ethereum.enable()
      } catch (error) {
        console.error(error)
      }
    }
  },
  async verify({state, commit}) {
    if (debug) console.log('verify')
    let network = await web3.eth.net.getId()
    let resp = await axios.post('http://localhost:9000/hello', {
      network,
      account: state.account,
      signature: state.signature
    })
    console.log(resp)
    fb.auth().signInWithCustomToken(resp.data.customToken)
    commit('SET_AUTH', true)
    commit('SET_CLAIMS', resp.data.additionalClaims)
    commit('SET_TOKENS', resp.data.data.payload)
  },
}