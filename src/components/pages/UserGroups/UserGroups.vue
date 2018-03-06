<template>

  <div class="users" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users/groups' }"><span v-lang.userGroups></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.userGroups></h2>

    <!-- ADD USER GROUP BTN -->
    <router-link to="/users/groups/add"><el-button type="success" v-if="userCan('addUserGroup')" class="addUserGroupBtn" plain size="small" icon="el-icon-plus">{{ translate('addUserGroup') }}</el-button>
    </router-link>

    <!-- USER GROUPS BOX -->
    <el-table :default-sort = "{prop: 'id', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="userGroups" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" :sortable="true" :label="translate('name')" width="710">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button type="warning" v-if="userCan('editUserGroup')" @click="editUserGroup(scope.row.id)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removeUserGroup')" :disabled="scope.row.id === '1'" @click="removeUserGroup(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="userGroupsAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'


export default {
  name: 'UserGroups',
  mixins: [userMixin],
  data () {
    return {
      userGroupsAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      userGroups: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD USER GROUPS *************************/

    loadUserGroups: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      userService.getUserGroupsRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.userGroups = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadUserGroups'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      userService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.userGroupsAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadUserGroups()
    },

    /************************** EDIT USER  *************************/

    editUserGroup: function(id) {
         this.$router.push({ path: '/users/group/edit/'+id })
    },

    /************************** REMOVE ORDER *************************/

    removeUserGroup: function(id) {
      this.$confirm(this.translate('removeUserGroupConfirmation'), 'Warning', {
        confirmButtonText: this.translate('yes'),
        cancelButtonText: this.translate('cancel'),
        type: 'warning'
      }).then(() => {
        userService.removeUserGroup(id).then(response => {
          if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
          else if(response.data && response.data.type == "success") {
            this.$message({ type: 'success', message: response.data.msg});
            this.loadUserGroups()
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
          if(!this.userCan('seeUserGroup')) this.getOut();

          //load products
          this.loadUserGroups();

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

.addUserGroupBtn {
  margin-top: 40px;
  float: right;
}

</style>
