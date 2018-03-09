<template>
<div class="promotionsAdd" v-loading="loading">

  <!-- BREADCUMB -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/promotions' }"><span v-lang.promotions></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/promotions/add' }"><span v-lang.addPromotion></span></el-breadcrumb-item>
  </el-breadcrumb>

  <!-- TITLE -->
  <h2 class="title" v-lang.addPromotion></h2>

  <!-- FORM -->

  <el-form :model="promotion" label-position="left" ref="promotionForm" @submit.native.prevent label-width="150px">

    <el-row>
      <el-col :span="12">

        <!-- BASIC DATA -->
        <h3 v-lang.basicInfo></h3>
        <div class="line"></div>


        <!-- name -->
        <el-form-item :rules="[{ required: true, message: this.translate('validateNameIsRequired'), trigger: 'blur' }, { min: 3, max: 50, message: this.translate('validateLength', { min: 3, max: 50}), trigger: 'blur' }, { pattern: /^([0-9a-zÀÁÂÃÄÅĄÇÈÉÊËĘÌÍÎÏÒÓÓÔÕÖßÙÚÛÜÝàąáâãäåçèéęêëìíîïłðòóóôõöùúûüýÿ\s])+$/i, message: this.translate('validateAlphaSpaceNumbers')}]" :label="translate('name')" prop="name">
          <el-input v-model="promotion.name"></el-input>
        </el-form-item>

        <!-- start at -->
        <el-form-item :label="translate('start_at')" :rules="[{ required: true, message: this.translate('validateItsRequired')}]">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="promotion.start_at" type="datetime" :placeholder="translate('pickDateAndTime')"></el-date-picker>
        </el-form-item>

        <!-- end at -->
        <el-form-item :label="translate('end_at')" :rules="[{ required: true, message: this.translate('validateItsRequired')}]">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="promotion.end_at" type="datetime" :placeholder="translate('pickDateAndTime')"></el-date-picker>
        </el-form-item>

        <!-- products -->
        <el-form-item :label="translate('products')">
          <el-radio-group v-model="promotion.products_type">
            <el-radio label="single">{{ translate('single') }}</el-radio>
            <el-radio label="several">{{ translate('several') }}</el-radio>
            <el-radio label="all">{{ translate('all') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="promotion.products_type != 'all'" label="" prop="products">
          <el-select :placeholder="translate('addProduct')" @change="addProduct()" v-model="product">
            <el-option :key="prod.id" v-for="(prod, index) in products" :label="prod.name" :value="prod"></el-option>
          </el-select>
          <div>
            <el-tag v-for="product in promotion.products" :key="product.name" closable type="" @close="delProduct(product)" size="small"> {{product.name}}</el-tag>
          </div>
        </el-form-item>

        <!-- DISCOUNT DATA -->
        <h3 v-lang.discountData></h3>
        <div class="line"></div>

        <!-- percent less -->
        <el-form-item :label="translate('percent_less')" prop="percent_less" :rules="[{ required: true, message: this.translate('validateItsRequired')}, { type: 'number', message: this.translate('validateNumber')}, { validator: percentValidator, trigger: 'blur' }]">
            <el-input type="number" min=0 max=100 v-model.number="promotion.percent_less" auto-complete="off"></el-input>
        </el-form-item>

        <!-- amount less -->
        <el-form-item :label="translate('amount_less')" prop="amount_less" :rules="[{ required: true, message: this.translate('validateItsRequired')}, { type: 'number', message: this.translate('validateNumber')}, { validator: amountValidator, trigger: 'blur' }]">
            <el-input type="number" min=0 v-model.number="promotion.amount_less" auto-complete="off"></el-input>
        </el-form-item>

      </el-col>
      <el-col :span="12">

        <!-- image -->
        <el-form-item label="">
          <image-explorer width="300px" height="300px" style="margin-top: 50px;" v-on:chosenImage="promotion.image = $event" />
        </el-form-item>

      </el-col>
    </el-row>

    <!-- Add user button -->
    <el-button type="success" size="small" @click="addPromotion" icon="el-icon-plus">{{ translate('addPromotion') }}</el-button>

  </el-form>


</div>
</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { productService } from '@/services/product.service.js'
import { promotionService } from '@/services/promotion.service.js'

/* IMPORT IMAGE EXPLORER */
import imageExplorer from '@/components/shared/imageExplorer'

export default {
  name: 'PromotionsAdd',
  mixins: [userMixin],
  data() {
    return {
      loading: true,
      user_groups: [],
      promotion: {
        name: '',
        products: [],
        products_type: 'single',
        percent_less: 0,
        amount_less: 0,
        image: '',
        start_at: '',
        end_at: '',
      },
      products: [],
      product: ''
    }
  },
  methods: {

    /*********************** PERCENT VALIDATOR *********************/

    percentValidator(rule, value, callback) {
      if (value < 0 || value > 100) {
        callback(new Error(this.translate('validateLength',{ min: 0, max: 100})));
      } else {
        callback();
      }
    },

    /*********************** AMOUNT VALIDATOR *********************/

    amountValidator(rule, value, callback) {
      if (value < 0) {
        callback(new Error(this.translate('validateLength',{ min: 0, max: 'brak granicy'})));
      } else {
        callback();
      }
    },


    /****************************** PREAPRE FORM *****************************/

    prepareForm() {

        //get products
        productService.getAllShort().then(response => {
          const resp = response.data
          if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
          else if(resp.type && resp.type == "success") {
             this.products = resp.msg
             this.loading = false
           } else throw 'err'
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('couldntLoadProducts'), type: 'warning'})
            setTimeout(() => window.location = '/promotions', 3000)
        })

    },

    /****************************** ADD PROMOTION ********************************/

    addPromotion() {

      this.loading = true

      this.$refs['promotionForm'].validate((valid) => {

          if (!valid) {
              this.$message.error(this.translate('validationWentWrong'))
              this.loading = false
              return false
          }

          //prepare data
          const promotion = Object.assign({}, this.promotion)

          if(promotion.products_type == "all") {
              promotion.products.splice(0,promotion.length)
              promotion.products = this.products.slice()
          }

          promotion.image = (promotion.image) ? parseInt(promotion.image.id) : '';

          promotion.products = promotion.products.map(item => parseInt(item.id))
          //promotion.products = JSON.parse(promotion.products)
          promotionService.addPromotion(promotion).then(response => {

              if(response.data && response.data.type == "error") {

                  //prepare errors array and notify about them
                  let errors = Object.values(response.data.msg)
                  errors = this.translate('validationWentWrong') + errors.reduce((sum, item) => sum+'<li>'+item+'</li>', '<ul>') + '</ul>'
                  this.$message({title: this.translate('error'), message: errors, type: 'warning', dangerouslyUseHTMLString: true})

              }
              else if(response.data && response.data.type == "success") this.$message({title: this.translate('success'), message: response.data.msg, type: 'success'})
              else this.$message.error(this.translate('errorMsg'));

              this.loading = false

          }).catch(err => {
              this.$message.error(this.translate('errorMsg'))
              this.loading = false
          })

      });

    },

    /****************************** ADD PRODUCT *************************************/

    addProduct() {

      if(this.promotion.products_type == "single") {
        this.promotion.products.splice(0,this.promotion.products.length)
        this.promotion.products.push(this.product)
      }
      else if(this.promotion.products_type == "several") {
        if(this.promotion.products.indexOf(this.product) == -1) this.promotion.products.push(this.product)
      }

    },

    /***************************** REMOVE PRODUCT ***********************************/

    delProduct(elem) {

      this.promotion.products.splice(this.promotion.products.indexOf(elem), 1)
    }

  },
  created: function() {

    this.signIn().then(user => {

      if (!this.userCan('addPromotion')) this.getOut();

        this.prepareForm();

    })

  },
  components: {
    imageExplorer: imageExplorer
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

.el-input, .el-textarea {
  max-width: 250px;
}

.el-button {
  margin-top: 5px;
  margin-right: 5px;
}

.icon {
  margin-right: 10px;
}

.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: initial;
}
</style>
