<template lang="pug">
  #sideBar
    div
      h1(v-if="rooms") Tokens
    div(v-if="auth")
      router-link(to='lobby') Lobby
    div(
      v-for="token in rooms" :key="token.address"
      :class="{'ERC20': token.isERC20,'ERC721': token.isERC721}")
        router-link(:to="'0x' + token.address" :title="token.name") {{token.symbol.substr(0, 20)}} <!--/ {{token.name}}-->
        a(:href="'https://etherscan.io/token/0x' + token.address + '?a=' + account" target="_blank")
          img(src="/static/link.png")
    //- code {{token}}
</template>

<script>

import {mapState, mapActions} from 'vuex'
export default {
  name: 'SideBar',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    ...mapState(['tokens', 'auth', 'claims', 'account']),
    rooms() {
      return this.tokens.records && this.tokens.records.filter((r) => this.claims['0x' + r.address])
    }
  },
  methods: {
    ...mapActions(['openRoom'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#sideBar{
  border-right: 1px solid black;
  padding:20px;
  & > div{
    margin-top: 5px;
  }
  a {
    text-decoration: none;
    img {
      width:12px;
      margin-left:5px;
    }
  }
  .router-link-active {
    text-decoration: underline;
  }
}
</style>
