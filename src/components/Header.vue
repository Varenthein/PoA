<template>

    <div class="page-header">
        <el-row>
            <el-col :span="18">

                <!-- HEADING -->
                <h1>ShopCMS</h1>

            </el-col>
            <el-col :span="6">

              <!-- LANGUAGE PANEL -->
              <div class="languagePanel">
                  <a @click="setLanguage('en')">EN</a>
                  <a @click="setLanguage('pl')">PL</a>
              </div>

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

    /************************** SET LANGUAGE *************************/

    setLanguage: function (lang) {
      this.language = lang
      setTimeout(() => { window.location = '' }, 100)
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

.languagePanel {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.languagePanel a {
  display: flex;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
  background: #eee;
  color: #555;
  width: 30px;
  height: 30px;
  font-size: 10px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
}
</style>
