<template>

  <div class="users" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newsletter' }"><span v-lang.newsletter></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.newsletter></h2>

    <!-- ADD NEWSLETTER BTN -->
    <router-link to="/newsletter/send"><el-button type="success" v-if="userCan('sendNewsletter')" class="addNewsletterBtn" plain size="small" icon="el-icon-plus">{{ translate('addNewsletter') }}</el-button>
    </router-link>

    <!-- NEWSLETTER SHOW DIALOG -->
    <el-dialog :title="newsletterSelected.title" :visible.sync="showDialogVisible" width="40%">

      <p style="margin-top: 0" class="text-muted text-smaller"><strong v-lang.date_sent></strong>: {{ newsletterSelected.date_sent }}</p>
      <div class="line"></div>
      <div v-html="newsletterSelected.content"></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false" v-lang.back></el-button>
      </span>
    </el-dialog>


    <!-- NEWSLETTER BOX -->
    <el-table :default-sort = "{prop: 'id', order: 'ascending'}" :empty-text="translate('noData')" v-loading="loading" :data="newsletters" stripe style="width: 100%">
      <el-table-column :sortable="true" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="title" :sortable="true" :label="translate('title')" width="800">
      </el-table-column>
      <el-table-column :label="translate('operations')" width="100">
        <template slot-scope="scope">
          <el-button type="primary" v-if="userCan('seeNewsletter')" @click="showNewsletter(scope.row)" plain size="small" icon="el-icon-search">{{ translate('show') }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- PAGINATION -->
    <div class="block">
      <el-pagination @current-change="handlePageChange" :currentPage="page" layout="prev, pager, next" :total="newslettersAmount">
      </el-pagination>
    </div>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userMixin } from '@/services/user.service.js'
import { newsletterService } from '@/services/newsletter.service.js'


export default {
  name: 'Newsletters',
  mixins: [userMixin],
  data () {
    return {
      newslettersAmount: 0,
      page: 1,
      itemsPerPage: 10,
      loading: true,
      newsletters: [],
      indexMethod: 1,
      newsletterSelected: {},
      showDialogVisible: false
    }
  },
  methods: {

    /************************** LOAD USERS *************************/

    loadNewsletters: function() {

      const limit_from = (this.page-1)*10
      const limit_to = this.page*10

      newsletterService.getNewslettersRange(limit_from, limit_to).then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.newsletters = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadNewsletters'), type: 'warning'})
      })
    },

    /************************** LOAD PAGES *************************/

    loadPages: function() {

      newsletterService.count().then(response => {
        if(response.data && response.data.type == "error") this.$notify({title: this.translate('error'), message: response.data.msg, type: 'error'})
        else {
           this.newslettersAmount = response
         }
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntHandlePagination'), type: 'warning'})
      })
    },

    /************************** HANDLE PAGE CHANGE  *************************/

    handlePageChange: function(val) {
        this.page = val
        this.loading = true
        this.loadNewsletters()
    },

    /************************** SHOW NEWSLETTER  *************************/

    showNewsletter: function(letter) {
        this.newsletterSelected = letter
        this.showDialogVisible = true;
    },


  },
  created: function() {

      this.signIn().then(user => {
          if(!this.userCan('seeNewsletter')) this.getOut();

          //load products
          this.loadNewsletters();

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

.addNewsletterBtn {
  margin-top: 40px;
  float: right;
}

</style>
