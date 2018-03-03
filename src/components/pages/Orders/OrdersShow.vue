<template>

  <div class="orderShow" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }"><span v-lang.orders></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders/'+order.id }"><span>{{ order.product }} OR-{{ order.id }}</span></el-breadcrumb-item>
    </el-breadcrumb>

    <div id="printForm">

      <!-- TITLE -->
      <h2 class="title">{{ translate('orderDetails') }} (OR-{{ order.id}})</h2>

      <!-- PRINT BUTTON -->
      <el-button type="success" class="printBtn" plain size="small" @click="printOrder" icon="el-icon-printer">{{ translate('print') }}</el-button>

      <el-row>
        <el-col :span="12">

          <!-- BASIC DATA -->
          <h3 v-lang.basicInfo></h3>
          <div class="line"></div>

          <p><strong v-lang.product></strong>: {{ order.product }}</p>
          <p><strong v-lang.date_recieved></strong>: {{ order.date_recieved }}</p>
          <p><strong v-lang.status></strong>: {{ translate('orderStatus'+order.status) }}</p>
          <p v-if="order.notes"><strong v-lang.notes></strong></p>
          <p v-if="order.notes">{{ order.notes }}</p>

          <!-- ADDITIONAL DATA -->
          <h3 v-lang.additionaInfo></h3>
          <div class="line"></div>

          <div v-for="info in order.additional_info">
            <p><strong>{{ info.name }}</strong></p>
            <p>{{ info.value }}</p>
          </div>

          <el-alert :closable="false" :title="translate('noData')" v-if="!order.additional_info.length" type="info" show-icon></el-alert>


          <!-- PRODUCTION DETAILS -->
          <h3 v-lang.productionDetails></h3>
          <div class="line"></div>

          <div class="option" v-for="option in order.options">
            <strong>{{ option.option }}</strong>
            <div>
              <img :src="option.choice.image" alt="option image"> <p><strong>{{ option.choice.name }}</strong></p>
            </div>
          </div>

          <el-alert :closable="false" :title="translate('noData')" v-if="!order.options.length" type="info" show-icon></el-alert>

        </el-col>
        <el-col :span="12" style="padding-left: 30px;">

          <!-- PRODUCT IMAGE -->
          <div v-if="order.image" class="image">
              <img :src="order.image" alt="order image">
          </div>

          <!-- ATTACHEMENTS -->
          <h3 v-lang.attachements></h3>
          <div class="line"></div>

          <div class="file" v-for="file in order.files">
            <div>
              <img :src="file.file.image" alt="file image">
              <div>
                  <strong class="filename">{{ file.name }}</strong>
                  <p>{{ file.file.name }}</p>
              </div>
            </div>
          </div>

          <el-alert :closable="false" :title="translate('noFilesAttached')" v-if="!order.files.length" type="info" show-icon></el-alert>

          <!-- CLIENT BOX  -->
          <h3 v-lang.client></h3>
          <div class="line"></div>

          <p v-if="order.client"><strong v-lang.nameAndSurname></strong></p>
          <p v-if="order.client">{{ order.client }}</p>
          <p v-if="order.email"><strong v-lang.email></strong></p>
          <p v-if="order.email">{{ order.email }}</p>
          <p v-if="order.telephone"><strong v-lang.telephone></strong></p>
          <p v-if="order.telephone">{{ order.telephone }}</p>
          <p v-if="order.address"><strong v-lang.address></strong></p>
          <p v-if="order.address">{{ order.address }}</p>

        </el-col>
      </el-row>
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
  name: 'OrdersShow',
  mixins: [userMixin],
  data () {
    return {
      loading: true,
      order: {},
      statuses: []
    }
  },
  methods: {

    /************************** LOAD ORDER *************************/

    loadOrder() {

      //get order by id
      orderService.getById(this.$route.params.id).then(response => {

        if(response.data && response.data.type) {
            if(response.data.type == "success") {
              this.order = response.data.msg
              this.order.additional_info = JSON.parse(this.order.additional_info)
              this.order.options = JSON.parse(this.order.options)
              this.order.files = JSON.parse(this.order.files)
              this.loading = false
            }
            else if(response.data.type == "error") this.$message({title: this.translate('error'), message: response.data.msg, type: 'warning'  })
            else throw 'error'
        } else throw 'error'

      }).catch(err => {
        this.$message({title: this.translate('error'), message: this.translate('orderNotExists')+err, type: 'warning'  })
        setTimeout(() => this.$router.push({ path: '/orders' }), 3000)
      })

    },

    /****************************** PRINT ORDER *********************************/

    printOrder() {
      window.print()
    }

  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeOrder')) this.getOut();

          //load order
          this.loadOrder();

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

.printBtn {
  float: right;
  margin-top: 40px;
}

h3 {
  margin-top: 30px;
}
p {
  color: #333;
  font-size: 0.9em;
}

strong {
  font-weight: bold;
  text-decoration: underline;
  -webkit-font-smoothing: antialiased
}

/* OPTION */
.option > strong:first-child {
  text-decoration: underline;
  margin: 20px 0 10px 0;
  display: block;
}
.option img {
  width: 45px;
  height: 45px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  margin-right: 20px;
}
.option div {
  display: flex;
  align-items: center;
}
.option div strong {
  text-decoration: none;
}

/* FILE */
.file .filename {
  text-decoration: underline;
  margin: 20px 0 10px 0;
  display: block;
}
.file img {
  width: 60px;
  height: 60px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  margin-right: 20px;
}
.file > div {
  display: flex;
  align-items: center;
}

/* IMAGE */
.image {
  margin-top: 40px;
  width: 100%;
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  //border: 3px dashed #e6e6e6;
  padding: 20px 0px;
}

.image img {
  padding: 20px;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
</style>

<style>

/* STYLING FORM PRINTING */
@media print {

  header, .menu, .el-breadcrumb, .footer, .el-notification, footer, .printBtn {
    display: none;
  }

  .image {
    margin-top: -100px !important;
  }

  @page {
    size: auto;   /* auto is the initial value */
    margin-bottom: 0;  /* this affects the margin in the printer settings */
  }

}
</style>
