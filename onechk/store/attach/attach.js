import AttachDataService from '../../api/attach/attachApi.js'


export const state = () => ({
  attachInfo: {}
})

export const mutations = {
  SET_ATTACH_INFO(state, data) {
    state.attachInfo = data
  },
  SET_ATTACH_INFO_CLEAR(state) {
    state.attachInfo.ATTACH_ID = ''
    state.attachInfo.IMG_SRC = ''
  },
  SET_ATTACH_ID(state, attachID) {
    state.attachInfo.ATTACH_ID = attachID
  },
  SET_IMG_SRC(state, imgSrc) {
    state.attachInfo.IMG_SRC = imgSrc
  }
}

export const actions = {
  FETCH_ATTACH_INFO(context, payload) {
    return AttachDataService.getOne(payload.attachId)
      .then(response => {
        context.commit('SET_ATTACH_INFO', response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  CREATE_ATTACH_INFO(context, payload) {
    console.log('store attach -> CREATE_ATTACH_INFO')
    return AttachDataService.create(payload.attachInfo, payload.config)
      .then(response => {
        console.log('CREATE_ATTACH_INFO ==> ', response)
        context.commit('SET_ATTACH_ID', response.data.attach_id)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  UPDATE_ATTACH_INFO(context, payload) {
    AttachDataService.update(payload.attachId, payload.attachInfo, payload.config)
      .then(response => {
        console.log('UPDATE_ATTACH_INFO ==> ', response)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  DELETE_ATTACH_INFO(context, attachId) {
    AttachDataService.delete(attachId)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  }


}

export const getters = {}
