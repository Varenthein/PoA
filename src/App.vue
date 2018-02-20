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
            <Footer></Footer>
        </el-footer>

    </el-container>

  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import Menu from './components/Menu'

export default {
  name: 'App',
  components: { PageHeader: Header, Menu: Menu, Footer: Footer }
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
