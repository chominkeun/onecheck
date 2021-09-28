import { fetchCommonAxiosGet, fetchCommonAxiosPostOpt } from '../../api/common/commonApi.js'

export const state = () => ({
  cashOrderPage: 0,
  cashOrderList: []
})

export const mutations = {
  //페이지 추가 또는 초기화
  SET_cashOrderList(state, orderlist) {
    state.cashOrderList.push(orderlist)
  },
  //선택 된 페이지
  SET_cashOrderPage(state, orderPage) {
    state.cashOrderPage = orderPage
  },
  //해당 주문 페이지 내 목록들을 신규 추가
  SET_addPageOrderList(state, pageOrder) {
    let currentPage = state.cashOrderPage
    state.cashOrderList[currentPage - 1].push(pageOrder)
    // prtId : pageOrder.prtId,
    // prtName : pageOrder.prtName,
    // curCnt : pageOrder.curCnt,
    // curOpt : pageOrder.curOpt,
    // prtPrice : pageOrder.prtPrice,
    // store_id : pageOrder.store_id

  },
  //주문 패이지 내 수량 및 가격 변경
  SET_changePageOrderList(state, pageOrder) {
    let currentPage = state.cashOrderPage
    var change_datas = state.cashOrderList[currentPage - 1][pageOrder.index]
    change_datas.curCnt = pageOrder.curCnt
    change_datas.prtPrice = pageOrder.prtPrice
  },
  //단일주문 삭제
  SET_deleteOrder(state, index) {
    let currentPage = state.cashOrderPage
    state.cashOrderList[currentPage - 1].splice(index, 1)
  },
  //해당 페이지 내 주문내역 전체 삭제
  SET_deleteAllOrder(state) {
    let currentPage = state.cashOrderPage
    let TargetOrders = state.cashOrderList[currentPage - 1]
    TargetOrders.splice(0, TargetOrders.length)
  },

  //해당 페이지 내역 삭제(결제 완료시)
  SET_orderPageDelete(state) {
    let currentPage = state.cashOrderPage
    let pageOrderList = state.cashOrderList
    //주문 페이지 삭제
    pageOrderList.splice((currentPage - 1), 1)

    if (currentPage !== 1) {
      //주문 페이지 삭제시 선택한 페이지로 부터 -1 처리
      currentPage = currentPage - 1
    }
  },

  SET_CLEAR_ORDER(state){
   //주문 목록 전체 초기화...
   for(let idx=0; idx < state.cashOrderList.length; idx++){
    state.cashOrderList[idx] = []
   }
  }
}

export const actions = {
  //페이지 추가 또는 초기화
  FETCH_cashOrderList(context, orderList) {
    context.commit('SET_cashOrderList', orderList)
  },
  //선택 된 페이지
  FETCH_cashOrderPage(context, orderPage) {
    context.commit('SET_cashOrderPage', orderPage)
  },
  //해당 주문 페이지 내 목록들을 신규 추가
  FETCH_addPageOrderList(context, pageOrder) {
    context.commit('SET_addPageOrderList', pageOrder)
  },
  //주문 패이지 내 수량 및 가격 변경
  FETCH_changePageOrderList(context, targetOrder) {
    context.commit('SET_changePageOrderList', targetOrder)
  },
  //단일주문 삭제
  FETCH_deleteOrder(context, index) {
    context.commit('SET_deleteOrder', index)
  },
  //해당 페이지 내 주문내역 전체 삭제
  FETCH_deleteAllOrder(context) {
    context.commit('SET_deleteAllOrder')
  },
  //전체 페이지에 해당되는 주문내역 삭제
  CLEAR_ORDER(context){
    context.commit('SET_CLEAR_ORDER')
  },
  //주문 내역 생성 DB 입력
  FETCH_dbInsert(context, payload) {
    return fetchCommonAxiosPostOpt(payload.url, payload.datas)
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}


