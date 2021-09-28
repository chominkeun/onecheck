import BuildingDataService from '../../api/building/buildingApi'

const DEFAULT_BUILDING_INFO = () => {
  return {
    BUILDING_ID: '',
    BUILDING_NAME: '',
    BUILDING_ADDRESS: '',
    BUILDING_DESC: '',
    ATTACH_ID: '',
    IMG_SRC: '',
    BUILDING_FLOORS: '',
    BUILDING_BASEMENT_FLOORS: '',
    BUILDING_LAT: '',
    BUILDING_LOT: ''
  }
}

export const state = () => ({
  buildingInfo: {}
})


export const mutations = {
  SET_DEFAULT_BUILDING_INFO(state) {
    state.buildingInfo = DEFAULT_BUILDING_INFO()
  },
  SET_BUILDING_INFO(state, data) {
    state.buildingInfo = data
  },
  SET_BUILDING_LATLOT(state, payload) {
    state.buildingInfo.BUILDING_LAT = payload.lat
    state.buildingInfo.BUILDING_LOT = payload.lot
  },
  SET_BUILDING_NAME(state, buildingName) {
    state.buildingInfo.BUILDING_NAME = buildingName
  },
  SET_BUILDING_ADDRESS(state, buildingAddress) {
    state.buildingInfo.BUILDING_ADDRESS = buildingAddress
  },
  SET_BUILDING_DESC(state, buildingDesc) {
    state.buildingInfo.BUILDING_DESC = buildingDesc
  },
  SET_BUILDING_ATTACH_FILE_ID(state, attachId) {
    state.buildingInfo.ATTACH_ID = attachId
  },
  SET_BUILDING_FLOORS(state, buildingFloors) {
    state.buildingInfo.BUILDING_FLOORS = buildingFloors
  },
  SET_BUILDING_BASEMENT_FLOORS(state, buildingBasementFloors) {
    state.buildingInfo.BUILDING_BASEMENT_FLOORS = buildingBasementFloors
  }
}

export const actions = {
  FETCH_BUILDING_INFO(context, userNo) {
    return BuildingDataService.getBuildings(userNo)
      .then(res => {
        context.commit('SET_BUILDING_INFO', res.data[0])
      })
  },
  UPDATE_BUILDING_INFO({ state }, buildingId) {
    BuildingDataService.update(buildingId, state.buildingInfo)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  CREATE_BUILDING_INFO({ state }, userNo) {
    BuildingDataService.create(userNo, state.buildingInfo)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  DELETE_BUILDING_INFO(context, buildingId) {
    BuildingDataService.delete(buildingId)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  UPDATE_BUILDING_INFO_ASYNC({ state }, buildingId) {
    return BuildingDataService.update(buildingId, state.buildingInfo)
  },

  FETCH_ONE_BUILDING_INFO(context, buildingId) {
    return BuildingDataService.getOneBuilding(buildingId)
      .then(res => {
        context.commit('SET_BUILDING_INFO', res.data[0])
      })
  },
}
