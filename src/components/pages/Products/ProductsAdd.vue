<template>

  <div class="productsAdd" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/products' }"><span v-lang.products></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/products/add' }"><span v-lang.addProduct></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.addProduct></h2>

    <!-- FORM -->

    <el-form :model="product" label-position="left" :rules="rules" ref="ruleForm" @submit.native.prevent label-width="120px">
      <el-row>
        <el-col :span="12">

        <!-- BASIC DATA -->
        <h4 v-lang.basicInfo></h4>

        <el-form-item :label="translate('name')" prop="name">
          <el-input v-model="product.name"></el-input>
        </el-form-item>

        <el-form-item required :label="translate('personalized')" prop="type">
          <el-switch v-model="product.type"></el-switch>
        </el-form-item>

        <el-form-item :label="translate('categories')" prop="categories">
          <el-select :placeholder="translate('addCategory')" @change="addCat()" v-model="category">
            <el-option v-for="cat in categories" :label="cat.name" :value="cat"></el-option>
          </el-select>
          <div>
              <el-tag v-for="cat in product.categories" :key="cat.name" closable type="" @close="delCat(cat)" size="small"> {{cat.name}}</el-tag>
          </div>
        </el-form-item>

        <div class="line"></div>

        <!-- TECHNICAL DATA -->
        <h4 v-lang.technicalData></h4>

        <el-table :empty-text="translate('noData')" v-loading="loading" :data="product.technical_data" stripe style="width: 100%">
          <el-table-column prop="name" :label="translate('param')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.param"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="translate('value')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope" width="100px">
              <el-button type="danger" @click="delParam(scope.row)" plain size="small" icon="el-icon-close">{{ translate('remove') }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="success" plain size="small" @click="addParam()" icon="el-icon-plus">{{ translate('addParam') }}</el-button>
        <div class="line"></div>

        <!-- PERSONALIZATION -->
        <h4 v-lang.personalization></h4>

        <image-explorer width="150px" height="150px" />
        <div class="option" v-for="option in product.options">
          <el-input v-model="option.title"></el-input>
          <el-button type="success" plain size="small" @click="addChoice(option)" style="float:right" icon="el-icon-plus">{{ translate('addChoice') }}</el-button>
          <el-button type="danger" @click="delOption(option)" style="float:right" plain size="small" icon="el-icon-close"></el-button>

        </div>

        <el-button type="success" plain size="small" @click="addOption()" icon="el-icon-plus">{{ translate('addOption') }}</el-button>
        <div class="line"></div>

        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
    </el-form>


  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { categoryService } from '@/services/category.service.js'
import { productService } from '@/services/product.service.js'

/* IMPROT OTHERS */
import imageExplorer from '@/components/shared/imageExplorer'


export default {
  name: 'ProductsAdd',
  mixins: [userMixin],
  data () {
    return {
      loading: true,
      categories: [],
      category: '',
      product: {
        name: '',
        description: '',
        photos: '',
        technical_data: [],
        categories: [],
        type: true,
        options: [],
        requirements: '',
        personalization: ''
      },
      rules: {}
    }
  },
  methods: {

    /***************************** PREAPRE FORM ********************************/

    prepareForm() {
      categoryService.getAll().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.categories = response.data
           this.rules = {
               name: [
                 { required: true, message: this.translate('validateNameIsRequired'), trigger: 'change' },
                 { min: 3, max: 100, message: this.translate('validateProdLength'), trigger: 'change' }
               ]
             }
           this.loading = false
        }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadCategories'), type: 'warning'})
      })
    },

    /***************************** ADD CATEGORY ********************************/

    addCat() {
      if(this.product.categories.indexOf(this.category) == -1) this.product.categories.push(this.category)
    },

    /***************************** REMOVE CATEGORY ********************************/

    delCat(cat) {
      this.product.categories.splice(this.product.categories.indexOf(cat),1)
    },

    /***************************** ADD PARAM ********************************/

    addParam() {
      this.$prompt(this.translate('name'), this.translate('addParam'), {
       confirmButtonText: this.translate('add'),
       cancelButtonText: this.translate('cancel'),
     }).then(value => {
        this.product.technical_data.push({ param: value.value, value: ''})
     }).catch(() => {
        //input cancelled
     });
   },

   /***************************** REMOVE PARAM ********************************/

   delParam(param) {
     this.product.technical_data.splice(this.product.technical_data.indexOf(param),1)
   },

   /***************************** ADD OPTION ********************************/

   addOption() {
     this.$prompt(this.translate('option'), this.translate('addOption'), {
      confirmButtonText: this.translate('add'),
      cancelButtonText: this.translate('cancel'),
    }).then(value => {
       this.product.options.push({ title: value.value, choices: ''})
    }).catch(() => {
       //input cancelled
    });
  },

  /***************************** REMOVE OPTION ********************************/

  delOption(opt) {
    this.product.options.splice(this.product.options.indexOf(opt),1)
  },

  /***************************** ADD CHOICE ********************************/

  addChoice(option) {
    this.$prompt(this.translate('choice'), this.translate('addOption'), {
     confirmButtonText: this.translate('add'),
     cancelButtonText: this.translate('cancel'),
   }).then(value => {
      this.product.options.push({ title: value.value, choices: ''})
   }).catch(() => {
      //input cancelled
   });
 },

  },
  created: function() {

      this.signIn().then(user => {

          if(!this.userCan('addProduct')) this.getOut();

          this.prepareForm();

      })

  }, components: { imageExplorer: imageExplorer }
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

.el-input {
  max-width: 250px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}

.el-button {
  margin-top: 5px;
  margin-right: 5px;
}
.option {
    border: dashed 2px #e6e6e6;
    padding: 10px;
    transition: .3s;
}

.option:hover {
    border: dashed 2px #aaa;
}

.option .el-input__inner {
  border:none;
  font-weight: bold;
}

</style>

<style>
.option .el-input__inner {
  border:none;
  font-weight: bold;
}
</style>
