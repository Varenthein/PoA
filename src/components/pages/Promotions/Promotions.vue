<template>

  <div class="promotions" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/promotions' }"><span v-lang.promotions></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.promotions></h2>

    <!-- ADD PROMOTION BTN -->
    <router-link to="/promotions/add"><el-button type="success" v-if="userCan('addPromotion')" class="addPromotionBtn" plain size="small" icon="el-icon-plus">{{ translate('addPromotion') }}</el-button>
    </router-link>

    <!-- PROMOTION BOX -->
    <el-table :default-sort = "{prop: 'id', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="promotions" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" :sortable="true" :label="translate('name')" width="410">
      </el-table-column>
      <el-table-column prop="percent_less" :sortable="true" :label="translate('discount', { unit: '%'})" width="150">
      </el-table-column>
      <el-table-column prop="amount_less" :sortable="true" :label="translate('discount', { unit: 'PLN'})" width="150">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button type="warning" v-if="userCan('editPromotion')" @click="editPromotion(scope.row.id)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removePromotion')" @click="removePromotion(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="promotionsAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { promotionService } from '@/services/promotion.service.js'


export default {
  name: 'Users',
  mixins: [userMixin],
  data () {
    return {
      promotionsAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      promotions: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD PRMOTIONS *************************/

    loadPromotions: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      promotionService.getPromotionsRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.promotions = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadPromotions'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      promotionService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.promotionsAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadPromotions()
    },

    /************************** EDIT PROMOTION  *************************/

    editPromotion: function(id) {
         this.$router.push({ path: '/promotions/edit/'+id })
    },

    /************************** REMOVE PROMOTION *************************/

    removePromotion: function(id) {
      this.$confirm(this.translate('removePromotionConfirmation'), 'Warning', {
        confirmButtonText: this.translate('yes'),
        cancelButtonText: this.translate('cancel'),
        type: 'warning'
      }).then(() => {
        promotionService.removePromotion(id).then(response => {
          if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
          else if(response.data && response.data.type == "success") {
            this.$message({ type: 'success', message: response.data.msg});
            this.loadPromotions()
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
          if(!this.userCan('seePromotion')) this.getOut();

          //load products
          this.loadPromotions();

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

.addPromotionBtn {
  margin-top: 40px;
  float: right;
}

</style>
