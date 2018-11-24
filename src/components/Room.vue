<template lang="pug">
    #room
      #previous-chats(v-chat-scroll="{always: false, smooth: true}")
        .chat(v-for="chat in chats")
          .icon
            a(:title="chat.user_id" target="_blank" :href="'https://etherscan.io/address/' + chat.user_id.split('-')[0]") 
              img(:src="getsrc(chat.user_id)")
          span.username
            b(v-html="xss(chat.name.substr(0,7))" ) 
          span.message
            div(v-html="xss(chat.message)")
      #new-chats
        input#chatName(v-model="displayName" placeholder="name" maxlength="7" type="text")
        input#chatInput(@submit="sendChat" v-model="chatInput" @keyup.enter="sendChat" maxlength="255" placeholder="message")
</template>

<script>
import {mapState, mapActions} from 'vuex'
var xss = require('xss')

export default {
  name: 'Room',
  data () {
    return {
      chatInput: null
    }
  },
  watch: {
    room() {
      this.launch()
    }
  },
  props: ['room'],
  computed: {
    ...mapState(['chatName', 'tokens', 'chats', 'account', 'auth', 'blockies']),
    thisRoom() {
      return this.tokens && this.tokens.records && this.tokens.records.find(t => {
        return t.address === this.room.replace('0x', '')})
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
    ...mapActions(['startChat', 'addChat', 'stopChat', 'makeBlockie']),
    getsrc(id) {
      if (!id) return false
      return this.blockies[id] || this.makeBlockie(id)
    },
    xss(foo) {
      return xss(foo)
    },
    async sendChat() {
      await this.addChat({id: this.room, chat: {
        message: this.chatInput,
        name: this.chatName
      }})
      this.chatInput = null
      console.log('chat!')
    },
    launch() {
      if (!this.auth) return this.$router.push('/')
      if (!this.chatName) this.$store.commit('SET_NAME', this.account.substr(0, 7))
      try {
        this.stopChat(this.room)
        this.startChat(this.room)
      } catch (error) {
        console.error(error)
        this.$router.push('/')
      }
    }
  },
  destroyed() {
    console.log('destroyed')
    this.stopChat(this.room)
  },
  mounted() {
    console.log('mounted')
    this.launch()
  }
}
</script>

<style lang="scss">
  #room {
    display: flex;
    flex-direction: column;
    width:100%;
    #previous-chats {
      flex-grow: 1;
      height: calc(100vh - 120px);
      overflow: auto;
      // box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.75);
      .chat {
        border-bottom:1px solid black;
        display: flex;
        > * {
          min-height:36px;
        }
        .icon {
          padding:0px;
          flex: 0 0 36px;
          height:36px;
          img {
            width:36px;
            border-radius: 100%;
            display:inline;
          }
        }
        .username {
          border-left:1px solid black;
          padding: 5px;

          overflow: hidden;
          border-right: 1px solid black;
          flex: 0 0 120px;
          line-height:26px;
        }
        .message {
          padding: 5px;
          flex: 0 0 none;
          line-height:26px;
        }
      }
    }
    #new-chats {
      height:60px;
      padding: 20px;
      display: flex;
      input {
        height:40px;
        line-height: 40px;
        font-size: 24px;
        padding:0 10px;
      }
      #chatName {
        width:170px;
      }
      #chatInput {
        flex-grow: 1;
      }
    }
  }
</style>