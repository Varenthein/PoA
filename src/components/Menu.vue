<template>

  <div class="menu">
      <el-menu class="el-menu-demo" mode="horizontal" :default-active="activeLink">
       <template v-for="link in links">
           <el-submenu v-if="(!link.perm || User.permissions[link.perm]) && link.subMenu && link.subMenu.length > 0" :index="link.pathTo">
               <template slot="title">{{ link.title }}</template>
                 <el-menu-item v-if="!submenu.perm || User.permissions[submenu.perm]" v-for="submenu in link.subMenu" :index="link.pathTo + '/' + submenu.pathTo">
                   <router-link :to="submenu.pathTo">{{ submenu.title }}</router-link>
                 </el-menu-item>
           </el-submenu>
           <el-menu-item v-else-if="(!link.perm || User.permissions[link.perm]) && !link.subMenu" :index="link.pathTo">
                <router-link :to="link.pathTo">{{ link.title }}    </router-link>
           </el-menu-item>
       </template>
       <el-menu-item index="logout">
           <a v-lang.logout href="/api/auth/logout/"></a>
       </el-menu-item>
     </el-menu>
  </div>

</template>

<script>

import { userService } from '@/services/user.service.js'

export default {
  name: 'Menu',
  data () {
    return {
       User: { permissions: {}},
       activeLink:  'Home'
    }
  },
  methods: {

        /***************************** LOAD USER **************************/

        loadUser: function() {
          userService.getLoggedUser().then(response => {
            this.User = response.data;
            this.User.permissions = JSON.parse(this.User.permissions);
            Object.keys(this.User.permissions).map((key, index) => {
                this.User.permissions[key] = (this.User.permissions[key] == "true") ? true : false
            })
          }).catch(err => {
            this.$notify({title: this.translate('accessDenied'), message: this.translate('accessDeniedMsg'), type: 'error'})
            setTimeout(() => { window.location = "" }, 3000);
          });
        }

  },
  created: function () {

    //load user
    this.loadUser();

    //load menu structure
    this.links = [
      { title: this.translate('homepage'), pathTo: '/home', subMenu: false },
      { title: this.translate('products'), perm: 'seeProduct', pathTo: 'products', subMenu: [
        { title: this.translate('allProducts'), pathTo: 'ProductsAll', subMenu: false },
        { title: this.translate('addProduct'), pathTo: 'ProductAdd', subMenu: false },
        { title: this.translate('categories'), pathTo: 'Categories', subMenu: false }
      ]},
      { title: this.translate('orders'), pathTo: 'Orders', subMenu: false},
      { title: this.translate('users'), pathTo: 'users', subMenu: [
        { title: this.translate('allUsers'), pathTo: 'users', subMenu: false },
        { title: this.translate('addUser'), pathTo: 'UserAdd', subMenu: false },
        { title: this.translate('userGroups'), pathTo: 'UserGroups', subMenu: false }
      ]},
      { title: this.translate('promotions'), pathTo: 'Promotions', subMenu: [
        { title: this.translate('allPromotions'), pathTo: 'PromotionsAll', subMenu: false },
        { title: this.translate('addPromotion'), pathTo: 'PromotionAdd', subMenu: false }
      ]},
      { title: this.translate('opinions'), pathTo: '/opinions', perm: 'seeOpinion', subMenu: false},
      { title: this.translate('newsletter'), pathTo: 'Newsletter', subMenu: false },
      { title: this.translate('stats'), pathTo: 'stats', subMenu: false}
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu a {
    color: inherit;
    text-decoration: none;
  }

</style>
