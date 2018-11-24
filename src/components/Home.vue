<template lang="pug">
  div(v-html="readme")
</template>

<script>
import foo  from '@/../README.md'
console.log(foo)
export default {
  name: 'Home',
  computed: {
    readme() {
      return require('@/../README.md')
    } 
  }
}
</script>

<style scoped>
  div {
    padding: 20px;
  }
</style>