<template>
<div class="productsEdit" v-loading="loading">

  <!-- BREADCUMB -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/products' }"><span v-lang.products></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/products/add' }"><span v-lang.addProduct></span></el-breadcrumb-item>
  </el-breadcrumb>

  <!-- TITLE -->
  <h2 class="title" v-lang.addProduct></h2>

  <!-- FORM -->

  <el-form :model="product" label-position="left" ref="productForm" @submit.native.prevent label-width="120px">
    <el-row>
      <el-col :span="12" style="padding-right: 30px;">

        <!-- BASIC DATA -->
        <h4 v-lang.basicInfo></h4>

        <el-form-item :rules="[{ required: true, message: this.translate('validateNameIsRequired'), trigger: 'blur' }, { min: 3, max: 100, message: this.translate('validateProdLength'), trigger: 'blur' }]" :label="translate('name')" prop="name">
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
        <div v-if="product.type" class="personalizationBox">
          <h4 v-lang.personalization></h4>

            <div class="option" v-for="option in product.options">
                <el-input class="simple" v-model="option.title"></el-input>
                <el-button type="success" plain size="small" @click="addChoice(option)" style="float:right" icon="el-icon-plus">{{ translate('addChoice') }}</el-button>
                <el-button type="danger" @click="delOption(option)" style="float:right" plain size="small" icon="el-icon-close"></el-button>

                <!-- choices -->
                <ul>
                    <li v-for="choice in option.choices">
                        <el-form :inline="true">
                          <el-form-item label="">
                            <el-tooltip class="item" effect="dark" :content="translate('name')" placement="top">
                              <el-input v-model="choice.param" style="width: 230px"></el-input>
                            </el-tooltip>
                          </el-form-item>
                          <el-form-item label="">
                            <el-tooltip class="item" effect="dark" :content="translate('price')" placement="top">
                              <el-input type="number" min="0" style="width: 90px" v-model="choice.price"></el-input>
                            </el-tooltip>
                          </el-form-item>
                          <el-form-item label="">
                            <image-explorer width="45px" height="45px" :thumb="choice.image.thumb" v-on:chosenImage="choice.image = $event" />
                          </el-form-item>
                        </el-form>
                    </li>
                </ul>
                <p class="text-muted text-smaller" v-if="!option.choices.length" style="margin-left: 15px" v-lang.clickNewChoice></p>
            </div>

            <el-button type="success" plain size="small" @click="addOption()" icon="el-icon-plus">{{ translate('addOption') }}</el-button>
            <div class="line"></div>
      </div>

      </el-col>
      <el-col :span="12">

        <!-- MEDIA BOX -->
        <div class="mediaBox">
          <h4 v-lang.images style="display: inline-block"></h4>
          <image-explorer width="150px" height="35px" style="float: right; margin-top: 15px" :title="translate('choosePhoto')" v-on:chosenImage="product.photos.push($event)" />
          <el-alert :closable="false" :title="translate('noImages')" v-if="!product.photos.length" type="info" show-icon></el-alert>
          <div class="catalog">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="img in product.photos" tabindex="0" class="el-upload-list__item is-success">
                <img :src="img.thumb" alt="" class="el-upload-list__item-thumbnail">
                <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{img.filename}}</a>
                <i class="el-icon-close"></i><i class="el-icon-close-tip"></i>
                <span class="el-upload-list__item-actions">
                        <span @click="removeImage(img)" class="el-upload-list__item-delete"><i class="el-icon-delete"></i></span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p v-if="product.photos.length" class="text-muted text-smaller" v-lang.youChosenPhotos="{photos: product.photos.length}"> </p>
        <div class="line"></div>

        <!-- SHORT DESCRIPTION -->
        <div class="shortDesc">
            <h4 v-lang.shortDesc></h4>
            <el-input type="textarea" :placeholder="translate('shortDescPlaceholder')" v-model="product.short_description"></el-input>
        </div>
        <div class="line"></div>

        <!-- DESCRIPTION -->
        <div class="longDesc">
            <h4 v-lang.longDesc></h4>
            <medium-editor :text='product.description' class="mEditor" :options="editorOptions" custom-tag='div' v-on:edit='updateDesc'></medium-editor>
        </div>
        <div class="line"></div>

        <!-- REQUIRED INFO -->
        <div class="requiredInfo">
            <h4 v-lang.requiredInfo style="display: inline-block"></h4>
            <el-button type="success" plain size="small" @click="addRequirement()" style="float:right; margin-top: 15px" icon="el-icon-plus">{{ translate('addRequirement') }}</el-button>
            <el-alert :closable="false" :title="translate('noRequirements')" v-if="!product.requirements.length" type="info" show-icon></el-alert>
            <ul>
              <li v-for="req in product.requirements">
                <strong>{{ req.name }}:</strong>
                <el-radio v-model="req.type" label="text">{{ translate('text')}}</el-radio>
                <el-radio v-model="req.type" label="file">{{ translate('file')}}</el-radio>
                <i style="float: right" class="el-icon-close el-button--danger is-plain" @click="delRequirement(req)"></i>
                <el-checkbox style="float: right" v-model="req.required">{{ translate('required') }}</el-checkbox>
                <el-collapse>
                  <el-collapse-item :title="translate('desc')">
                      <el-input type="textarea" :placeholder="translate('requirementDescPlaceholder')" v-model="req.desc"></el-input>
                  </el-collapse-item>
                </el-collapse>
              </li>
            </ul>
        </div>


      </el-col>
    </el-row>
    <el-button type="success" size="small" @click="editProduct" icon="el-icon-plus">{{ translate('editProduct') }}</el-button>
  </el-form>


