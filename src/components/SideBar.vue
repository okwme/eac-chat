<template lang="pug">
  #sideBar
    div
      router-link(to='lobby') Lobby
    div(
      v-for="token in tokens.records" :key="token.address"
      :class="{'ERC20': token.isERC20,'ERC721': token.isERC721}")
        router-link(:to="'0x' + token.address") {{token.symbol.substr(0, 20)}} <!--/ {{token.name}}-->
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
    ...mapState(['tokens'])
  },
  methods: {
    ...mapActions(['openRoom'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#sideBar{
  padding:0 20px;
  & > div{
    margin-top: 5px;
  }
}
</style>
