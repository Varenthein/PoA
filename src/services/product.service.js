import api from '@/config/api.config.js'

export const productService = {

  /********** COUNT PRODUCTS ************/

  count: () => {

    return new Promise(function(resolve, reject) {
      api.get('/product/count').then(response => {
        if (Number.isInteger(response.data)) resolve(response.data)
        else reject(false)
      }).catch(err => {
        reject(false)
      });
    })

  }

}
