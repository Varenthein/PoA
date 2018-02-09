import api from './api'
var sha256 = require('js-sha256');

export const userService = {

  //Get info about logged user
  getUserInfo: function(id) {
    return api.post('/user/getLogged')
  }

  //is logged?
  isLogged: function(user) {
    return api.post('/user/isLogged')
  }

}
