<template>
  <div>
    <div class="data-search">
      <div class="left">
        <v-date-picker v-model="range" color="orange" is-range>
          <template v-slot="{ inputValue, inputEvents }">
            <input
              :value="inputValue.start"
              v-on="inputEvents.start"
              class="datepicker"
            />
            <span style="margin: 0 7px">-</span>
            <input
              :value="inputValue.end"
              v-on="inputEvents.end"
              class="datepicker"
            />
          </template>
        </v-date-picker>
        <VBtn type="submit" class="btn-type3 st1" @click="getMyOrder"
          >조회</VBtn
        >
      </div>

      <div class="right">
        <div class="total">
          <span class="label">합계</span>
          <span class="price"
            ><b>{{ totalPrice | comma }}</b
            >원</span
          >
        </div>
      </div>
    </div>
    <!-- table -->
    <div class="data-type1">
      <table>
        <colgroup>
          <col style="width: 100px" />
          <col style="width: 120px" />
          <col style="width: auto" />
          <col style="width: 130px" />
          <col style="width: 100px" />
          <col style="width: 150px" />
        </colgroup>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문일자</th>
            <th>주문상품</th>
            <th>결제금액</th>
            <th>주문자</th>
            <th>주문상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataList" :key="index">
            <td>{{ item.orderNum }}</td>
            <td>{{ item.date }}</td>
            <td>
              <VBtn @click="activateReipt(index)">{{ item.title }}</VBtn>
            </td>
            <td>{{ item.price | comma }}</td>
            <td>{{ item.orderer }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- //table -->
    <v-pagination
      :rangeSize.sync="rangeSize"
      :pageLimit="pageLimit"
      @movePage="movePage"
    />

    <v-receipt
      :receiptList="curdataList"
      v-show="isModalReceipt"
      @onConfirm="onModalReceiptConfirm"
    />

    <v-modal
      v-show="isModalVisible"
      :text="modalText"
      :isConfirm="isModalConfirm"
      @onCancel="onModalCancel"
      @onConfirm="onModalConfirm"
    />
  </div>
</template>

<script>
import VPagination from '../common/VPagination.vue'
import VReceipt from '../common/VReceipt.vue'
import { mapState, mapActions } from 'vuex'
import OrderDataService from '../../api/order/orderApi'
import TEMP from '../../assets/TempData'
import VModal from '../common/VModal.vue'
export default {
  components: { VPagination, VReceipt, VModal },
  computed: {
    //주문 정보
    ...mapState(TEMP.STORE_PATH.MYORDER, ['orderList']),
    //사용자 정보
    ...mapState(TEMP.STORE_PATH.USER, ['userInfo']),

    totalPrice() {
      return this.dataList.reduce((pre, value) => {
        return pre + value.price
      }, 0)
    },
  },
  watch: {
    formatMoment(date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
  },
  data() {
    return {
      dataList: [], //TEMP.MYORDER_DATA,
      allDataList: [],
      dateFilterDataList: [],
      range: {
        start: new Date(),
        end: new Date(),
      },
      curdataList: {},
      currentList: 1,
      currentPage: 1,
      rangeSize: 5,
      pageLimit: 5,
      store_id: 0,
      isModalReceipt: false,
      isModalVisible: false,
      modalText: '',
      isModalConfirm: false,
    }
  },

  created() {
    // 로그인 체크 처리
    let isLogin = this.loginCheck()
    if (!isLogin) {
      return
    }

    // 전체 주문 리스트
    this.initOrderManager()
    // 페이징 별도 처리
    this.setPage()
  },
  methods: {
    movePage(page) {
      this.currentPage = page
      this.listConfig()
    },

    // 조회 버튼 클릭
    getMyOrder() {
      this.listConfig()
      const count = this.dateFilterDataList.length
      let page = Math.floor(count / 10)
      if (count % 10 > 0) page += 1
      this.pageLimit = page
    },

    // 리스트 버튼 한번 클릭
    currentIndex(index) {
      this.currentList = index
    },

    // 리스트 주문상품 클릭
    activateReipt(index) {
      this.curdataList = this.dataList[index]
      this.isModalReceipt = true
    },

    // 모달창 확인 버튼(영수증)
    onModalReceiptConfirm() {
      this.isModalReceipt = false
    },

    // 로그인상태 알림창 취소 버튼
    onModalCancel() {
      this.isModalVisible = false
    },

    // 모달창 내 확인 버튼
    onModalConfirm() {
      this.moveloginPage()
      this.isModalVisible = false
    },

    async initOrderManager() {
      // 주문 내역 가져오기
      await this.setOrderList()
      await this.listConfig()
    },

    async setOrderList() {
      let store_id = this.userInfo.STORE_ID
      let response = await OrderDataService.getAll(store_id)
      let orderDatas = []
      if (response.data.isSuccess && !response.data.length) {
        orderDatas = response.data.datas
        for (let idx in orderDatas) {
          let list = orderDatas[idx]
          for (let item of list.items) {
            //주문시 여러 옵션들의 대해선 JSON.Stringify로 처리
            //DB 거쳐서 데이터 받아 올 경우 JSON.parse필요
            //효율적인 방법에 대해 추후
            //(2021-08-28)
            item.OPT_NM = JSON.parse(item.OPT_NM)
            //console.log(item);
          }
          let items = list.items
          let title_str = ''
          let total_price = 0
          //주문상품과 결제금액 합계를 위해 items사용
          for (let iidx in items) {
            // 상품 목록 대표 3개만 표시
            if (iidx <= 2) {
              title_str += `${items[iidx].PRT_NAME},`
            }
            total_price += items[iidx].ORDER_PRICE
          }

          // 마지막 문자 , 제거
          title_str = title_str.slice(0, -1)
          // 상품이 3개 초과 할 경우 외 ? 표시
          if (items.length > 3) {
            title_str += ` 외 + ${items.length - 3}`
          }
          this.dataList.push({
            orderNum: list.ORDER_NUM,
            date: this.$moment(list.ORDER_TIME).format('YYYY-MM-DD'),
            title: title_str,
            price: total_price,
            orderer: list.CUST_NM,
            status: list.ORDER_STATE,
            idx,
            items,
          })
        }
        this.allDataList = this.dataList
        //임시 코딩 적용(추후 제거 예정)
        let store_id = this.userInfo.STORE_ID
        this.$store.dispatch('order/MyOrder/FETCH_ORDER_INFO', { store_id })
      }
    },

    // 초기 페이지 설정
    async setPage() {
      let store_id = this.userInfo.STORE_ID
      let sDate = this.formatMoment(this.range.start)
      let eDate = this.formatMoment(this.range.end)

      let response = await OrderDataService.getDateCount(store_id, sDate, eDate)

      let datas = response.data
      let page = 0

      if (datas.isSuccess) {
        const count = datas.orderCnt
        let page = Math.floor(count / 10)
        if (count % 10 > 0) page += 1
        this.pageLimit = page
      }
    },

    async listConfig() {
      //페이지 리스트 표시
      let st_range = (this.currentPage - 1) * 10 + 1
      let et_range = 10 * this.currentPage

      //시간대별 표시
      let sDate = this.formatMoment(this.range.start)
      let eDate = this.formatMoment(this.range.end)

      //조건에 맞게 필터 처리
      let filter_items = this.allDataList.filter((list, index) => {
        return list.date >= sDate && list.date <= eDate
      })

      this.dateFilterDataList = filter_items

      //페이지에 맞게 필터 처리
      filter_items = filter_items.filter((list, index) => {
        return index >= st_range - 1 && index <= et_range - 1
      })
      this.dataList = filter_items
    },

    //로그인 체크 처리
    loginCheck() {
      let isLogin = true
      if (!this.userInfo || !this.userInfo.E_MAIL) {
        this.openInfoModal('로그인을 해주세요.', false)
        isLogin = false
      }
      return isLogin
    },
    //날짜 포맷처리(YYYY-MM-DD)
    formatMoment(date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },

    //알림 모달창 Open
    openInfoModal(modalText, isConfirm) {
      this.modalText = modalText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    moveloginPage() {
      //화면 이동
      if (!this.userInfo) {
        //로그인 화면으로 이동
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style></style>