</div>
</template>

<script>
/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { categoryService} from '@/services/category.service.js'
import { productService } from '@/services/product.service.js'

/* IMPORT IMAGE EXPLORER */
import imageExplorer from '@/components/shared/imageExplorer'

/* IMPORT MEDIUM EDITOR */
import editor from 'vue2-medium-editor'
import '@/assets/css/medium/mediumEditor.min.css'
import '@/assets/css/medium/beagle.min.css'



export default {
  name: 'ProductsEdit',
  mixins: [userMixin],
  data() {
    return {
      loading: true,
      categories: [],
      category: '',
      product: {
        name: '',
        short_description: '',
        description: '',
        photos: [],
        technical_data: [],
        categories: [],
        type: true,
        options: [],
        requirements: [],
        personalization: ''
      },
      rules: [],
      editorOptions: ''
    }
  },
  methods: {

    /***************************** PREAPRE FORM ********************************/

    prepareForm() {
      categoryService.getAll().then(response => {
        if (response.data && response.data.type == "error") this.$notify({
          title: this.translate('error'),
          message: response.data.msg,
          type: 'error'
        })
        else {
          this.categories = response.data
          this.rules = [{
                required: true,
                message: this.translate('validateNameIsRequired'),
                trigger: 'blur'
              },
              {
                min: 3,
                max: 100,
                message: this.translate('validateProdLength'),
                trigger: 'blur'
              }
            ]

          this.editorOptions = { placeholder: { text: this.translate('longDescPlaceholder') }, toolbar: {buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']}}
          this.loading = false
        }
      }).catch(err => {
        this.$notify({
          title: this.translate('error'),
          message: this.translate('couldntLoadCategories'),
          type: 'warning'
        })
      })
    },

    /***************************** ADD CATEGORY ********************************/

    addCat() {
      if (this.product.categories.indexOf(this.category) == -1) this.product.categories.push(this.category)
    },

    /***************************** REMOVE CATEGORY ********************************/

    delCat(cat) {
      this.product.categories.splice(this.product.categories.indexOf(cat), 1)
    },

    /***************************** ADD PARAM ********************************/

    addParam() {
      this.$prompt(this.translate('name'), this.translate('addParam'), {
        confirmButtonText: this.translate('add'),
        cancelButtonText: this.translate('cancel'),
      }).then(value => {
        this.product.technical_data.push({
          param: value.value,
          value: ''
        })
      }).catch(() => {
        //input cancelled
      });
    },

    /***************************** REMOVE PARAM ********************************/

    delParam(param) {
      this.product.technical_data.splice(this.product.technical_data.indexOf(param), 1)
    },

    /***************************** ADD OPTION ********************************/

    addOption() {
      this.$prompt(this.translate('option'), this.translate('addOption'), {
        confirmButtonText: this.translate('add'),
        cancelButtonText: this.translate('cancel'),
      }).then(value => {
        this.product.options.push({
          title: value.value,
          choices: []
        })
      }).catch(() => {
        //input cancelled
      });
    },

    /***************************** REMOVE OPTION ********************************/

    delOption(opt) {
      this.product.options.splice(this.product.options.indexOf(opt), 1)
    },

    /***************************** ADD CHOICE ********************************/

    addChoice(option) {
      this.$prompt(this.translate('name'), this.translate('addChoice'), {
        confirmButtonText: this.translate('add'),
        cancelButtonText: this.translate('cancel'),
      }).then(value => {
        option.choices.push({
          param: value.value,
          price: 0,
          image: ''
        })
      }).catch((err) => {
        //input cancelled
      });
    },

    /***************************** REMOVE IMAGE *******************************/

    removeImage(img) {
      this.product.photos.splice(this.product.photos.indexOf(img), 1)
    },

    /***************************** UPDATE DESC *******************************/
    updateDesc(operation) {
      this.product.description = operation.api.origElements.innerHTML
    },

    /***************************** UPDATE REQUIREMENT **************************/

    addRequirement() {
      this.$prompt(this.translate('name'), this.translate('addRequirement'), {
        confirmButtonText: this.translate('add'),
        cancelButtonText: this.translate('cancel'),
      }).then(value => {
        this.product.requirements.push({
          name: value.value,
          type: 'text',
          required: false,
          desc: ''
        })
      }).catch(() => {
        //input cancelled
      });
    },

    /***************************** REMOVE REQUIREMENT ********************************/

    delRequirement(req) {
      this.product.requirements.splice(this.product.requirements.indexOf(req), 1)
    },

    /***************************** ADD PRODUCT ********************************/

    editProduct() {
      this.$refs['productForm'].validate((valid) => {
          if (valid) {

            this.loading = true;
            let product = Object.assign({}, this.product);

            product.categories = JSON.stringify(product.categories.map(item => { return item.id} ))
            product.photos = JSON.stringify(product.photos.map(item => { return item.id} ))
            product.technical_data = JSON.stringify(product.technical_data)
            if(product.options.length) {
              product.options.forEach(option => {
                if(option.choices) {
                  option.choices.forEach(choice => {
                    if(choice.image != '') choice.image = choice.image.id
                  })
                }
              })
            }
            product.options = JSON.stringify(product.options)
            product.requirements = JSON.stringify(product.requirements)

            productService.editProduct(product.id, product).then(response => {
                if(response.data && response.data.type == "error") {
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

          } else {
            this.$message.error(this.translate('validationWentWrong'))
            return false;
          }
        });
    }

  },
  created: function() {

    this.signIn().then(user => {

      if (!this.userCan('editProduct')) this.getOut();

      productService.getById(this.$route.params.id).then(response => {

        if(response.data && response.data.type) {
            if(response.data.type == "success") {
              let product = response.data.msg;
              product.type = Boolean(parseInt(product.type))
              product.categories = JSON.parse(product.categories)
              product.options = JSON.parse(product.options)
              product.photos = JSON.parse(product.photos)
              product.technical_data = JSON.parse(product.technical_data)
              product.requirements = JSON.parse(product.requirements)
              this.product = product
              this.prepareForm()
            }
            else this.$message({title: this.translate('error'), message: response.data.msg, type: 'warning'  })
        } else this.$message({title: this.translate('error'), message: this.translate('productNotExists'), type: 'warning'  })

      }).catch(err => {
        this.$message({title: this.translate('error'), message: this.translate('productNotExists')+err, type: 'warning'  })
        setTimeout(() => this.$router.push({ path: '/products' }), 3000)
      })

    })

  },
  components: {
    imageExplorer: imageExplorer, 'medium-editor': editor
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

.el-input {
  max-width: 250px;
}

.el-tag+.el-tag {
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
  margin-bottom: 20px;
}

.option:hover {
  border: dashed 2px #aaa;
}

.option ul, .requiredInfo ul {
  list-style-type: none;
  padding-left: 0;
}

.requiredInfo ul li {
  border-bottom: dashed 1px #ccc;
  margin: 0px 0 5px 0px;
  padding: 10px 0;
}

.requiredInfo ul li .el-collapse {
  margin-top: 5px;
  margin-left: 25px;
  border-top: none;
}

.requiredInfo ul li  strong {
  margin-right: 30px;
}

.requiredInfo .el-icon-close {
  padding: 4px;
  border: 1px solid #f56c6c;
  border-radius: 3px;
  font-size: 0.8em;
  margin: 0 5px 0 50px;
  cursor: pointer;
}

.option ul form::before, .requiredInfo ul li::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  margin: 0 7px 22px 7px;
  background: #67c23a;
  opacity: 0.8;
  border-radius: 100%;
}

.requiredInfo ul li::before {
  display: inline-block;
  margin: 0px 8px;
}

.option form {
  display: flex;
  align-items: center;
}

.shortDesc textarea {
  height: 200px;
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

</style>

<style>
.option .simple.el-input {
  max-width: 200px;
}

.option .simple .el-input__inner {
  max-width: 200px;
  border: none;
  font-weight: bold;
}

.mEditor p:first-child {
  margin-top: 0;
}

</style>
