<template lang="pug">
  #sideBar(:class="{hide:hide}")
    div
      h1
        router-link(to='/') Welcome
    #room-list
      div(v-if="auth")
        span(@click="launch('lobby')")
          router-link(to='lobby') Lobby
      div(
        v-for="token in rooms" :key="token.address"
        :class="{'ERC20': token.isERC20,'ERC721': token.isERC721}")
          span(@click="launch(token.address)")
            router-link(:to="token.address" :title="token.name" ) {{token.symbol ? token.symbol.substr(0, 20) : token.address.substr(0,6)}} <!--/ {{token.name}}-->
          a(:href="'https://etherscan.io/token/' + token.address + '?a=' + account" target="_blank")
            img(src="/static/link.png")
    #nameInput(v-if="auth")
      input#chatName(v-model="displayName" placeholder="Name" maxlength="7" type="text")
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
    ...mapState(['tokens', 'auth', 'claims', 'account', 'chatName', 'hide']),
    rooms() {
      return this.tokens.records && this.tokens.records.filter((r) => this.claims['0x' + r.address])
    },
    displayName: {
      get () {
        return this.chatName
      },
      set (value) {
        this.$store.commit('SET_NAME', value)
      }
    }
  },
  methods: {
    ...mapActions(['openRoom', 'launch'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#sideBar{

  // box-shadow: inset -10px 0px 10px rgba(0,0,0,0.1);
  height:calc(100vh - 50px);
  flex: 0 0 200px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top:20px;
  transition: all ease 500ms;
  &.hide {
    // width:0px;
    flex-basis: 0px;
    // transform: translateX(-1px);
  }
  h1 {
    padding: 0 20px;
  }
  #room-list {
    max-height: calc(100vh - 210px);
    overflow: auto;
    min-width:159px;
    padding: 0 20px;
    & > div{
      margin-bottom: 3px;
    }
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
  #nameInput {
    min-width:199px;
    height: 81px;
    padding: 20px 20px;
    border-top:1px solid black;
    margin-top:auto;
    // align-self: flex-end;
  }
}
</style>
