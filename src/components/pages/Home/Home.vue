<template>

  <div class="home" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }"><span v-lang.homepage></span></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="jumbotron">
        <h2><span v-lang.welcomeBack></span> {{ User.login }}!</h2>
        <ul>
          <li>- {{ ProductsAmount }} <span v-lang.productsTwisted></span></li>
          <li>- {{ OrdersAmount }} <span v-lang.ordersTwisted></span></li>
          <li>- {{ OpinionsAmount }} <span v-lang.opinionsTwisted></span></li>
        </ul>
    </div>

    <!-- ORDERS BOX -->
    <h3 v-lang.ordersWaiting></h3>
    <el-table :row-class-name="orderClassname" :default-sort = "{prop: 'date_recieved', order: 'ascending'}" :empty-text="translate('noAwaitingOrders')" v-loading="loadingOrders" :data="orders" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="date_recieved" :label="translate('id')" width="100">
        <template slot-scope="scope">
          OR-{{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="date_recieved" :label="translate('date_recieved')" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date_recieved }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="client" :label="translate('client')" width="160">
      </el-table-column>
      <el-table-column  prop="product" :label="translate('product')" width="270">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="showOrder(scope.row.id)" icon="el-icon-search"><span v-lang.show></span></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- OPINIONS BOX -->
    <h3 v-lang.opinionsWaiting></h3>
    <el-table :row-class-name="opinionClassname" :default-sort = "{prop: 'date_sent', order: 'ascending'}" :empty-text="translate('noAwaitingOpinions')" v-loading="loadingOpinions" :data="opinions" stripe style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{props.row.opinion}}</p>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column sortable prop="date_sent" :label="translate('date_recieved')" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date_sent }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="product" :label="translate('product')" width="270">
      </el-table-column>
      <el-table-column prop="opinion" :label="translate('opinion')" width="410">
        <template slot-scope="scope">
          <span>{{ trimOpinion(scope.row.opinion) }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService } from '@/services/user.service.js'
import { productService } from '@/services/product.service.js'
import { orderService } from '@/services/order.service.js'
import { opinionService } from '@/services/opinion.service.js'

/* IMPORT UTILS */
import { getCurrentDate } from '@/utils/functions.js'

export default {
  name: 'Home',
  data () {
    return {
      User: {},
      ProductsAmount: 0,
      OrdersAmount: 0,
      OpinionsAmount: 0,
      loading: true,
      loadingOrders: true,
      loadingOpinions: true,
      orders: [],
      opinions: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** TRIM *************************/

    trimOpinion: function(opinion) {
        let ending = ((opinion.length > 45) ? '...' : '')
        return opinion.substr(0,45)+ending
    },

    /************************** SHOW ORDER *************************/

    showOrder: function(id) {
        this.$router.push('order/'+id)
    },

    /************************** ORDER CLASSNAME *************************/

    orderClassname: function(scope) {
      const DAY = 60 * 60 * 1000 * 24
      if ((new Date(getCurrentDate()) - new Date(scope.row.date_recieved)) > DAY) {
       return 'warning-row'
     } else return ''

    },

    /************************** OPINION CLASSNAME *************************/

    opinionClassname: function(scope) {
      const DAY = 60 * 60 * 1000 * 24
      if ((new Date(getCurrentDate()) - new Date(scope.row.date_sent)) > DAY) {
       return 'warning-row'
     } else return ''

    },

    /************************** LOAD STATS *************************/

    loadStats: function() {
      const promises = [ userService.getLoggedUser(), productService.count(), orderService.count(), opinionService.count()]
      Promise.all(promises)
      .then(data => {
        this.User = data[0].data
        this.ProductsAmount = data[1]
        this.OrdersAmount = data[2]
        this.OpinionsAmount = data[3]
        this.loading = false
      })
      .catch(err => {
        this.$notify({title: this.translate('error'), message: this.translate('errorMsg'), type: 'error'})
      })
    },

    /************************** LOAD ORDERS *************************/

    loadOrders: function() {
      orderService.getAwaitingOrders().then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.orders = resp
           this.loadingOrders = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadOrders'), type: 'warning'})
      })
    },

    /************************** LOAD OPINIONS *************************/

    loadOpinions: function() {
      opinionService.getAwaitingOpinions().then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.opinions = resp
           this.loadingOpinions = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadOpinions'), type: 'warning'})
      })
    }

  },
  created: function() {

      //load stats for jumbotron
      this.loadStats()

      //load awaiting orders
      this.loadOrders()

      //load awaiting opinions
      this.loadOpinions()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.jumbotron {
  background: url('../../../assets/CoffeBack.jpg');
  background-size: cover;
  padding: 25px;
  color: #fff;
  min-height: 300px;
  margin: 20px 0;
  border-radius: 5px;
}

.jumbotron ul {
  list-style-type: none;
  margin: 20px 0;
  padding: 0;
}

.jumbotron ul  li {
  margin: 10px 0;
}

.el-table .warning-row {
   background: #f5c6cb;
 }
</style>
