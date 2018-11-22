<template lang="pug">
    #room {{thisRoom}}
      #previos-chats
        .chat(v-for="chat in chats") {{chat.text}}
      input(@submit="sendChat")
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'Room',
  props: ['room'],
  computed: {
    ...mapState(['tokens', 'chats']),
    thisRoom() {
      return this.tokens && this.tokens.records && this.tokens.records.find(t => {
        return t.address === this.room.replace('0x', '')})
    }
  }
}
</script>

<style scoped>
</style>