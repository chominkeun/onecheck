import PrtOptDataService from '../../api/prtopt/prtoptApi'
import CONST from '../../constants/Product'

export const state = () => ({
  optList: [],
  optSaveMsg: {},
  storeId: 0,
  optInfo: {}
})

export const mutations = {
  // 상품 옵션 목록 설정
  SET_OPT_LIST(state, data) {
    state.optList = data
  },
  // 상품 옵션 정보 기본값 설정
  SET_DEFAULT_PRT_OPT_INFO(state) {
    state.optInfo = CONST.DEFAULT_PRT_OPT_INFO
  },
  // 상품 옵션 정보 설정
  SET_PRT_OPT_INFO(state, prtOptId) {
    state.optList = state.optList.filter(opt => {
      return opt.PRT_OPT_ID === prtOptId
    })
  },
  //
  SET_CAT_EDIT_MSG(state, msg) {
    state.optSaveMsg = msg
  },
  SET_STORE_ID(state, storeId) {
    state.storeId = storeId
  },
  // 상품 옵션 그룹명 변경
  SET_PRT_OPT_GNAME(state, gname) {
    state.optInfo.G_NAME = gname
  },
  // 상품 옵션 옵션명[] 변경
  SET_PRT_OPT_ONAMES(state, onames) {
    // status는 'C'
    state.optInfo.O_NAMES = onames
  },
  // 상품 옵션 기본값 변경
  SET_PRT_OPT_DEFAULT(state, defaults) {
    state.optInfo.DEFAULT = defaults
  },
  // 상품 옵션 다중선택 변경
  SET_PRT_OPT_IS_MUTI_CUR(state, isMutiCur) {
    state.optInfo.IS_MUTI_CUR = isMutiCur
  }
}

export const actions = {
  // 상품 옵션 목록 리턴
  async ACT_PRT_OPT_LIST(context, storeId) {
    let AllOptData = []
    try {
      const response = await PrtOptDataService.getAll(storeId)
      if(response.status <= 400){
        AllOptData = response.data.groupList
      } else {
        console.log('[ERROR_CODE] ', response.status, ' msg : ', response.message)
      }
    } catch(err){}
    return AllOptData
  },
  // 상품 ID에 해당되는 옵션 목록 리턴
  async ACT_PRT_OPT(context, prtId){
    let optionData = []
    try{
      const response = await PrtOptDataService.getOne(prtId)
      if(response.data.result){
        optionData = response.data.groupList
      }
    } catch(err){}

    return optionData;
  },
  // 상품 옵션 목록 조회
  async FETCH_PRT_OPT_LIST_CHECK(context, storeId) {
    context.commit('SET_STORE_ID', storeId)
    let AllOptData = []

    try {
      const response = await PrtOptDataService.getAll(storeId)
      if(response.status <= 400){
        AllOptData = response.data.groupList
      } else {
        console.log('[ERROR_CODE] ', response.status, ' msg : ', response.message)
      }
    } catch(err){
      console.log(err.response.status)
    }
    context.commit('SET_OPT_LIST', AllOptData)
  },

  // 상품 정보 저장 (생성, 수정, 삭제)
  APPLY_PRT_OPT_INFO({ state }) {
    PrtOptDataService.applyAll(state.optList)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message)
      })
  }
}

export const getters = {
  fetchedOptionAll(state) {
    return state.optList
  }
}
