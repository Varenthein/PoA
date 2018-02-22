import api from '@/config/api.config.js'

export const opinionService = {

  /********** COUNT AWAITING OPINIONS ************/

  countAwaiting: () => {

    return new Promise(function(resolve, reject) {
      api.get('/opinion/awaiting/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })

  },

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
  },

  /********** GET OPINONS WITHING RANGE ************/

  getOpinionsRange: (limit_from, limit_to) => {
      return api.get('/opinion/range/'+limit_from+'/'+limit_to)
  },

  /********** ACCEPT OPINION ************/

  acceptOpinion: (id) => {
      return api.put('/opinion/accept/'+id)
  },

  /********** REJECT OPINION ************/

  rejectOpinion: (id) => {
      return api.delete('/opinion/reject/'+id)
  }
}
