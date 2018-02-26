<template>

  <div class="imageExplorer">

    <!-- EXPLORER BOX -->
    <el-dialog :title="translate('choosePhoto')" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <h4 v-lang.addPhoto style=""></h4>
      <el-upload ref="upload" action="http://localhost:9000/api/image/upload"  :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="checkSuccess">
        <el-button plain type="success" size="small" icon="el-icon-plus">{{ this.translate('browse') }}</el-button>
      </el-upload>
      <div class="line"></div>

      <h4 v-lang.catalog></h4>
      <div :loading="imagesLoader" class="catalog">
        <ul class="el-upload-list el-upload-list--picture-card">
          <li v-for="img in images" @click="chooseImage(img)" tabindex="0" :class="(img.active) ? 'el-upload-list__item is-success active' : 'el-upload-list__item is-success'">
            <img :src="imagesPath+img.filename" alt="" class="el-upload-list__item-thumbnail">
            {{ img }}
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{img.filename}}</a>
            <i class="el-icon-close"></i><i class="el-icon-close-tip"></i>
            <span class="el-upload-list__item-actions">
              <span @click="removeImage(img)" class="el-upload-list__item-delete"><i class="el-icon-delete"></i></span>
            </span>
          </li>
        </ul>
      </div>
      <!-- PAGINATION -->
      <div class="block">
        <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="imagesAmount">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- EXPLORER BUTTON -->
    <el-button type="success" @click="loadExplorer" plain size="small" :style="btnStyle">{{ title }}</el-button>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { imageService } from '@/services/image.service.js'

export default {
  name: 'imageExplorer',
  props: {
    width: String,
    height: String,
    title: String
  },
  data () {
    return {
      imagesPath: 'http://localhost:9000/content/img/uploads/',
      btnStyle: { width: "45px", height: '30px'},
      btnTitle: '',
      dialogVisible: false,
      imagesLoader: true,
      imagesAmount: 0,
      page: 1,
      itemsPerPage: 10,
      images: [],
      image: {}
    }
  },
  methods: {

    /************** PREPARE BUTTON *****************/

    prepareBtn() {
      if(this.width) this.btnStyle.width = this.width
      if(this.height) this.btnStyle.height = this.height
      this.btnStyle.background = `url("http://via.placeholder.com/${this.width.replace('px','')}x${this.height.replace('px','')}")`
    },

    /************** PREPARE BUTTON *****************/

    checkSuccess(response, file, fileList) {
        //this.$refs.upload.clearFiles()
        this.loadPhotos()
        this.loadPages()
        if(response.type && response.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        return false
    },

    /************* LOAD EXPLORER *******************/

    loadExplorer() {
        this.dialogVisible = true
        this.loadPhotos()
        this.loadPages()
    },

    /************************** LOAD PHOTOS *************************/

    loadPhotos: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      imageService.getImagesRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
          resp.forEach(item => item.active = false)
           this.images = resp
           this.loading = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadImages'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      imageService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.imagesAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadPhotos()
    },

    /************************** REMOVE IMAGE *************************/

    removeImage: function(img) {
      imageService.removeImage(img.id).then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.images.splice(this.images.indexOf(img),1)
           this.loadPages()
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('errorMsg'), type: 'warning'})
      })
    },

    /************************ HANDLE REMOVE ************************/

    handleRemove(file, fileList) {
      imageService.removeImage(file.response.msg).then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.loadPages()
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('errorMsg'), type: 'warning'})
      })
    },

    /************************ CHOOSE IMAGE ************************/

    chooseImage(img) {
      this.images.forEach(item => item.active = false)
      img.active = true
    }

  },
  created: function () {

    //prepare button
    this.prepareBtn()

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imageExplorer .el-button {
}
.el-upload-list__item {
  cursor: pointer;
}
.el-upload-list__item.active {
  border: 2px solid #67c23a;
  opacity: 0.6;
  transform: scale(0.9);
}
</style>
