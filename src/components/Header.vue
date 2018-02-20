<template>
    <div class="page-header">
        <el-row>
            <el-col :span="18">
                <h1>ShopCMS</h1>
            </el-col>
            <el-col :span="6">
                <a @click="setLanguage('en')">En</a>
                <a @click="setLanguage('pl')">Pl</a>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
  name: 'page-header',
  data () {
    return {
    }
  },
  methods: {
    setLanguage: (lang) => {
      console.log(lang)
      this.language = lang
      console.log(this.language)
      setTimeout(() => { window.location = '' }, 500)
    }
  }
}
</script>

<style scoped>
/* HEADER */

.page-header {
  margin-top: 50px;
}
.page-header h1 {
  font-size: 2em;
}
</style>
