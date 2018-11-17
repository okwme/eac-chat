<template>
  <div id="app">
    <button :disabled="signature" @click="login">login</button>
    <button :disabled="!signature" @click="verify">verify</button>
    <table>
      <tr>
        <th>account</th>
        <td>{{account}}</td>
      </tr>
      <tr>
        <th>signature</th>
        <td>{{signature}}</td>
      </tr>
    </table>
    <!-- <router-view/> -->
  </div>
</template>
<script>

import axios from 'axios'
import {signingParams} from './assets/auth'
import firebase from "firebase";
var config = {
  apiKey: "AIzaSyAdK9qrNj1G6abHZiYkyDvdJ3pajUnBtS8",
  authDomain: "eac-chat-ddecb.firebaseapp.com",
  databaseURL: "https://eac-chat-ddecb.firebaseio.com",
  projectId: "eac-chat-ddecb",
  storageBucket: "eac-chat-ddecb.appspot.com",
  messagingSenderId: "453164258119"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('user is ', user)
    // User is signed in.
  } else {
    console.log('uers was signed out')
    // No user is signed in.
  }
});
export default {
  name: 'App',
  data () {
    return {
      account: false,
      signature: false
    }
  },
  methods: {
    verify() {
      axios.post('http://localhost:9000/hello', {account: this.account, signature: this.signature}).then((resp) => {
        console.log(resp)
        firebase.auth().signInWithCustomToken(resp.data.customToken).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        })
      }).catch(error=> {
        console.log(error)
      })
    },
    getAccount() {
      return new Promise((resolve ,reject) => {
        window.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            return reject(err)
          } else if (accounts.length) {
            this.account  = accounts[0]
          }
          resolve()
        })
      })
    },
    async login() {
      if (!this.account) {
        await this.approve()
        await this.getAccount()
      }
      global.web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData',
          params: [signingParams, this.account],
          from: this.account
        },
        (err, { result }) => {
          if (err) {
            console.error(err)
            return
          }
          this.signature = result
        }
      )
    },
    async approve() {
      if (window.ethereum) {
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
        } catch (error) {
            // User denied account access...
            console.log(error)
        }
      }
    }
  }
}
</script>

<style>

</style>
