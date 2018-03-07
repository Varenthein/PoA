<template>
<div class="userGroupsEdit" v-loading="loading">

  <!-- BREADCUMB -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/users/groups' }"><span v-lang.userGroups></span></el-breadcrumb-item>
    <el-breadcrumb-item><span v-lang.editUserGroup></span></el-breadcrumb-item>
  </el-breadcrumb>

  <!-- TITLE -->
  <h2 class="title" v-lang.addUserGroups></h2>

  <!-- FORM -->

  <el-form :model="userGroup" label-position="left" ref="userGroupForm" @submit.native.prevent label-width="200px">

        <!-- name -->
        <el-form-item :rules="[{ required: true, message: this.translate('validateGroupNameIsRequired'), trigger: 'blur' }, { min: 3, max: 30, message: this.translate('validateLength', { 'min': 3, 'max': 30}), trigger: 'blur' }, { pattern: /^([a-zÀÁÂÃÄÅĄÇÈÉÊËĘÌÍÎÏÒÓÓÔÕÖßÙÚÛÜÝàąáâãäåçèéęêëìíîïłðòóóôõöùúûüýÿ\s])+$/i, message: this.translate('validateAlphaSpace')}]" :label="translate('name')" prop="name">
          <el-input v-model="userGroup.name"></el-input>
        </el-form-item>

        <h3 v-lang.permissions></h3>
        <div class="line"></div>

        <!-- perms -->
        <el-row>
          <el-col v-for="n in Math.ceil((Object.keys(userGroup.perms).length/10))" :span="8">
              <el-form-item v-if="index >= (n-1)*10 && index < ((n-1)*10)+10" v-for="(item, key, index) in userGroup.perms" :label="key">
                  <el-switch v-model="userGroup.perms[key]"></el-switch>
              </el-form-item>
          </el-col>
        </el-row>

    <!-- Add user button -->
    <el-button type="success" size="small" @click="editUserGroup" icon="el-icon-plus">{{ translate('addUserGroup') }}</el-button>

  </el-form>


</div>
</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'


export default {
  name: 'UsersGroupEdit',
  mixins: [userMixin],
  data() {
    return {
      loading: true,
      userGroup: {
        name: '',
        perms: {}
      }
    }
  },
  methods: {

    /****************************** PREAPRE FORM *****************************/

    prepareForm() {

        //get user group
        userService.getUserGroupById(this.$route.params.id).then(response => {
          const resp = response.data
          if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
          else if(resp.type && resp.type == "success") {
             const perms = JSON.parse(resp.msg.perms)
             this.userGroup = resp.msg
             this.userGroup.perms = JSON.parse(this.userGroup.perms)
             this.loading = false
           } else throw 'err'
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('couldntLoadUserGroups')+err, type: 'warning'})
            setTimeout(() => this.$router.push({ path: '/users/groups' }), 3000)
        })

    },

    /****************************** ADD USER ********************************/

    editUserGroup() {

      this.loading = true

      this.$refs['userGroupForm'].validate((valid) => {

          if (!valid) {
              this.$message.error(this.translate('validationWentWrong'))
              this.loading = false
              return false
          }

          //prepare data
          const userGrp = Object.assign({}, this.userGroup)
          userGrp.perms = JSON.stringify(this.userGroup.perms)

          userService.editUserGroup(userGrp.id, userGrp).then(response => {

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

      this.userCan('editUserGroup');
      if (!this.userCan('editUserGroup')) this.getOut();
      this.prepareForm();

    })

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

.el-tag+.el-tag {
  margin-left: 10px;
}

.el-button {
  margin-top: 5px;
  margin-right: 5px;
}

.icon {
  margin-right: 10px;
}

</style>
