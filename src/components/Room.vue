<template lang="pug">
    #room
      #previous-chats(v-chat-scroll="{always: false, smooth: true}")
        .chat(v-for="chat in chats")
          .icon
            a(:title="chat.user_id" target="_blank" :href="'https://etherscan.io/address/' + chat.user_id.split('-')[0]") 
              img(:src="getsrc(chat.user_id)")
          span.username
            b(v-text="xss(chat.name.substr(0,7))" ) 
          span.message
            div(v-text="xss(chat.message)")
      #new-chats(v-show="auth")
        input#chatInput(
          @submit="sendChat" 
          v-model="chatInput" 
          @keyup.enter="sendChat" 
          maxlength="255" 
          placeholder="Message" 
          type="text")
        input(
          type="submit"
          @click="sendChat"
          value="Send"
        )
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
  props: ['room'],
  computed: {
    ...mapState(['chatName', 'tokens', 'chats', 'account', 'auth', 'blockies', 'claims']),
    thisRoom() {
      return this.tokens && this.tokens.records && this.tokens.records.find(t => {
        return t.address === this.room.replace('0x', '')})
    }
  },
  methods: {
    ...mapActions(['stopChat', 'addChat', 'launch', 'makeBlockie']),
    getsrc(id) {
      if (!id) return false
      return this.blockies[id] || this.makeBlockie(id)
    },
    xss(foo) {
      return xss(foo)
    },
    async sendChat() {
      if (!this.chatInput || this.chatInput.trim() === '') return
      await this.addChat({id: this.room, chat: {
        message: this.chatInput,
        name: this.chatName
      }})
      this.chatInput = null
    }
  },
  destroyed() {
    this.stopChat(this.room)
  },
  mounted() {
    this.launch(this.room)
  }
}
</script>

<style lang="scss">
  #room {
    display: flex;
    height: calc(100vh - 50px);
    flex-direction: column;
    justify-content: space-between;
    width:100%;
    #previous-chats {
      flex: 0 0 2;
      // height: calc(100vh - 120px);
      overflow: auto;
      // box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.75);
      .chat {
        // border-bottom:1px solid black;
        display: flex;
        > * {
          min-height:36px;
        }
        &:nth-child(odd) {
          background-color: rgba(0,0,0,0.1);
        }
        .icon {
          padding:0px;
          flex: 0 0 36px;
          height:36px;
          img {
            margin:6px;
            width:24px;
            border-radius: 100%;
            display:inline;
          }
        }
        .username {
          // border-left:1px solid black;
          padding: 5px;

          overflow: hidden;
          // border-right: 1px solid black;
          flex: 0 0 120px;
          line-height:26px;
        }
        .message {
          padding: 5px;
          flex: 0 0 none;
          line-height:26px;
          word-break: break-all;
        }
      }
    }
    #new-chats {
      // height:60px;
      border-top: 1px solid black;
      padding: 20px;
      display: flex;
      flex: 0 0 auto;
      #chatName {
        width:170px;
      }
      #chatInput {
        flex-grow: 1;
      }

      input[type="submit"]{
        cursor: pointer;
        border: 1px solid lightgrey;
        margin-left:20px;
        width: 80px;
        font-size: 24px;
        background-color: transparent;
      }
    }
  }
</style>