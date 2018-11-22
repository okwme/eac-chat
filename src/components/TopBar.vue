<template lang="pug">
  #topBar
    router-link(to='/') Home
    button(:disabled="false" @click="login") login
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'TopBar',
  data() {
    return {
              
    }
  },
  computed: {
    ...mapState(['account', 'signature', 'auth', 'claims']),
  },
  methods: {
    ...mapActions(['approve', 'getAccount', 'verify', 'getSignature']),
    async login() {
      if (!this.account) {
        try {
          await this.approve()
          await this.getAccount()
        } catch(error) {
          console.error(error)
          return
        }
      }
      try {
        if (!this.signature) {
          await this.getSignature()
        }
        await this.verify()
      }catch(err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
button {
  float: right;
  height:20px;
  margin-top:15px;
}
</style>