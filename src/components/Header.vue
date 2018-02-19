<template>
  <div class="home">
    <h1>Hello!</h1>
    <p v-lang.welcome="{name: 'Vue.JS'}"></p>
    <a href="/api/auth/logout">Wyloguj</a>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
