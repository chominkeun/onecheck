import CONST from '../../constants/table'
import TableDataService from '../../api/table/tableApi'

export const state = () => ({
  tableInfo: {}
})

export const mutations = {
  // TABLE 기본값 설정
  SET_DEFAULT_TABLE_INFO(state) {
    state.tableInfo = CONST.DEFAULT_TABLE_INFO
  },
  // TABLE 명칭 수정
  SET_T_SEAT_NO(state, tSeatNo) {
    state.tableInfo.T_SEAT_NO = tSeatNo
  },
  // TABLE 좌석 수정
  SET_T_COUNT(state, tCount) {
    state.tableInfo.T_COUNT = tCount
  },
  // TABLE 좌표 정보 수정
  SET_TABLE_LOC_XY(state, payload) {
    state.tableInfo.LOC_X = payload.loc_x
    state.tableInfo.LOC_Y = payload.loc_y
  },
  // TABLE 주문내역 수정
  SET_MENU(state, menu) {
    state.tableInfo.MENU = menu
  },
  // TABLE 주문내역 금액 수정
  SET_PRICE(state, price) {
    state.tableInfo.PRICE = price
  }
}

export const actions = {
  // TABLE 정보 생성
  CREATE_TABLE_INFO({ state }, storeId) {
    TableDataService.create(storeId, state.tableInfo)
  },
  // TABLE 정보 수정
  UPDATE_TABLE_INFO({ state }, tSeatId) {
    TableDataService.update(tSeatId, state.tableInfo)
  },
  // TABLE 정보 삭제
  DELETE_TABLE_INFO(context, tSeatId) {
    TableDataService.delete(tSeatId)
  },
  // TABLE 정보 조회
  FETCH_TABLE_INFO(context, storeId) {
    TableDataService.getAllTable(storeId)
      .then(response => {
        context.commit('SET_STORE_INFO', response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  }
}

export const getters = {}
