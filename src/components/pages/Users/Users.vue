<template>

  <div class="users" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }"><span v-lang.users></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.users></h2>

    <!-- ADD USER BTN -->
    <router-link to="/users/add"><el-button type="success" v-if="userCan('addUser')" class="addUserBtn" plain size="small" icon="el-icon-plus">{{ translate('addUser') }}</el-button>
    </router-link>

    <!-- USER BOX -->
    <el-table :default-sort = "{prop: 'id', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="users" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="login" :sortable="true" :label="translate('name')" width="710">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button type="warning" v-if="userCan('editUser')" @click="editUser(scope.row.id)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removeUser')" :disabled="User.id == scope.row.id" @click="removeUser(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="usersAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'


export default {
  name: 'Users',
  mixins: [userMixin],
  data () {
    return {
      usersAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      users: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD USERS *************************/

    loadUsers: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      userService.getUsersRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.users = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadUsers'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      userService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.usersAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadCategories()
    },

    /************************** EDIT USER  *************************/

    editUser: function(id) {
         this.$router.push({ path: '/users/edit/'+id })
    },

    /************************** REMOVE ORDER *************************/

    removeUser: function(id) {
      this.$confirm(this.translate('removeUserConfirmation'), 'Warning', {
        confirmButtonText: this.translate('yes'),
        cancelButtonText: this.translate('cancel'),
        type: 'warning'
      }).then(() => {
        userService.removeUser(id).then(response => {
          if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
          else if(response.data && response.data.type == "success") {
            this.$message({ type: 'success', message: response.data.msg});
            this.loadUsers()
            this.loadPages()
          } else throw "error"
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('accessDeniedMsg'), type: 'warning'})
        })

     }).catch((err) => {
       //removing canceled
     });
    }

  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeUser')) this.getOut();

          //load products
          this.loadUsers();

          //load pages amount
          this.loadPages();

      })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title {
  display: inline-block;
}

.addUserBtn {
  margin-top: 40px;
  float: right;
}

</style>
