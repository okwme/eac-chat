<template lang="pug">
  #app
    top-bar
    #divide
      side-bar
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
  html, body {
    padding: 0;
    margin:0;
  }
  #topBar {
    padding:0px 20px;
    border-bottom: 1px solid black;
    height: 50px;
    line-height: 50px;
  }
  #divide {
    display: flex;
  }
  #sideBar {
    height:calc(100vh - 50px);
    width: 280px;
    overflow: auto;
  }
</style>
