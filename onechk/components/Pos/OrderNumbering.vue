<template>
  <div class="order-numbering">
    <!-- order page 123 사용 -->
    <!-- <VBtn class="prev" @click="pagePrev"></VBtn>
    <VBtn class="add" @click="addPage"></VBtn> -->
    <div class="paging">
      <div class="scroll" :style="`top:${pageScrollTop}px`">
        <VBtn
          v-for="num in orderPage"
          :key="num"
          :class="{ on: num === currentOrderPage }"
          @click="updateOrderPageNum(num)"
          >{{ num }}</VBtn
        >
      </div>
    </div>
    <!-- <VBtn class="next" @click="pageNext"></VBtn> -->
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import TEMP from '~/assets/TempData'
export default {
  computed: {
    //주문 정보
    ...mapState(TEMP.STORE_PATH.ORDER, [
      'cashOrderPage', 
      'cashOrderList'])
  },

  data() {
    return {
      pageScrollTop: 0,
      pageH: 39,
      orderPage: 3,
      currentOrderPage: 1
    }
  },

  created() {
    //vue instance 생성시 store에 정보가 남아 있지 않을 경우 초기화
    //그 외엔 store 객체 의존
    if (this.cashOrderList === null || this.cashOrderList.length === 0){
      this.set_init_order();
    } 
    this.orderPage = this.cashOrderList.length

    let curOrderPage = this.cashOrderPage !== 0 ? this.cashOrderPage : this.currentOrderPage
    this.updateOrderPageNum(curOrderPage)
  },

  destroyed() {
    //현재는 POS 페이지 나갈 경우 초기화 처리....
    //추후 보류 목록 저장 개발 예정...
    this.CLEAR_ORDER();
  },

  methods: {
    ...mapMutations(TEMP.STORE_PATH.ORDER, [
      'SET_deleteAllOrder'
    ]),
    ...mapActions(TEMP.STORE_PATH.ORDER, [
      'FETCH_cashOrderList',
      'CLEAR_ORDER',
    ]),
    set_init_order() {
      //Page별로 Order를 저장하기 위해 초기화
      for(let i = 0; i < this.orderPage ; i++){
        this.FETCH_cashOrderList([])
      }
    },
    pagePrev() {
      if (this.orderPage > 10 && this.pageScrollTop < 0)
        this.pageScrollTop += 39
    },
    pageNext() {
      if (
        this.orderPage > 10 &&
        this.pageScrollTop > -((this.orderPage - 10) * this.pageH)
      )
        this.pageScrollTop -= this.pageH
    },
    addPage() {
      this.orderPage += 1
      //Page 추가시 orderList 신규 추가
       this.FETCH_cashOrderList([])
    },
    updateOrderPageNum(number) {
      this.currentOrderPage = number
      this.$emit('update', number)
    }
  }
}
</script>

<style></style>
