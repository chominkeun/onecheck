import SensorEventDataService from '../../api/sensor_event/sensorEventApi'

const SENSOR_EVENT_DEFAULT_INFO = () => {
  return [{
    SENSOR_EVENT_ID: '',
    SENSOR_EVENT_NAME: '',
    SENSOR_EVENT_DESC: '',
    IS_ACTIVATE: 'Y',
    IS_USING_DATA: 'Y'
  }]
}
const EVENT_LIST_DEFAULT_INFO = () => {
  return [{
    EVENT_LIST_NAME: '',
    EVENT_LIST_DESC: '',
    DV_CD: '',
    ID: ''
  }]
}
export const state = () => ({
  sensorEventList: [],
  eventOption: [],
  currentOption: [],
})

export const mutations = {

  SET_SENSOR_EVENT_INFO(state, data) {
    state.sensorEventList = data
  },

  SET_EVENT_OPTION(state, data) {
    state.eventOption = data
  },

  SET_DEFAULT_SENSOR_EVENT_INFO(state) {
    state.sensorEventList = []
  },

  SET_CURRENT_EVENT_DEFAULT(state) {
    state.currentOption = EVENT_LIST_DEFAULT_INFO()
  },
  SET_CURRENT_EVENT_OPTION(state, data) {
    state.currentOption = data
  },
  SET_CURRENT_EVENT_NAME(state, data) {
    state.currentOption.EVENT_LIST_NAME = data
  },
  SET_CURRENT_EVENT_DESC(state, data) {
    state.currentOption.EVENT_LIST_DESC = data
  },
  SET_CURRENT_EVENT_DV_INFO(state, data) {
    state.currentOption.ID = data.ID,
    state.currentOption.DV_CD = data.DV_CD
  }
}

export const actions = {
  async FETCH_SENSOR_EVENT_INFO(context) {
    const res = await SensorEventDataService.getSensorEventsInfo()
    if (res.status === 200) {

      context.commit('SET_SENSOR_EVENT_INFO', res.data)
    }
  },

  async FETCH_EVENT_OPTION(context, divideInfo) {
    let data = {
      dv_cd: divideInfo.TARGET_DV_CD,
      id: divideInfo.TARGET_ID
    }
    try{
    const res = await SensorEventDataService.getEventOption(data.dv_cd, data.id)
    if (res.status === 200) {

      context.commit('SET_EVENT_OPTION', res.data)
    }
  }catch(err){}
  },

  DELETE_SENSOR_EVENT(context, sensorEventRelId) {
    SensorEventDataService.deleteSensorEvent(sensorEventRelId)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  UPDATE_EVENT_LIST(state, curOption) {
    SensorEventDataService.updateEventList(curOption.EVENT_LIST_ID, curOption)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  DELETE_EVENT_LIST(context, eventListId) {
    SensorEventDataService.deleteEventList(eventListId)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  CREATE_EVENT_LIST({state}, eventData) {
    SensorEventDataService.createEvent(eventData)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
      
  }

}
