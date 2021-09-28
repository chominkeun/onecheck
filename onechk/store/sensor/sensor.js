import SensorDataService from '../../api/sensor/sensorApi'
import FloorDataService from '../../api/floor/floorApi'
import StoreDataService from '../../api/store/storeApi'
import BuildingDataService from '../../api/building/buildingApi'

const SENSOR_DEFAULT_INFO = () => {
  return {
    SENSOR_ID: '',
    SENSOR_NAME: '',
    SENSOR_DESC: '',
    FLOOR_ID: '',
    BOUND: '',
    SENSOR_LOC_X: '',
    SENSOR_LOC_Y: '',
    SENSOR_DV: '',
    IS_ACTIVATE: '',
    DRAGGABLE: false,
    VISIBLE: false,
    CONDITION: '',
    POSITION: {
      lat: 0, lng: 0
    },
    SENSOR_EVENT_LIST: []
  }
}

const DEFAULT_DIVIDE_INFO = () => {
  return {
    TARGET_LAT: '',     //위도
    TARGET_LNG: '',    //경도
    TARGET_DV_CD: '',   //건물/가게
    TARGET_ID: '',      //건물ID/가게ID
    USE_DV_CD: ''      //실내도/실외도
  }
}
//층 정보 저장
const FLOOR_INFO_DATA = () => {
  return {
    FLOOR_ID: '',
    FLOOR_NO: '',
    IS_GROUND: 'Y',
    ATTACH_ID: '',
    ATTACHIMAGE: ''
  }
}

export const state = () => ({
  sensorList: [],
  searchParam: '',
  searchResponse: [],
  currentSensor: SENSOR_DEFAULT_INFO(),
  selectSensorEventId: 0,
  selectSensorEventVisible: false,
  divideInfo: DEFAULT_DIVIDE_INFO(),
  floorInfo: [],
  newSensor: SENSOR_DEFAULT_INFO(),
  outSensor: SENSOR_DEFAULT_INFO()
})

export const mutations = {
  /* -- */
  SET_SENSOR_NAME(state, sensorName) {
  },
  /* 센서 정보 설정 */
  SET_SENSOR_INFO(state, data) {
    state.sensorList = data
  },
  /* 클릭한 센서 */
  SET_SENSOR_ONE(state, data) {
    state.currentSensor = data
  },
  /* -- */
  SET_SEARCH_PARAM(state, data) {
    state.searchParam = data
  },
  /* -- */
  SET_SEARCH_PARAM_DEFAULT(state) {
    state.searchParam = ''
  },
  /* -- */
  SET_SEARCH_RESPONSE_DEFAULT(state) {
    state.searchResponse = []
  },
  /* -- */
  SET_SEARCH_RESPONSE(state, data) {
    state.searchResponse = data
  },
  /* */
  PUSH_SENSOR_EVENT(state, data) {
    if(state.currentSensor.SENSOR_EVENT_LIST.length !== 0) {
      if(state.currentSensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_REL_ID === null) {
        state.currentSensor.SENSOR_EVENT_LIST.pop()
      }
    }
    state.currentSensor.SENSOR_EVENT_LIST.push(data)
  },
  //select box 값받아서 SET 해주기
  SET_SENSOR_EVENT(state, data) {
    state.currentSensor.SENSOR_EVENT_LIST.forEach(event => {
      if (data.SENSOR_EVENT_REL_ID === event.SENSOR_EVENT_REL_ID) {
        event.SENSOR_EVENT_ID = data.ID
        if (event.SENSOR_EVENT_ID !== 3) {
          event.EVENT_LIST_ID = null
        }
      }
    })
  },
  /* EVENT에서 어떤 이벤트인지 SET(반바지, 커피) */
  SET_EVENT_OPTION(state, data) {
    state.currentSensor.SENSOR_EVENT_LIST.forEach(event => {
      if (data.SENSOR_EVENT_REL_ID === event.SENSOR_EVENT_REL_ID) {
        event.EVENT_LIST_ID = data.ID
      }
    })
  },
  /* 선택된 센서 정보 설정 */
  SET_CURRENT_SENSOR(state, data) {
    state.currentSensor = data
  },
  /* -- */
  SET_CURRENT_SENSOR_NAME(state, data) {
    state.currentSensor.SENSOR_NAME = data
  },
  SET_CURRENT_SENSOR_BOUND(state, data) {
    state.currentSensor.BOUND = data
  },
  SET_CURRENT_SENSOR_DESC(state, data) {
    state.currentSensor.SENSOR_DESC = data
  },
  SET_CURRENT_SENSOR_ID(state, data) {
    state.currentSensor.SENSOR_ID = data
  },
  /* 센서 카테고리 선택값 지정 */
  SET_SELECT_SENSOR_EVENT_ID(state, data) {
    state.selectSensorEventId = data
  },
  /* 센서 카테고리 선택값 초기화 */
  SET_SELECT_SENSOR_EVENT_ID_DEFAULT(state) {
    state.selectSensorEventId = 0
  },
  /* 센서 카테고리 선택값 초기화 */
  SET_SELECT_SENSOR_EVENT_VISIBLE(state) {
    state.selectSensorEventVisible = !state.selectSensorEventVisible
  },
  /* 센서 카테고리 선택값 초기화 */
  SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT(state) {
    state.selectSensorEventVisible = false
  },
  SET_CURRENT_SENSOR_LOC(state, data) {
    state.currentSensor.SENSOR_LOC_X = data.lng
    state.currentSensor.SENSOR_LOC_Y = data.lat
  },
  SET_DIVIDE_INFO(state, data) {
    state.divideInfo.TARGET_LNG = data.TARGET_LNG
    state.divideInfo.TARGET_LAT = data.TARGET_LAT
    state.divideInfo.TARGET_DV_CD = data.TARGET_DV_CD
    state.divideInfo.TARGET_ID = data.TARGET_ID
  },
  SET_DIVIDE_INFO_USE(state, useData) {
    state.divideInfo.USE_DV_CD = useData
  },
  SET_DEFAULT_DIVIDE_INFO(state) {
    state.divideInfo = DEFAULT_DIVIDE_INFO()
  },
  SET_CURRENT_SENSOR_DEFAULT(state) {
    state.currentSensor = SENSOR_DEFAULT_INFO()
  },
  SET_CURRENT_SENSOR_DV(state, dv) {
    state.currentSensor.SENSOR_DV = dv
  },
  SET_SENSOR_EVENT_DEL(state, relId) {
    for (var i = 0; i < state.currentSensor.SENSOR_EVENT_LIST.length; i++) {
      if (state.currentSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_REL_ID === relId) {
        state.currentSensor.SENSOR_EVENT_LIST.pop(i)
      }
    }
  },

  //FLOOR

  SET_STORE_FLOOR_INFO(state, data) {
    state.floorInfo = data
  },
  SET_FLOOR_ATTACH_FILE_ID(state, data) {
    for (let i = 0; i < state.floorInfo.length; i++) {
      if (state.floorInfo[i].FLOOR_ID === data.floorId) {
        state.floorInfo[i].ATTACH_ID = data.attachId
      }
    }
  },
  UPDATE_FLOOR_INFO(state, data) {
    for (let i = 0; i < state.floorInfo.length; i++) {
      if (state.floorInfo[i].FLOOR_ID === data.FLOOR_ID) {
        state.floorInfo[i] = data
      }
    }
  },
  ADD_FLOOR_INFO(state, data) {
    state.floorInfo.push(data)
  },
  DELETE_FLOOR_INFO(state, data) {
    for (let i = 0; i < state.floorInfo.length; i++) {
      if (state.floorInfo[i].FLOOR_ID === data.FLOOR_ID) {
        state.floorInfo.splice(i, 1)
        i--
      }
    }
  }
}

