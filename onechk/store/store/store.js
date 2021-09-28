import StoreDataService from '../../api/store/storeApi'

// 사용자 정보 기본값
const STORE_INFO_DATA = () => {
  return {
    STORE_FLOORS: '',
    STORE_BASEMENT_FLOORS: '',
    STORE_NAME: '',
    STORE_CODE: 0,
    STORE_TEL_NUM: '',
    STORE_FORM: '',
    ATTACH_ID: '',
    ADDRESS: '',
    EXTRA_ADDRESS: '',
    STORE_LAT: '',
    STORE_LOT: '',
    DESC: '',
  }
}

export const state = () => ({
  storeInfo: {},
  storeCategoryInfo: []

})

export const mutations = {
  /* */
  SET_DEFAULT_STORE_INFO(state) {
    state.storeInfo = STORE_INFO_DATA()
  },
  /* */
  SET_STORE_INFO(state, data) {
    state.storeInfo = data
  },
  /* */
  SET_STORE_LATLOT(state, payload) {
    state.storeInfo.STORE_LAT = payload.lat
    state.storeInfo.STORE_LOT = payload.lot
  },
  /* */
  SET_ADDRESS(state, newAddress) {
    state.storeInfo.ADDRESS = newAddress
  },
  /* */
  SET_STORE_NAME(state, storeName) {
    state.storeInfo.STORE_NAME = storeName
  },
  /* */
  SET_STORE_TEL_NUM(state, telNum) {
    state.storeInfo.STORE_TEL_NUM = telNum
  },
  /* */
  SET_EXTRA_ADDRESS(state, extraAddress) {
    state.storeInfo.EXTRA_ADDRESS = extraAddress
  },
  /* */
  SET_DESC(state, desc) {
    state.storeInfo.DESC = desc
  },
  /* */
  SET_ATTACH_FILE_ID(state, attachId) {
    state.storeInfo.ATTACH_ID = attachId
  },
  /* */
  SET_STORE_FLOORS(state, floors) {
    state.storeInfo.STORE_FLOORS = parseInt(floors, 10)
  },
  /* */
  SET_STORE_BASEMENT_FLOORS(state, bfloors) {
    state.storeInfo.STORE_BASEMENT_FLOORS = parseInt(bfloors, 10)
  },
  /* 가게 카테고리 설정 */
  SET_STORE_CATEGORY_INFO(state, data) {
    state.storeCategoryInfo = data
  },
  /* 가게 카테고리 변경 */
  SET_STORE_STORE_CODE(state, storeCode) {
    state.storeInfo.STORE_CODE = storeCode
  },
}

export const actions = {
  /* 가게정보 조회 */
  FETCH_STORE_INFO(context, payload) {
    return StoreDataService.getOneByPk(payload.userNo, payload.storeId)
      .then(response => {
        context.commit('SET_STORE_INFO', response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 가게정보 생성 */
  CREATE_STORE_INFO({ state }, userNo) {
    StoreDataService.createStoreInfo(userNo, state.storeInfo)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 가게정보 수정 */
  UPDATE_STORE_INFO({ state }, storeId) {
    console.log(state.storeInfo)
    StoreDataService.updateStoreInfo(storeId, state.storeInfo)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 가게정보 삭제 */
  DELETE_STORE_INFO(context, storeId) {
    StoreDataService.deleteStoreInfo(storeId)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 가게정보 수정 */
  UPDATE_STORE_INFO_ASYNC({ state }, storeId) {
    return StoreDataService.updateStoreInfo(storeId, state.storeInfo)
  },
  /* 가게 카테고리 목록 */
  FETCH_STORE_CATEGORY_INFO(context){
    return StoreDataService.getCategoryInfo()
      .then(response => {
        context.commit('SET_STORE_CATEGORY_INFO', response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  /* 가게정보 초기화 */
  FETCH_DEFAULT_STORE_INFO(context) {
    context.commit('SET_DEFAULT_STORE_INFO')
  },


  // TEST -> 미사용
  /* */
  async UPDATE_STORE_FILE_INFO({ state }, storeId) {
    const res = await StoreDataService.updateStoreInfo(storeId, state.storeInfo)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
    console.log(res);
  },
}

export const getters = {
  /* */
  DESC_LENGTH(state) {
    if (state.storeInfo.DESC) {
      //console.log(state.storeInfo.DESC)
      return state.storeInfo.DESC.length
    } else {
      return 0
    }
  },
  GET_STORE_CATEGORY_NAME(state) {
    let categoryName = ''
    state.storeCategoryInfo.filter(catInfo => {
      if (catInfo.STORE_CATEGORY_ID === Number(state.storeInfo.STORE_CODE)) {
        categoryName = catInfo.STORE_KND
      }
    })
    return categoryName
  },

}
