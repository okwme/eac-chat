<template lang="pug">
  #app
    top-bar
    #divide
      side-bar
      .router-view
        router-view
</template>
<script>

import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'

export default {
  name: 'App',
  components: {
    TopBar,
    SideBar
  }
}
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  *:focus {
    outline: none;
  }
  html, body {
    padding: 0;
    margin:0;
  }
  #app {
    max-width:100vw;
    overflow: hidden;
  }

  #divide {
    display: flex;
  }

  .router-view {
    flex-grow: 1;
    border-left: 1px solid black;
    left:-1px;  
    position: relative;
  }
  @media only screen and (max-width: 768px)   {
    .router-view {
      min-width: 100vw;
    }
  }
  input[type="text"] {
    height:40px;
    line-height: 40px;
    font-size: 24px;
    padding:0 10px;
    width:100%;
    background-color: transparent;
    border: 1px solid lightgrey;
  }
</style>
