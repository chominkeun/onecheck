import Axios from '../index.js'

class SensorEventDataService {
  /**************** 센서 이벤트 정보  ****************/

  /* 센서 조회 - floor (floorId) */
  getSensorEventsInfo() {
    return Axios.get(`/sensor_event`)
  }

  getEventOption(dv_cd, id) {
    return Axios.get(`/sensor_event/eventoption/${dv_cd}/${id}`)
  }

  deleteSensorEvent(sensorEventRelId) {
    return Axios.delete(`/sensor_event/${sensorEventRelId}`)
  }

  updateEventList(eventListId, data) {
    return Axios.put(`/sensor_event/eventoption/${eventListId}`, data)
  }

  deleteEventList(eventListId) {
    return Axios.delete(`/sensor_event/eventoption/${eventListId}`)
  }

  createEvent(data) {
    return Axios.post(`/sensor_event/eventoption`, data)
  }
}

export default new SensorEventDataService()
