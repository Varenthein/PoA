<template>
<div class="newsletterAdd" v-loading="loading">

  <!-- BREADCUMB -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/newsletter' }"><span v-lang.newsletter></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/newsletter/send' }"><span v-lang.sendNewsletter></span></el-breadcrumb-item>
  </el-breadcrumb>

  <!-- TITLE -->
  <h2 class="title" v-lang.sendNewsletter></h2>

  <!-- BASIC DATA -->
  <h4 v-lang.basicInfo></h4>

  <!-- FORM -->

  <el-form :model="newsletter" label-position="left" ref="newsletterForm" @submit.native.prevent label-width="120px">

        <!-- title -->
        <el-form-item :rules="[{ required: true, message: this.translate('validateNameIsRequired'), trigger: 'blur' }, { min: 3, max: 150, message: this.translate('validateLength', { min: 3, max: 150}), trigger: 'blur' }]" :label="translate('title')" prop="title">
          <el-input v-model="newsletter.title"></el-input>
        </el-form-item>

        <!-- receiver -->
        <el-form-item :label="translate('sendTo')">
          <el-radio-group v-model="newsletter.type">
            <el-radio label="0">{{ translate('all') }}</el-radio>
            <el-radio label="1">{{ translate('single') }}</el-radio>
          </el-radio-group>
          <el-select v-show="newsletter.type == '1'" style="margin-left: 20px" :placeholder="translate('choose')" v-model="newsletter.receiver">
            <el-option v-for="client in clients" :label="client.name" :value="client.id"></el-option>
          </el-select>
        </el-form-item>


        <!-- content -->
        <medium-editor :text='newsletter.content' class="mEditor" custom-tag='div' v-on:edit='updateDesc'></medium-editor>

        <!-- send button -->
        <el-button type="success" size="small" style="margin-top: 20px" @click="sendNewsletter" icon="el-icon-plus">{{ translate('sendNewsletter') }}</el-button>

  </el-form>


</div>
</template>

<script>
/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'
import { newsletterService} from '@/services/newsletter.service.js'

/* IMPORT MEDIUM EDITOR */
import editor from 'vue2-medium-editor'
import '@/assets/css/medium/mediumEditor.min.css'
import '@/assets/css/medium/beagle.min.css'


export default {
  name: 'NewsletterAdd',
  mixins: [userMixin],
  data() {
    return {
      loading: true,
      newsletter: {
        title: '',
        content: '',
        date_sent: '',
        type: "0",
        receiver: ''
      },
      clients: []
    }
  },
  methods: {

    /***************************** PREPARE FORM *******************************/
    prepareForm() {

      newsletterService.getClients().then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.clients = resp.msg
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadClients'), type: 'warning'})
          setTimeout(() => window.location = '/newsletter', 3000)
      })
    },

    /***************************** UPDATE DESC *******************************/
    updateDesc(operation) {
      this.newsletter.content = operation.api.origElements.innerHTML
    },

    /****************************** SEND NEWSLETTER ********************************/
    sendNewsletter() {

      this.loading = true

      this.$refs['newsletterForm'].validate((valid) => {

          if (!valid) {
              this.$message.error(this.translate('validationWentWrong'))
              this.loading = false
              return false
          }

          //prepare data
          const letter = Object.assign({}, this.newsletter)
          letter.type = (letter.type == "0") ? 0 : 1

          newsletterService.sendNewsletter(letter).then(response => {

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

    }
  },
  created: function() {

    this.signIn().then(user => {

      if (!this.userCan('sendNewsletter')) this.getOut();
      this.prepareForm()

    })

  },
  components: {
  'medium-editor': editor
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* MEDIUM EDITOR */

.el-input {
  width: auto;
}
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
