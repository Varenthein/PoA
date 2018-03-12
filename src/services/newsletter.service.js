import api from '@/config/api.config'

export const newsletterService = {

  /********** COUNT NEWSLETTERS ************/

  count: () => {
    return new Promise(function(resolve, reject) {
      api.get('/newsletter/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })
  },

  /********** GET NEWSLETTER BY ID ************/

  getById: (id) => {
    return api.get('/newsletter/id/'+id)
  },

  /********** GET USER GROUPS WITHING RANGE ************/

  getNewslettersRange: (limit_from, limit_to) => {
      return api.get('/newsletter/range/'+limit_from+'/'+limit_to)
  },

  /********** GET CLIENTS ************/

  getClients: () => {
      return api.get('/client/all')
  },

  /*********** SEND NEWSLETTER **********/

  sendNewsletter: (letter)  => {
      return api.post('/newsletter/send', letter)
  }

}
