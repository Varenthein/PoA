<template>
<div class="productsAdd" v-loading="loading">

  <!-- BREADCUMB -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item><span v-lang.shopcms></span></el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/users' }"><span v-lang.users></span></el-breadcrumb-item>
    <el-breadcrumb-item><span v-lang.editUser></span></el-breadcrumb-item>
  </el-breadcrumb>

  <!-- TITLE -->
  <h2 class="title" v-lang.editUser></h2>

  <!-- FORM -->

  <el-form :model="user" label-position="left" ref="userForm" @submit.native.prevent label-width="120px">

    <el-row>
      <el-col :span="12">

        <!-- BASIC DATA -->
        <h3 v-lang.basicInfo></h3>
        <div class="line"></div>
        <p class="text-smaller text-muted" style="margin-bottom: 40px" v-lang.leavePassEmpty></p>

        <!-- name -->
        <el-form-item :rules="[{ required: true, message: this.translate('validateNameIsRequired'), trigger: 'blur' }, { min: 3, max: 30, message: this.translate('validateLoginLength'), trigger: 'blur' }, { pattern: /^([a-zÀÁÂÃÄÅĄÇÈÉÊËĘÌÍÎÏÒÓÓÔÕÖßÙÚÛÜÝàąáâãäåçèéęêëìíîïłðòóóôõöùúûüýÿ\s])+$/i, message: this.translate('validateAlphaSpace')}]" :label="translate('login')" prop="login">
          <el-input v-model="user.login"></el-input>
        </el-form-item>

        <!-- password -->
        <el-form-item :label="translate('password')" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>

        <!-- repeat  password -->
        <el-form-item :rules="[{ validator: passwordValidator, trigger: 'blur' }]" :label="translate('password_repeated')" prop="password_repeated">
          <el-input type="password" v-model="user.password_repeated"></el-input>
        </el-form-item>

        <!-- e-mail -->
        <el-form-item :rules="[{ required: true, message: this.translate('validateEmailIsRequired'), trigger: 'blur' }, { type: 'email', message: this.translate('validateEmailIsWrong'), trigger: 'blur,change' }]" :label="translate('email')" prop="email">
          <el-input type="email" v-model="user.email"></el-input>
        </el-form-item>

        <!-- user roles -->
        <el-form-item :label="translate('role')" :rules="[{ required: true, message: this.translate('validateRoleIsRequired'), trigger: 'blur' }]" prop="role">
          <el-select :placeholder="translate('chooseRole')" v-model="user.role">
            <el-option :key="role.id" v-for="role in user_groups" :value="role.id" :label="role.name"> {{ role.name }}</el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="12">

        <!-- avatar -->
        <el-form-item label="">
          <image-explorer v-if="user.avatar !== 0" width="300px" height="300px" style="margin-top: 50px;" :thumb="user.avatar.thumb" v-on:chosenImage="user.avatar = $event" />
        </el-form-item>

      </el-col>
    </el-row>

    <!-- Add user button -->
    <el-button type="success" size="small" @click="editUser" icon="el-icon-plus">{{ translate('editUser') }}</el-button>

  </el-form>


</div>
</template>

<script>

/* IMPORT SERVICES */
import { userService, userMixin } from '@/services/user.service.js'

/* IMPORT IMAGE EXPLORER */
import imageExplorer from '@/components/shared/imageExplorer'

export default {
  name: 'UsersEdit',
  mixins: [userMixin],
  data() {
    return {
      loading: true,
      user_groups: [],
      user: {
        login: '',
        password: '',
        password_repeated: '',
        role: '',
        avatar: 0
      }
    }
  },
  methods: {

    /****************************** LOAD USER *******************************/

    loadUser() {

      userService.getUserById(this.$route.params.id).then(response => {

        if(response.data && response.data.type) {
            if(response.data.type == "success") {
              this.user = response.data.msg;
            }
            else this.$message({title: this.translate('error'), message: response.data.msg, type: 'warning'  })
        } else throw 'error'

      }).catch(err => {
        this.$message({title: this.translate('error'), message: this.translate('userNotExists')+err, type: 'warning'  })
        setTimeout(() => this.$router.push({ path: '/users' }), 3000)
      })
    },

    /****************************** PREAPRE FORM *****************************/

    prepareForm() {

        //load user from DB
        this.loadUser();

        //prepare password match validator
        this.passwordValidator = (rule, value, callback) => {
            if (value === '') {

            } else if (value !== this.user.password) {
              callback(new Error(this.translate('validatePasswordsNotMatch')));
            } else {
              callback();
            }
        }

        //get user groups
        userService.getUserGroups().then(response => {
          const resp = response.data
          if(resp.type && resp.type == "error") this.$notify({title: this.translate('error'), message: resp.msg, type: 'error'})
          else if(resp.type && resp.type == "success") {
             this.user_groups = resp.msg
             this.loading = false
           } else throw 'err'
        }).catch(err => {
            this.$notify({title: this.translate('error'), message: this.translate('couldntLoadUserGroups'), type: 'warning'})
        })

    },

    /****************************** ADD USER ********************************/

    editUser() {

      this.loading = true

      this.$refs['userForm'].validate((valid) => {

          if (!valid) {
              this.$message.error(this.translate('validationWentWrong'))
              this.loading = false
              return false
          }

          //prepare data
          if(this.user.avatar.id) this.user.avatar = this.user.avatar.id;

          userService.editUser(this.user.id, this.user).then(response => {

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

      if (!this.userCan('editUser')) this.getOut();

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
