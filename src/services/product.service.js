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

  },

  /********** GET PRODUCTS WITHING RANGE ************/

  getProductsRange: (limit_from, limit_to) => {
      return api.get('/product/range/'+limit_from+'/'+limit_to)
  },

  /********** GET PRODUCTS WITHING RANGE ************/

  getById: (id) => {
      return api.get('/product/id/'+id)
  },

  /********** REMOVE PRODUCT ************/

  removeProduct: (id) => {
      return api.delete('/product/remove/'+id)
  },

  /********** ADD PRODUCT ************/

  addProduct: (data) => {
      return api.post('/product/add', data)
  },

  /********** ADD PRODUCT ************/

  editProduct: (id, data) => {
      return api.post('/product/edit/'+id, data)
  }


}
