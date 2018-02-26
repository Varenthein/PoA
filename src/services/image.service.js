import api from '@/config/api.config.js'

export const imageService = {

  /********** GET ALL IMAGES ************/

  getAll: () => {
      return api.get('/image/all')
  },

  /********** REMOVE IMAGE ************/

  removeImage: (id) => {
      return api.delete('/image/remove/'+id)
  },

  /********** COUNT IMAGES ************/

  count: () => {

    return new Promise(function(resolve, reject) {
      api.get('/image/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })

  },

  /********** GET PRODUCTS WITHING RANGE ************/

  getImagesRange: (limit_from, limit_to) => {
      return api.get('/image/range/'+limit_from+'/'+limit_to)
  }

}
