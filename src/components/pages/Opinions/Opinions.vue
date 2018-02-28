<template>

  <div class="opinions" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/opinions' }"><span v-lang.opinions></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 v-lang.opinions></h2>

    <!-- OPINIONS BOX -->
    <div class="opinions" v-show="opinions.length">
      <div class="opinion" v-for="(op, index) in opinions">
        <p><strong>{{ op.product }}</strong>, dodane przez {{ op.author }}</p>
        <p>{{ op.opinion }}</p>
         <el-button type="success" v-if="userCan('acceptOpinion')" @click="acceptOpinion(op.id)" plain size="small" icon="el-icon-check">{{ translate('accept') }}</el-button>
         <el-button type="warning" v-if="userCan('rejectOpinion')" @click="rejectOpinion(op.id)" plain size="small" icon="el-icon-close">{{ translate('reject') }}</el-button>
         <div class="line"></div>
      </div>
    </div>
    <el-alert :title="translate('noData')" type="info" v-if="!opinions.length" show-icon></el-alert>

    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="opinionsAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { opinionService } from '@/services/opinion.service.js'


export default {
  name: 'Opinions',
  mixins: [userMixin],
  data () {
    return {
      opinionsAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      opinions: [],
      indexMethod: 1
    }
  },
  methods: {

    /************************** LOAD OPINIONS *************************/

    loadOpinions: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      opinionService.getOpinionsRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else {
           this.opinions = resp
           this.loading = false
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadOpinions'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      opinionService.countAwaiting().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.opinionsAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** ACCEPT OPINION *************************/

    acceptOpinion: function(id) {

      this.loading = true
      opinionService.acceptOpinion(id).then(response => {
        if(response.data && response.data.type == "error") {
          this.$message({title: this.translate('error'), message: response.data.msg, type: 'error'})
        }
        else {
           this.$message({title: this.translate('success'), message: response.data.msg, type: 'success'})
           this.loadOpinions()
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('errorMsg'), type: 'warning'})
      })
    },

    /************************** REJECT OPINION *************************/

    rejectOpinion: function(id) {

      this.loading = true
      opinionService.rejectOpinion(id).then(response => {
        if(response.data && response.data.type == "error") {
          this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        }
        else {
           this.$message({title: this.translate('success'), message: response.data.msg, type: 'success'})
           this.loadPages();
           this.loadOpinions()
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('errorMsg'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadOpinions()
    },


  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeOpinion')) this.getOut();

          //load opinions
          this.loadOpinions();

          //load pages amount
          this.loadPages();

      })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 .opinion {
   margin: 30px 0;
 }

</style>
