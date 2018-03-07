import api from '@/config/api.config'

export const userService = {

  /********** COUNT ORDERS ************/

  count: () => {
    return new Promise(function(resolve, reject) {
      api.get('/user/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })
  },

  /********** USER CAN *************/

  userCan: (perm) => {
    return ($USER.permissions[perm])
  },

  /********** GET USER BY ID ************/

  getUserById: (id) => {
    return api.get('/user/id/'+id)
  },

  /********** GET USER GROUP BY ID ************/

  getUserGroupById: (id) => {
    return api.get('/user/group/id/'+id)
  },

  /********** GET USERS WITHING RANGE ************/

  getUsersRange: (limit_from, limit_to) => {
      return api.get('/user/range/'+limit_from+'/'+limit_to)
  },

  /********** GET USER GROUPS WITHING RANGE ************/

  getUserGroupsRange: (limit_from, limit_to) => {
      return api.get('/user/group/range/'+limit_from+'/'+limit_to)
  },

  /********** REMOVE USER ************/

  removeUser: (id) => {
      return api.delete('/user/remove/'+id)
  },

  /********** REMOVE USER GROUP ************/

  removeUserGroup: (id) => {
      return api.delete('/user/group/remove/'+id)
  },

  /********** ADD USER ************/

  addUser: (user) => {
      return api.post('/user/add', user)
  },

  /********** ADD USER GROUP ************/

  addUserGroup: (userGrp) => {
      return api.post('/user/group/add', userGrp)
  },

  /********** EDIT USER ************/

  editUser: (id, user) => {
      return api.post('/user/edit/'+id, user)
  },

  /********** EDIT USER GROUP ************/

  editUserGroup: (id, userGrp) => {
      return api.post('/user/group/edit/'+id, userGrp)
  },


  /********** GET USERS GROUPS ************/

  getUserGroups: () => {
      return api.get('/user/group/all')
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
