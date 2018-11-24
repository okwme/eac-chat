<template lang="pug">
  div 
    h1 Ethereum Authenticated Chat
    ul 
      li Authenticate with an Ethereum wallet
      li Balances in ERC-20 or ERC-721 give access
      li Blockchain data via 
        a(href="https://amberdata.io" target="_blank") amberdata.io
      li Chat via 
        a(href="https://firebase.google.com" target="_blank") google firebase
      li Hosted by 
        a(href="http://netlify.com" target="_blank") netlify
      li Check out the 
        a(href="https://github.com/okwme/eac-chat" target="_blank") github
        |  for more info
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