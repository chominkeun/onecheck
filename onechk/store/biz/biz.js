import { create } from 'lodash'
import BizDataService from '../../api/biz/bizApi'

const BIZ_INFO_DATA = () => {
  return {
    INPUT: '',
    BIZ_NUM: '',
    S_LOCATION: '',
    M_LOCATION: '',
    TRADE_NM: '',
    BIZ_TEL: '',
    ATTACH_ID: ''
  }
}
export const state = () => ({
  bizInfo: {}
})

export const mutations = {
  SET_DEFAULT_BIZ_INFO(state) {
    state.bizInfo = BIZ_INFO_DATA()
  },
  SET_BIZ_INFO(state, data) {
    state.bizInfo = data
  },
  SET_BIZ_NUM_INFO(state, biz_no) {
    state.bizInfo.BIZ_NUM = biz_no
  },
  SET_S_LOCATION_INFO(state, sLocation) {
    state.bizInfo.S_LOCATION = sLocation
  },
  SET_M_LOCATION_INFO(state, mLocation) {
    state.bizInfo.M_LOCATION = mLocation
  },
  SET_TRADE_NM_INFO(state, tradeNM) {
    state.bizInfo.TRADE_NM = tradeNM
  },
  SET_TRADE_BIZ_TEL_INFO(state, bizTel) {
    state.bizInfo.BIZ_TEL = bizTel
  },
  SET_TRADE_ATTACH_ID_INFO(state, attachId) {
    state.bizInfo.ATTACH_ID = attachId
  },
  SET_INPUT(state, input) {
    state.bizInfo.INPUT = input
  }
}

export const actions = {
   async CREATE_BIZ({ state, commit }, userNo) {
    // var biz_info = {
    //   BIZ_NUM: state.bizInfo.INPUT
    // }
    // const num = state.bizInfo.INPUT
    // return BizDataService.getBizStoreInfo(num)
    //   .then(response => {
    //     BizDataService.getIsDataInTable(num)
    //       .then(datacounts => {
    //         if (datacounts.data.datas != 0) {
    //           alert('이미 등록된 사업자등록번호 입니다.')
    //         } else {
    //           if (response.data.body.totalCount == 1) {
    //             commit('SET_BIZ_NUM_INFO', num)
    //             BizDataService.create(userNo, biz_info)
    //             console.log('흠')
    //             alert('등록되었습니다.')
    //           } else {
    //             alert('사업자등록번호가 틀립니다.')
    //           }
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error.message)
    //       })
    //   })
    //   .catch(error => {
    //     console.log(error.message)
    //   })

    var biz_info = {
      BIZ_NUM: state.bizInfo.INPUT
    }
    const num = state.bizInfo.INPUT
    const response = await BizDataService.getBizStoreInfo(num)
    // console.log(response)
    if(response.data.body.totalCount != 0){
      const datacounts = await BizDataService.getIsDataInTable(num)
      if(datacounts.data.datas != 0){
        alert('이미 등록된 사업자등록번호 입니다.')
        return 0
      } else {
        commit('SET_BIZ_NUM_INFO', num)
        alert('등록되었습니다.')
        return await BizDataService.create(userNo, biz_info)
        
      }
    } else{
      alert('사업자등록번호가 틀립니다.')
      return 0
    }
  },
  DELETE_BIZ(context, biz_num) {

    BizDataService.delete(biz_num)
      .then(response => {
        console.log(response)
        context.commit('SET_DEFAULT_BIZ_INFO')
        alert('정상적으로 삭제되었습니다.')
      })
      .catch(error => {
        console.log(error.message)
        alert('삭제가 불가합니다')
      })
  },
  FETCH_BIZ(context, payload) {
    return BizDataService.getBizInfo(payload.userNo)
      .then(response => {
        if (response.data[0] !== undefined)
          context.commit('SET_BIZ_INFO', response.data[0])
        else
          context.commit('SET_DEFAULT_BIZ_INFO')
      })
      .catch(error => {
        console.log(error.message)
      })
  }
}

export const getters = {
  GET_BIZ_NUM(state) {
    if (state.bizInfo) {
      return state.bizInfo
    } else {
      console.log('biz getter error')
      return 0
    }
  }
}
