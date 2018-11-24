<template lang="pug">
  #home(v-html="readme")
</template>

<script>
export default {
  name: 'Home',
  computed: {
    readme() {
      return require('@/../README.md')
    } 
  }
}
</script>

<style>
  div#home {
    padding: 20px;
  }
  ul {
    padding-inline-start: 20px;
  }
</style>