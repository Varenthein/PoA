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
      });

    })
  }

}
