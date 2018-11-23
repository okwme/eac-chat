<template lang="pug">
  div 
    h1 Ethereum Authenticated Chat
    ul 
      li Authenticate with your wallet
      li Tokens act as access controllers to address based rooms
      li Check out the 
        a(href="https://github.com/okwme/eac-chat") github.com
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
  div {
    padding: 20px;
  }
</style>