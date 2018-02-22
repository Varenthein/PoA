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
  }


}
