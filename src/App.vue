<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>ShopCMS</h1>
        <el-menu
     default-active="2"
     class="el-menu-vertical-demo"
     @open="handleOpen"
     @close="handleClose">
     <el-submenu index="1">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>Navigator One</span>
       </template>
       <el-menu-item-group title="Group One">
         <el-menu-item index="1-1">item one</el-menu-item>
         <el-menu-item index="1-2">item one</el-menu-item>
       </el-menu-item-group>
       <el-menu-item-group title="Group Two">
         <el-menu-item index="1-3">item three</el-menu-item>
       </el-menu-item-group>
       <el-submenu index="1-4">
         <template slot="title">item four</template>
         <el-menu-item index="1-4-1">item one</el-menu-item>
       </el-submenu>
     </el-submenu>
     <el-menu-item index="2">
       <i class="el-icon-menu"></i>
       <span>Navigator Two</span>
     </el-menu-item>
     <el-menu-item index="3">
       <i class="el-icon-setting"></i>
       <span>Navigator Three</span>
     </el-menu-item>
   </el-menu>
      </el-header>
      <el-main>
          <router-view/>
          <el-button>Default</el-button>
          <el-button type="primary">Primary</el-button>
          <el-button type="success">Success</el-button>
          <el-button type="info">Info</el-button>
          <el-button type="warning">Warning</el-button>
          <el-button type="danger">Danger</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

</style>
