import api from '@/config/api.config'

export const optionService = {

  /************************** GET BY ID ************************/

  getById: (id) => {
    return api.get('/option/id/'+id)
  },

  /************************** GET BY NAME ************************/

  getByName: (name) => {
    return api.get('/option/name/'+name)
  },

  /************************** GET ALL ************************/

  getAll: (id) => {
    return api.get('/option/all')
  },

  /************************* SET OPTION *************************/

  setOption: (id, option) => {
    return api.post('/option/edit/'+id, option)
  },

}
