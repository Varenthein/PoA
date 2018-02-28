<template>

  <div class="products" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/products' }"><span v-lang.products></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.products></h2>

    <!-- ADD PRODUCT BTN -->
    <router-link to="/products/add"><el-button type="success" v-if="userCan('addProduct')" class="addProductBtn" plain size="small" icon="el-icon-plus">{{ translate('addProduct') }}</el-button>
    </router-link>

    <!-- PRODUCTS BOX -->
    <el-table :default-sort = "{prop: 'name', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="products" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" :label="translate('product')" width="670">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button type="warning" v-if="userCan('acceptOpinion')" @click="acceptOpinion(scope.row.id)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removeProduct')" @click="removeProduct(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="productsAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { productService } from '@/services/product.service.js'


export default {
  name: 'Products',
  mixins: [userMixin],
  data () {
    return {
      productsAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      products: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD PRODUCTS *************************/

    loadProducts: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      productService.getProductsRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.products = resp
           this.loading = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadProducts'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      productService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.productsAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadProducts()
    },

    /************************** REMOVE PRODUCT  *************************/

    removeProduct: function(id) {
      this.$confirm(this.translate('removeProductConfirmation'), 'Warning', {
        confirmButtonText: this.translate('yes'),
        cancelButtonText: this.translate('cancel'),
        type: 'warning'
      }).then(() => {
        productService.removeProduct(id).then(response => {
          if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
          else {
            this.$message({
              type: 'success',
              message: this.translate('productDeleted')
            });
            this.loadPages()
            this.loadProducts()
          }
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('accessDeniedMsg'), type: 'warning'})
        })

     }).catch(() => {
       //removing canceled
     });
   }


  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeProduct')) this.getOut();

          //load products
          this.loadProducts();

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

.addProductBtn {
  margin-top: 10px;
  float: right;
}

</style>
