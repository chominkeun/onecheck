import Axios from '../index.js'

class SensorDataService {
  /**************** 센서 정보  ****************/


  /* 센서 조회 - floor (floorId) */
  getSensorInfo(floorId) {
    return Axios.get(`/sensor/${floorId}`)
  }
  /* 센서 조회 - SensorEvent (SensorEventId) */
  getSensorList(){
    return Axios.get(`/sensor`)
  }
  /* 센서 개별 조회(이벤트 ) */
  getOneSensor(sensorId) {
    return Axios.get(`/sensor/OneSensor/${sensorId}`)
  }
  /* 센서 정보 수정 */
  updateSensor(sensorId, data) {
    return Axios.put(`/sensor/${sensorId}`, data)
  }
  /*  */
  updateOneSensor(sensorId, data) {
    return Axios.put(`/sensor/OneSensor/${sensorId}`, data)
  }
  /*  */
  searchSensor(search_param,limit) {
    return Axios.get(`/sensor/search/${search_param}/limit/${limit}`)
  }
  /*  */
  searchOutSensor(search_param,limit){
    return Axios.get(`/sensor/outSearch/${search_param}/limit/${limit}`)
  }
  /*  */
  createSensorEvent(sensorId, data) {
    return Axios.post(`/sensor/${sensorId}`, data)
  }
  /*  */
  createOneSensor(data) {
    return Axios.post(`/sensor`, data)
  }
  /*  */
  deleteOneSensor(sensorId) {
    return Axios.delete(`/sensor/${sensorId}`)
  }
  /* 지도 영역안의 센서 조회 - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG) */
  getSensorBoundsInfo(data) {
    return Axios.get(`/sensor/map/bounds/${data.NORTHEAST.LAT}/${data.NORTHEAST.LNG}/${data.SOUTHWEST.LAT}/${data.SOUTHWEST.LNG}`)
  }
}

export default new SensorDataService()
