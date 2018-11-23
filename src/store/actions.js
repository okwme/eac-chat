import {fb, db} from '@/api/firebase'
import {web3} from '@/api/web3'

const blockies = require('ethereum-blockies-png')
import axios from 'axios'

import {signingParams} from '@/assets/auth'
const debug = true
export default {
  makeBlockie({commit}, address) {
    let blockie = blockies.createDataURL({
      size: 3,
      scale: 32,
      // bgcolor	: '#ffffff',
      // color: '#000000',
      // spotcolor: '#808080',
      seed: address.split('-')[0]
    })
    commit('SET_BLOCKIE', {address, blockie})
    return blockie
  },
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
  logout({commit}) {
    console.log('logout')
    fb.auth().signOut().then(() => {
      commit('SET_ACCOUNT', false)
      commit('SET_SIGNATURE', false)
      commit('SET_AUTH', false)
      commit('SET_CLAIMS', {})
      commit('SET_TOKENS', [])
      commit('SET_CHAT', [])
      commit('SET_NAME', null)
    }).catch((error) => {
      console.error(error)
    })
  },
  async verify({state, commit}) {
    if (debug) console.log('verify')
    let network = await web3.eth.net.getId()
    let resp = await axios.post('http://localhost:9000/hello', {
      network,
      account: state.account,
      signature: state.signature
    })
    await fb.auth().signInWithCustomToken(resp.data.customToken)
    commit('SET_AUTH', true)
    commit('SET_CLAIMS', resp.data.additionalClaims)
    commit('SET_TOKENS', resp.data.data.payload)
  },
  addChat(_, {id, chat}) {
    console.log('addChat')
    let user = fb.auth().currentUser
    console.log(user.uid)
    if (user) chat.user_id = user.uid
    console.log(chat)
    db.ref('rooms/' + id).push(chat)
  },
  stopChat(_, id) {
    console.log('stopChat')
    db.ref('rooms/' + id).off()
  },
  startChat({commit}, id) {
    console.log('startChat', 'rooms/' + id)
    commit('SET_CHAT', [])
    // let chats = db.collection('rooms').doc(id)
    // chats.get().then((doc) => {
    //   if (!doc.exists) {
    //     console.log('doc doesn\'t exist')
    //     return
    //   }
    //   console.log(doc)
    //   console.log(doc.data())
    //   // commit('SET_CHAT', data)
    // })
    // chats.onSnapshot((doc) => {
    //   console.log(doc.data())
    // })
    let newRoom = true
    let isFirst = true
    db.ref('rooms/' + id).limitToLast(100).once('value').then((data) => {
      console.log('value', data.val())
      if (data.val()) {
        newRoom = false
        commit('SET_CHAT', Object.values(data.val()))
      }
      db.ref('rooms/' + id).limitToLast(1).on('child_added', function(data) {
        console.log(data)
        console.log('child_added', data.val())
        if (newRoom || !isFirst) commit('ADD_CHAT', data.val())
        if (isFirst) isFirst = false
      })
    })


    // chats.once('value').then((data) => {
    //   console.log('value', data.val())
    //   // commit('SET_CHAT', data)
    // })
    // chats.on('child_added', function(data) {
    //   console.log('child_added', data.val())
    //   commit('ADD_CHAT', data.val())
    // })
    // chats.on('child_changed', function(data) {
    //   console.log('child_changed', data.val())
    //   // commit('EDIT_CHAT', data)
    // })
    // chats.on('child_removed', function(data) {
    //   console.log('child_removed', data.val())
    //   // commit('REMOVE_CHAT', data)
    // })
  }
}