import api from '@/config/api.config.js'

export const orderService = {

  /********** COUNT ORDERS ************/

  count: () => {
    return new Promise(function(resolve, reject) {
      api.get('/order/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })
  },

  /********** GET AWAITING ORDERS ************/

  getAwaitingOrders: () => {
    return api.get('/order/awaiting')
  },

  /********** GET ORDERS WITHING RANGE ************/

  getOrdersRange: (limit_from, limit_to) => {
      return api.get('/order/range/'+limit_from+'/'+limit_to)
  },

  /********** CHANGE ORDER STATUS ************/

  changeStatus: (data) => {
      return api.post('/order/status', data)
  },

  /********** REMOVE ORDER ************/

  removeOrder: (id) => {
      return api.delete('/order/remove/'+id)
  }

}
