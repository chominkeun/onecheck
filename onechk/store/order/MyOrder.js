import OrderDataService from '../../api/order/orderApi'

export const state = () => ({
  orderList: []
})

export const mutations = {

  async SET_OrderList(state, orderlist) {
    state.orderList = orderlist
  }
}

export const actions = {
  FETCH_ORDER_INFO(context, payload) {
    let store_id = payload.store_id
    OrderDataService.getAll(store_id)
      .then(response => {
        context.commit('SET_OrderList', response.data.datas)
      })
      .catch(error => {
        console.log(error)
      })
  }
}
