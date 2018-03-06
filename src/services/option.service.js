import api from '@/config/api.config'

export const optionService = {

  /************************** GET BY ID ************************/

  getById: (id) => {
    return api.get('/option/id/'+id)
  },

  /************************** GET BY NAME ************************/

  getByName: (name) => {
    return api.get('/option/name/'+name)
  }

}
