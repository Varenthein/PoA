<template>

  <div class="home" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/stats' }"><span v-lang.stats></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.stats></h2>

    <!-- PRODUCTS BOX -->
    <el-table :default-sort = "{prop: 'selled', order: 'descending'}" :empty-text="translate('noData')" v-loading="loading" :data="products" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" :sortable="true" :label="translate('product')" width="710">
      </el-table-column>
      <el-table-column :sortable="true" prop="selled" :label="translate('selled')" width="200">
      </el-table-column>
    </el-table>




  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userMixin, userService } from '@/services/user.service.js'
import { productService } from '@/services/product.service.js'

export default {
  name: 'Stats',
  mixins: [userMixin],
  data () {
    return {
      indexMethod: '',
      products: [],
      loading: true,
    }
  },
  methods: {

    /**************************** LOAD PRODUCTS ************************/

    loadProducts() {

      productService.getAllShort().then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           resp.msg.forEach(item => item.selled = parseInt(item.selled))
           this.products = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadProducts')+err, type: 'warning'})
          setTimeout(() => { window.location = '/stats' }, 3000)
      })

    }

  },
  created: function() {

    this.signIn().then(user => {

          //load options
          this.loadProducts()

    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

input {
  max-width: 400px;
}

label {
  font-weight: bold;
}

/* MEDIUM EDITOR */

.mEditor {
  min-height: 200px;
  border: dashed 2px #e6e6e6;
  transition: .3s;
  outline: none;
  padding: 20px;
}

.mEditor:hover, .mEditor:active {
  border: dashed 2px #aaa;
  outline: none;
}

.mEditor  {
  margin-top: 40px;
}

</style>
