import api from '@/config/api.config.js'

export const categoryService = {

  /********** GET ALL CATEGORIES  ************/

  getAll: () => {
      return api.get('/category/all')
  },

}
