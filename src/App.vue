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
import Header from './components/Header'
import Footer from './components/Footer'
import Menu from './components/Menu'

import { userService } from './services/user.service.js'

export default {
  name: 'App',
  methods: {

    /***************************** LOAD USER **************************/

    loadUser: function() {
      userService.getLoggedUser().then(response => {
        userService.setUser(response.data);
      }).catch(err => {
        this.$notify({title: this.translate('accessDenied'), message: this.translate('accessDeniedMsg'), type: 'error'})
        setTimeout(() => { window.location = "" }, 3000);
      });
    }

  },
  created: function() {

    //Verify if user is logged and load it when success
    userService.isLogged().then(() => {
      this.$notify({title: this.translate('success'), message: this.translate('successfullyLogged'), type: 'success'})
      this.loadUser();
    })
    .catch((err) => {
      this.$notify({title: this.translate('accessDenied'), message: this.translate('accessDeniedMsg'), type: 'error'})
      setTimeout(() => { window.location = "" }, 3000);
    })

  },
  components: { PageHeader: Header, Menu: Menu, PageFooter: Footer }
}
</script>

<style>

body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#app {
  max-width: 1000px;
  margin: 0 auto;
  color: #222;
}

/* additional */

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
