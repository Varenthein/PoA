<template>

  <div class="categories" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }"><span v-lang.categories></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.categories></h2>

    <!-- ADD CATEGORY BTN -->
    <router-link to="/categories/add"><el-button type="success" v-if="userCan('addCategory')" class="addCategoryBtn" plain size="small" icon="el-icon-plus">{{ translate('addCategory') }}</el-button>
    </router-link>

    <!-- CATEGORY BOX -->
    <el-table :default-sort = "{prop: 'id', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="categories" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" :sortable="true" :label="translate('name')" width="670">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button type="warning" v-if="userCan('editCategory')" @click="editCategory(scope.row.id)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removeCategory')" @click="removeCategory(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="categoriesAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { categoryService } from '@/services/category.service.js'


export default {
  name: 'Categories',
  mixins: [userMixin],
  data () {
    return {
      categoriesAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      categories: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD CATEGORIES *************************/

    loadCategories: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      categoryService.getCategoriesRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.categories = resp
           this.loading = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadCategories'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      categoryService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.categoriesAmount = response
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

    /************************** REMOVE CATEGORY *************************/

    removeCategory: function(id) {
      this.$confirm(this.translate('removeCategoryConfirmation'), 'Warning', {
        confirmButtonText: this.translate('yes'),
        cancelButtonText: this.translate('cancel'),
        type: 'warning'
      }).then(() => {
        categoryService.removeCategory(id).then(response => {
          if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
          else if(response.data && response.data.type == "success") {
            this.$message({ type: 'success', message: response.data.msg});
            this.loadPages()
            this.loadCategories()
          } else throw "error"
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('accessDeniedMsg'), type: 'warning'})
        })

     }).catch((err) => {
       //removing canceled
     });
   },

   /************************** EDIT CATEGORY  *************************/

   editCategory: function(id) {
        this.$router.push({ path: '/category/edit/'+id })
  }


  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeCategory')) this.getOut();

          //load products
          this.loadCategories();

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

.addCategoryBtn {
  margin-top: 10px;
  float: right;
}

</style>
