<template>
  <div class="order-layer">
    <div class="title">
      <p class="layer-tit">주문내역</p>
      <VBtn
        v-if="deleteMode"
        class="btn-type6 st5"
        @click="completeButton"
        style="margin-left: 196px"
        >완료</VBtn
      >
      <VBtn
        v-else
        class="btn-type6 st3"
        @click="deleteModeButton"
        style="margin-left: 196px"
        >삭제</VBtn
      >
    </div>
    <!-- table -->
    <div class="data-type1">
      <table>
        <colgroup>
          <col style="width: 40px" />
          <col style="width: 145px" />
          <col style="width: 50px" />
          <col style="width: 85px" />
          <col v-if="deleteMode" style="width: 70px" />
        </colgroup>
        <thead>
          <tr>
            <th>NO</th>
            <th>상품명</th>
            <th>수량</th>
            <th>금액</th>
            <th v-if="deleteMode">
              <VBtn class="delButton" @click="deleteAllOrder">전체 삭제</VBtn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orderList" :key="index">
            <td>{{ (index + 1) | comma }}</td>
            <td>
              {{ order.prtName }}
              <div v-if="Options(order) !== ''">
                <p style="font-size: 12px">{{ Options(order) }}</p>
              </div>
            </td>
            <td>{{ order.curCnt | comma }}</td>
            <td>{{ order.prtPrice | comma }}</td>
            <td v-if="deleteMode">
              <VBtn class="delButton" @click="deleteOrder(index)">삭제</VBtn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- //table -->

    <div class="payment">
      <div class="account">
        <span class="label">총</span>
        <div class="price">
          <b>{{ totalAmount | comma }}</b
          >원
        </div>
      </div>
      <div class="btn">
        <!-- 결제 -> 주문으로 변경 -->
        <VBtn class="btn-type1 st1" @click="payment">주문</VBtn>
      </div>
    </div>

    <v-modal
      v-show="isModalVisible"
      :isConfirm="isModalConfirm"
      :text="modalText"
      @onCancel="onModalCancel"
      @onConfirm="onModalConfirm"
    >
    </v-modal>
  </div>
</template>

<script>
import TEMP from '../../assets/TempData'
import { mapState, mapActions } from 'vuex'
import ModalOrder from '../../components/common/VModal'

export default {
  componets: {
    ModalOrder,
  },
  computed: {
    //총 가격
    totalAmount() {
      return this.orderList.reduce((pre, value) => {
        return pre + value.prtPrice
      }, 0)
    },
    //사용자 정보
    ...mapState(TEMP.STORE_PATH.USER, ['userInfo']),
  },
  props: {
    orderList: {
      type: Array,
      default: TEMP.DATA_LIST3,
    },
  },
  data() {
    return {
      deleteMode: false,
      isModalVisible: false,
      isModalConfirm: false,
      modalText: '',
    }
  },
  methods: {
    ...mapActions(TEMP.STORE_PATH.ORDER, ['FETCH_dbInsert']),
    deleteModeButton() {
      //상단 삭제버튼
      this.deleteMode = true
    },
    completeButton() {
      //완료버튼
      this.deleteMode = false
    },
    deleteOrder(index) {
      //삭제버튼
      this.$emit('delete', index)
    },
    deleteAllOrder() {
      //전체삭제 버튼
      this.$emit('deleteAll')
    },

    onModalCancel() {
      this.isModalVisible = false
    },
    onModalConfirm() {
      //모달 알림창에서 확인 버튼 클릭
      this.isModalVisible = false
      //주문완료 확인 시 해당 페이지 내 주문리스트 전체 삭제
      this.deleteAllOrder()
    },
    payment() {
      // 주문내역 없을 경우..
      if (!this.orderList.length) {
        this.modalText = '주문내역이 없습니다.'
        this.isModalVisible = true
        return
      }
      //1. 주문 내역 생성
      //2. 결제 프로세스 연동(추후 처리 예정)

      //결제버튼 클릭
      let pageUrl = `/order/createOrder`

      //주문 내역 생성 전 필요한 기본적인 데이터는 여기서 처리
      //주문번호(ORDER_NUM)는 DB 조회 후 채번이 필요하므로 서버단에서 처리해야 함
      let datas = {
        store_order: {
          ORDER_STATE: 'complete',
          ORDER_TIME: new Date(),
          STORE_ID: this.userInfo.STORE_ID,
        },
        line_item: [],
      }

      //LINE_ITEM에 관한 기본 데이터 처리
      //ORDER_ID는 STORE_ORDER가 DB 상 입력이 되어야 하므로
      //서버 단에서 별도 처리

      //OPT_NM는 N개의 옵션에 대해서 컬럼 추가하기도 애매함
      //입력시 옵션들의 정보들은 JSON.stringify형 String type으로 변환 후 입력처리
      //주문내역 조회시 JSON.parse 활용
      for (const order of this.orderList) {
        datas.line_item.push({
          ORDER_QTY: order.curCnt,
          ORDER_PRICE: order.prtPrice,
          PRT_ID: order.prtId,
          OPT_NM: JSON.stringify(order.curOpt),
        })
      }
      //param1 api 호출 path
      //param2 object
      let res = this.FETCH_dbInsert({ datas, url: pageUrl })

      res.then((t) => {
        if (t.isSuccess) {
          let orderNum = t.orderNum
          this.modalText = `주문이 완료되었습니다.\n\n 주문 번호 : ${orderNum}`

          this.isModalVisible = true
        }
      })
    },

    Options(order) {
      if (!order.curOpt.length) {
        return ''
      }

      const option_nms = []
      order.curOpt.forEach((option) => {
        option_nms.push(option.O_NAME)
      })

      const option_str = `옵선 : ${option_nms.join(' / ')}`
      return option_str
    },
  },
}
</script>

<style scoped>
.delButton {
  color: #f27e00;
}
</style>