export const actions = {
  /* 센서 조회 - floor (floorId) */
  async FETCH_SENSOR_INFO(context, floorId) {
    const res = await SensorDataService.getSensorInfo(floorId)
    if (res.status === 200) {
      context.commit('SET_SENSOR_INFO', res.data)
    }
  },
  /* -- */
  async FETCH_OUT_SENSOR_ONE(context, sensorId) {
    const res = await SensorDataService.getOneSensor(sensorId)
    if (res.status === 200) {
      context.commit('SET_SENSOR_ONE', res.data[0])
    }
  },
  /* -- */
  UPDATE_SENSOR_INFO({ state }, cursensor) {
    const data = {
      SENSOR_DESC: cursensor.SENSOR_DESC,
      SENSOR_NAME: cursensor.SENSOR_NAME,
      SENSOR_LOC_X: cursensor.SENSOR_LOC_X,
      SENSOR_LOC_Y: cursensor.SENSOR_LOC_Y,
      SENSOR_ID: cursensor.SENSOR_ID,
      BOUND: cursensor.BOUND
    }
    SensorDataService.updateSensor(data.SENSOR_ID, data)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* -- */
  UPDATE_SENSOR_EVENT({ state }, OneSensor) {

    SensorDataService.updateOneSensor(OneSensor[0].SENSOR_ID, OneSensor)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  CREATE_SENSOR_EVENT({ state }, curSensor) {
    const dataArr = []
    for (var i = 0; i < curSensor.SENSOR_EVENT_LIST.length; i++) {
      if (curSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_REL_ID < 0) {
        const data = {
          SENSOR_ID: curSensor.SENSOR_ID,
          SENSOR_EVENT_ID: curSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_ID,
          EVENT_LIST_ID: curSensor.SENSOR_EVENT_LIST[i].EVENT_LIST_ID
        }
        dataArr.push(data)
      }
    }
    SensorDataService.createSensorEvent(curSensor.SENSOR_ID, dataArr)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  async CREATE_ONE_SENSOR({ commit, state }, sensorData) {
    let data = {
      SENSOR_NAME: sensorData.SENSOR_NAME,
      SENSOR_DESC: sensorData.SENSOR_DESC,
      SENSOR_LOC_X: sensorData.SENSOR_LOC_X,
      SENSOR_LOC_Y: sensorData.SENSOR_LOC_Y,
      SENSOR_DV: sensorData.SENSOR_DV,
      BOUND: sensorData.BOUND,
      FLOOR_ID: sensorData.FLOOR_ID
    }
    await SensorDataService.createOneSensor(data)
      .then(res => {
        commit('SET_CURRENT_SENSOR_ID', res.data.SENSOR_ID)
      })
      .catch(error => {
        console.log(error.message)
      })

  },

  DELETE_ONE_SENSOR(context, sensorId) {
    SensorDataService.deleteOneSensor(sensorId)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  async SEARCH_SENSOR({ commit, state }, limit) {
    if (!state.searchParam) {
      return
    }

    let response = await SensorDataService.searchSensor(state.searchParam, limit)
    commit('SET_SEARCH_RESPONSE', response.data)
  },
  async SEARCH_OUT_SENSOR({ commit, state }, limit) {
    if (!state.searchParam) {
      return
    }

    let response = await SensorDataService.searchOutSensor(state.searchParam, limit)
    commit('SET_SEARCH_RESPONSE', response.data)
  },
  /* -- */
  async FETCH_CURRENT_SENSOR({ state, commit }, sensorId) {

    const selectSensor = await state.sensorList.filter(sensor => {
      return sensor.SENSOR_ID === sensorId
    })
    /* 선택된 센서 정보 설정 */
    commit('SET_CURRENT_SENSOR', selectSensor[0])
  },

  //실내도 정보 조회
  FETCH_FLOOR_INFO(context, payload) {
    if ('STORE_ID' in payload) {
      return FloorDataService.getStoreFloors(payload.STORE_ID, 'STORE')
        .then(response => {
          context.commit('SET_STORE_FLOOR_INFO', response.data)
        })
        .catch(error => {
          console.log(error.message)
        })
    } else if ('BUILDING_ID' in payload) {
      return FloorDataService.getStoreFloors(payload.BUILDING_ID, 'BUILDING')
        .then(response => {
          context.commit('SET_STORE_FLOOR_INFO', response.data)
        })
        .catch(error => {
          console.log(error.message)
        })
    }

  },

  //실내도 이미지 수정
  UPDATE_FLOOR_IMAGE({ state }, data) {
    FloorDataService.updateFloor(data.floorId, data.attachId)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 지도 영역안의 센서 조회 - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG) */
  async FETCH_OUT_SENSOR_INFO(context, data) {
    const res = await SensorDataService.getSensorBoundsInfo(data)
    if (res.status === 200) {
      let sensorInfo = res.data
      // 가게 또는 건물인지 확인
      for(let sensor of sensorInfo){
        const TARGET_DV_CD = sensor.SENSOR_TARGET_DV_CD
        const SENSOR_TARGET_ID = sensor.SENSOR_TARGET_ID
        // 센서에 해당되는 Store 정보 추가
        let res2
        // TARGET_DV_CD('STORE', 'BUILDING')에 맞게 정보를 Get
        // 현재는 Store만 처리 BUILDING은 추후 처리...
        if(TARGET_DV_CD === 'STORE'){
          res2 = await StoreDataService.getOne(SENSOR_TARGET_ID)
          if(res2.status === 200){
            const storeInfo = res2.data
            sensor.storeInfo = storeInfo
          }
        }
        else {
          res2 = await BuildingDataService.getOneBuilding(SENSOR_TARGET_ID)
          if(res2.status === 200){
            console.log(res2.data)
            const buildingInfo = res2.data
            sensor.buildingInfo = buildingInfo
          }
        }
      }
      context.commit('SET_SENSOR_INFO', sensorInfo)
    } else {
      const tmp = []
      context.commit('SET_SENSOR_INFO', tmp)
    }

  },

  /* 지도 영역안의 센서 조회 - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG) */
  async FETCH_SENSOR_INSERT(context, data) {

    state.currentSensor.SENSOR_LOC_X = data.lng
    state.currentSensor.SENSOR_LOC_Y = data.lat
    state.currentSensor.SENSOR_DV = 'IN'

    await this.CREATE_ONE_SENSOR(state.currentSensor)
    await this.CREATE_SENSOR_EVENT(state.currentSensor)
    await this.FETCH_SENSOR_INFO(state.currentFloor.FLOOR_ID)


  }
}

export const getters = {
  /* 선택된 센서 정보 전달 */
  GET_SELECT_SENSOR_EVENT(state) {
    let sensorList = []
    if (state.selectSensorEventId !== 0) {
      for (const senList of state.sensorList) {
        for (const evtList of senList.SENSOR_EVENT_LIST) {
          if (evtList.SENSOR_EVENT_ID === state.selectSensorEventId) {
            sensorList.push(senList)
            break
          }
        }
      }
    } else {
      sensorList = state.sensorList
    }
    return sensorList
  }

}
