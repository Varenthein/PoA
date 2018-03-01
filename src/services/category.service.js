import api from '@/config/api.config.js'

export const categoryService = {

    /********** GET ALL CATEGORIES  ************/

    getAll: () => {
      return api.get('/category/all')
    },

    /********* COUNT CATEGORIES ***********/

    count: () => {

      return new Promise(function(resolve, reject) {
        api.get('/category/count').then(response => {
          if (Number.isInteger(response.data)) resolve(response.data)
          else reject(false)
        }).catch(err => {
          reject(false)
        });
      })

    },

    /********** GET CATEGORIES WITHING RANGE ************/

    getCategoriesRange: (limit_from, limit_to) => {
        return api.get('/category/range/'+limit_from+'/'+limit_to)
    },

    /********** GET CATEGORY BY ID ************/

    getById: (id) => {
        return api.get('/category/id/'+id)
    },

    /********** REMOVE CATEGORY ************/

    removeCategory: (id) => {
        return api.delete('/category/remove/'+id)
    },

    /********** ADD CATEGORY ************/

    addCategory: (data) => {
        return api.post('/category/add', data)
    },

    /********** ADD CATEGORY ************/

    editCategory: (id, data) => {
        return api.post('/category/edit/'+id, data)
    }


}
