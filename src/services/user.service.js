import api from '@/config/api.config'

export const userService = {

  /********** USER CAN *************/

  userCan: (perm) => {
    return ($USER.permissions[perm])
  },

  /********** GET USER BY ID ************/

  getUserById: (id) => {
    return api.get('/user/id/'+id)
  },

  /********** GET LOGGED USER  ************/

  getLoggedUser: () => {
    return api.get('/user/getLogged')
  },

  /********** IS LOGGED ************/

  isLogged: () => {

    return new Promise(function(resolve, reject) {
      api.get('/user/getLogged').then(response => {
        if (response.data.login.length) resolve(true)
        else reject(false)
      }).catch(err => {
        reject(false)
      })
    })

  }

}

export const userMixin = {
  data () {
    return {
      User: {}
    }
  },
  methods: {

    signIn: function() {

      return new Promise((resolve, reject) => {
        userService.getLoggedUser().then(response => {
          if (response.data.login.length) {
            let User = response.data
            User.permissions = JSON.parse(User.permissions)
            Object.keys(User.permissions).map((key, index) => {
                User.permissions[key] = (User.permissions[key] == "true") ? true : false
            })
            this.User = User
            resolve(User)
          }
          else this.getOut()
        }).catch(err => {
          this.getOut()
        })
      })

    },

    getOut: function() {
      this.$notify({title: this.translate('accessDenied'), message: this.translate('accessDeniedMsg'), type: 'error'})
      setTimeout(() => window.location = "/", 3000)
    },

    userCan: function (perm) {
      if(this.User.permissions[perm]) return true
      else return false
    }
  }
}
