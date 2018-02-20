<template>

  <div id="app">
    <el-container>

        <!-- HEADER -->
        <el-header height="150px">
            <page-header></page-header>
        </el-header>

        <!-- MENU -->
        <Menu></Menu>

        <!-- MAIN -->
        <el-main>
            <router-view/>
        </el-main>

        <!-- FOOTER -->
        <el-footer>
            <page-footer></page-footer>
        </el-footer>

    </el-container>
  </div>

</template>

<script>

/* IMPORT APP PARTS */
import Header from './components/Header'
import Footer from './components/Footer'
import Menu from './components/Menu'

/* IMPORT SERVICES */
import { userService } from './services/user.service.js'

export default {
  name: 'App',
  methods: {

    /************************** VERIFY USER *************************/

    verifyUser: function() {
      userService.isLogged().then(() => {
        this.$notify({title: this.translate('success'), message: this.translate('successfullyLogged'), type: 'success'})
      })
      .catch((err) => {
        this.$notify({title: this.translate('accessDenied'), message: this.translate('accessDeniedMsg'), type: 'error'})
        setTimeout(() => { window.location = "" }, 3000);
      })
    }

  },
  created: function() {

    //Verify if user is logged in
    this.verifyUser();

  },
  components: { PageHeader: Header, Menu: Menu, PageFooter: Footer }
}
</script>

<style>

/* WHOLE PAGE STYLING */

body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#app {
  max-width: 1000px;
  margin: 0 auto;
  color: #222;
}

/* Additional */

.line {
  border-bottom: solid 1px #e6e6e6;
}

.text-smaller {
  font-size: 12px;
}

.text-muted {
  color: #555;
}
</style>
