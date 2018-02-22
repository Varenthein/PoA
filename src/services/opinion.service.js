import api from '@/config/api.config.js'

export const opinionService = {

  /********** COUNT OPINIONS ************/

  count: () => {

    return new Promise(function(resolve, reject) {
      api.get('/opinion/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })

  },


    /********** GET AWAITING ORDERS ************/

    getAwaitingOpinions: () => {
      return api.get('/opinion/awaiting')
    }

}
