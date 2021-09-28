import Axios from '../index.js'

class FloorDataService {
  getStoreFloors(storeId,dvCode) {
    return Axios.get(`/floor/${storeId}/dv/${dvCode}`)
  }

  updateFloor(floorId, attachId) {
    const data = {
      id: attachId
    }
    return Axios.put(`/floor/${floorId}`, data)
  }
}

export default new FloorDataService()
