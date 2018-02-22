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
    <el-table empty-text="Nie masz zaległych zleceń :)" v-loading="loadingOrders" :data="orders" stripe style="width: 100%">
      <el-table-column prop="date_recieved" label="Date" width="180">
      </el-table-column>
      <el-table-column prop="client" label="Name" width="180">
      </el-table-column>
      <el-table-column  prop="product" label="Address">
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
      orders: []
    }
  },
  methods: {

    /************************** LOAD STATS *************************/

    loadStats: function(response) {
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

    loadOrders: function(response) {
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
    }


  },
  created: function() {

      //load stats for jumbotron
      this.loadStats()

      //load awaiting orders
      this.loadOrders()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
</style>
