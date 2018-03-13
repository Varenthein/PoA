<template>

  <div class="home" v-loading="loading">

    <!-- BREADCUMB -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/settings' }"><span v-lang.settings></span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- TITLE -->
    <h2 class="title" v-lang.settings></h2>

    <!-- OPTIONS BOX -->
    <el-form>

      <el-form-item v-for="opt in options" :label="opt.param" :prop="opt.param">
        <el-input v-if="opt.type == 'text'" v-model="opt.value"></el-input>
        <medium-editor v-else-if="opt.type == 'html'" :text='opt.value' class="mEditor" custom-tag='div' v-on:edit='(operation) => { opt.value = operation.api.origElements.innerHTML },'></medium-editor>
        <el-button type="success" plain size="small" @click="editOption(opt)" icon="el-icon-plus">{{ translate('edit') }}</el-button>
      </el-form-item>

    </el-form>

  </div>

</template>

<script>

/* IMPORT SERVICES */
import { userMixin, userService } from '@/services/user.service.js'
import { optionService } from '@/services/option.service.js'

/* IMPORT MEDIUM EDITOR */
import editor from 'vue2-medium-editor'
import '@/assets/css/medium/mediumEditor.min.css'
import '@/assets/css/medium/beagle.min.css'


export default {
  name: 'Settings',
  mixins: [userMixin],
  data () {
    return {
      options: [],
      loading: true,
      editable: {}
    }
  },
  methods: {

    /***************************** UPDATE DESC *******************************/

    updateDesc(operation) {
      console.log(operation, this.editable);
      //console.log(this.options[this.options.indexOf(opt)].value, operation.api.origElements.innerHTML)
      //this.options[this.options.indexOf(opt)].value = operation.api.origElements.innerHTML
    },

    /***************************** UPDATE DESC *******************************/

    editOption(opt) {

      optionService.setOption(opt.id,opt).then(response => {
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
    },

    /**************************** LOAD OPTIONS ************************/

    loadOptions() {

      optionService.getAll().then(response => {
        const resp = response.data
        if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
        else if(resp.type && resp.type == "success") {
           this.options = JSON.parse(JSON.stringify(resp.msg))
           this.loading = false
         } else throw 'err'
      }).catch(err => {
          this.$notify({title: this.translate('error'), message: this.translate('couldntLoadOptions')+err, type: 'warning'})
      })

    }

  },
  created: function() {

    this.signIn().then(user => {

        if(!this.userCan('seeOption')) this.getOut();

          //load options
          this.loadOptions()

    })

  },
  components: {
    'medium-editor': editor
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

input {
  max-width: 400px;
}

label {
  font-weight: bold;
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

.mEditor  {
  margin-top: 40px;
}

</style>
