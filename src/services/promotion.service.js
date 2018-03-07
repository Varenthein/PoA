import api from '@/config/api.config.js'

export const promotionService = {

  /********* COUNT PROMOTIONS ***********/

  count: () => {

    return new Promise(function(resolve, reject) {
      api.get('/promotion/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })

  },

  /********** GET PROMOTIONS WITHING RANGE ************/

  getPromotionsRange: (limit_from, limit_to) => {
      return api.get('/promotion/range/'+limit_from+'/'+limit_to)
  },

  /********** GET PROMOTION BY ID ************/

  getById: (id) => {
      return api.get('/promotion/id/'+id)
  },

  /********** REMOVE PROMOTION ************/

  removePromotion: (id) => {
      return api.delete('/promotion/remove/'+id)
  },

  /********** ADD PROMOTION ************/

  addPromotion: (data) => {
      return api.post('/promotion/add', data)
  },

  /********** ADD PROMOTION ************/

  editPromotion: (id, data) => {
      return api.post('/promotion/edit/'+id, data)
  }

}
