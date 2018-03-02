<template>

  <div class="orders" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }"><span v-lang.orders></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.orders></h2>

    <!-- CHANGE STATUS DIALOG -->
    <el-dialog :title="translate('editOrderStatus')" :visible.sync="statusDialogVisible" width="40%">

      <!-- statuses -->
      <el-form label-position="left" ref="orderForm" @submit.native.prevent label-width="120px">
            <el-form-item :label="translate('status')" prop="icon">
              <el-select :placeholder="translate('choose')" v-model="editedOrder.status">
                <el-option :key="status.id" v-for="status in statuses" v-if="status.id >= editedOrder.status" :label="status.name" :value="status.id"> {{ status.name }}</el-option>
              </el-select>
            </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false" v-lang.cancel></el-button>
        <el-button type="primary" @click="changeStatus" v-lang.edit>Confirm</el-button>
      </span>
    </el-dialog>

    <!-- ORDERS BOX -->
    <el-table :row-class-name="orderClassname" :default-sort="{prop: 'date_recieved', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="orders" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="product" :sortable="true" :label="translate('product')" width="280">
      </el-table-column>
      <el-table-column prop="date_recieved" :sortable="true" :label="translate('date_recieved')" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ (isToday(scope.row)) ? translate('today') : scope.row.date_recieved }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :sortable="true" :label="translate('status')" width="120">
        <template slot-scope="scope">
        {{ translate('orderStatus'+scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="translate('operations')" width="300">
        <template slot-scope="scope">
          <el-button type="primary" v-if="userCan('editOrder')" @click="editCategory(scope.row.id)" plain size="small" icon="el-icon-view">{{ translate('show') }}</el-button>
          <el-button type="warning" v-if="userCan('editOrderStatus')" @click="showOrderDialog(scope.row)" plain size="small" icon="el-icon-edit">{{ translate('edit') }}</el-button>
          <el-button type="danger" v-if="userCan('removeOrder')" @click="removeOrder(scope.row.id)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="ordersAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { orderService } from '@/services/order.service.js'

/* IMPORT UTILS */
import { getCurrentDate } from '@/utils/functions.js'

export default {
  name: 'Orders',
  mixins: [userMixin],
  data () {
    return {
      editedOrder: {},
      statuses: [],
      statusDialogVisible: false,
      ordersAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      orders: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD ORDERS *************************/

    loadOrders: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      orderService.getOrdersRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.orders = resp
           this.loading = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadOrders'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      orderService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.ordersAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadOrders()
    },

    /************************** ORDER CLASSNAME *************************/

    orderClassname: function(scope) {
      const DAY = 60 * 60 * 1000 * 24
      if ((new Date(getCurrentDate()) - new Date(scope.row.date_recieved)) > DAY) {
       return 'warning-row'
     } else return ''

    },

    /************************** IS TODAY *************************/

    isToday: function(row) {
      const DAY = 60 * 60 * 1000 * 24
      if ((new Date(getCurrentDate()) - new Date(row.date_recieved)) < DAY) {
       return true
     } else return false
    },

   /************************** SHOW ORDER DIALOG  *************************/

   showOrderDialog(order) {
     order.status = parseInt(order.status)
     this.editedOrder = Object.assign({}, order);
     this.statusDialogVisible = true
   },

   /************************** CHANGE STATUS  *************************/

   changeStatus() {
     this.statusDialogVisible = false
     orderService.changeStatus(this.editedOrder).then(response => {

         if(response.data && response.data.type == "error") {

             //prepare errors array and notify about them
             let errors = Object.values(response.data.msg)
             errors = this.translate('validationWentWrong') + errors.reduce((sum, item) => sum+'<li>'+item+'</li>', '<ul>') + '</ul>'
             this.$message({title: this.translate('error'), message: errors, type: 'warning', dangerouslyUseHTMLString: true})

         }
         else if(response.data && response.data.type == "success") {

             this.$message({title: this.translate('success'), message: response.data.msg, type: 'success'})
             this.loadOrders();

         }
         else this.$message.error(this.translate('errorMsg'));

         this.loading = false

     }).catch(err => {
         this.$message.error(this.translate('errorMsg'))
         this.loading = false
     })
   },

   /************************** REMOVE ORDER *************************/

   removeOrder: function(id) {
     this.$confirm(this.translate('removeOrderConfirmation'), 'Warning', {
       confirmButtonText: this.translate('yes'),
       cancelButtonText: this.translate('cancel'),
       type: 'warning'
     }).then(() => {
       orderService.removeOrder(id).then(response => {
         if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
         else if(response.data && response.data.type == "success") {
           this.$message({ type: 'success', message: response.data.msg});
           this.loadOrders()
           this.loadPages()
         } else throw "error"
       }).catch(err => {
           this.$notify({title: this.translate('error'), message: this.translate('accessDeniedMsg'), type: 'warning'})
       })

    }).catch((err) => {
      //removing canceled
    });
  },


  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeOrder')) this.getOut();

          //load products
          this.loadOrders();

          //load pages amount
          this.loadPages();

          //load statuses
          this.statuses = [{ id: 0, name: this.translate('orderStatus0')}, { id: 1, name: this.translate('orderStatus1')}, { id: 2, name: this.translate('orderStatus2')}]

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
