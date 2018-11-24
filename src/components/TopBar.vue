<template lang="pug">
  #topBar
    button#toggle-menu(
      @click="$store.commit('SET_HIDE', !hide)"
      :class="{'is-active': !hide}"
      class="hamburger hamburger--arrow" 
      type="button")
      span(class="hamburger-box")
        span(class="hamburger-inner")
    div
      button#auth(@click="authorize") {{ auth ? 'Logout' : 'Start'}}
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
    ...mapState(['account', 'signature', 'auth', 'claims', 'hide']),
  },
  methods: {
    ...mapActions(['approve', 'getAccount', 'verify', 'getSignature', 'logout']),
    async authorize() {
      if (this.auth) {
        this.$router.push('/')
        this.logout()
      } else {
        this.login()
      }
    },
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

<style lang="scss">
    $hamburger-padding-x           : 0px;
    $hamburger-padding-y           : 5px;
    $hamburger-layer-width         : 30px;
    $hamburger-layer-height        : 4px;
    $hamburger-layer-spacing       : 4px;
    $hamburger-layer-color         : #000;
    $hamburger-layer-border-radius : 0px;
    $hamburger-hover-opacity       : 1;
  @import "@/../node_modules/hamburgers/_sass/hamburgers/hamburgers.scss";
  #topBar {
    padding:0px 20px;
    border-bottom: 1px solid black;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    direction: row;
    #auth {
      height:20px;
      margin-top:15px;
      margin-right:10px;
    }
    #toggle-menu {
      // margin-top:10px;
      // cursor: pointer;
      // width: 30px;
      // height: 30px;
      // // border: 1px solid black;
      // font-size: 30px;
      // line-height:30px;
    }
  }
</style>