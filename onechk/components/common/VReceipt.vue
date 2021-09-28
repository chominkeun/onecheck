<template>
  <div class="vmodal">
    <div class="vmodal-wrapper">
      <div class="vmodal-container">
        <div v-if="receiptList.length !== 0">
        <div class="infotable">
          <div class="infotable-item">
            <h3>주문 일자</h3>
            <span>{{receiptList.date}}</span>
          </div>
          <div class="infotable-item">
            <h3>주문 번호</h3>
            <span>{{receiptList.orderNum }}</span>
          </div>
          <div class="infotable-item">
            <h3>주문자</h3>
            <span>{{ receiptList.orderer }}</span>
          </div>
        </div>

        <div class="prttable">
          <div v-for="(item, index) in receiptList.items" :key="index"
              class="prttable-item">
            <!-- prttable-item에 v-for하셔서 쓰세용 -->
            <span class="prt">
              {{item.PRT_NAME}}
              <div v-for="(option) in item.OPT_NM" 
              :key="option.PRT_OPT_ID"
              style="font-size: 13px;">
                 <span class="opt" style="">{{option.G_NAME}} : {{option.O_NAME}}</span>
              </div>
            </span>
            <!-- <span class="opt">{{item.OPT_NM}}</span> -->
            <span class="cnt">{{item.ORDER_QTY}}</span>
            <span class="cost">{{item.ORDER_PRICE | comma}}</span>
          </div>
        </div>
        </div>
        <div class="receipt-footer">
          <Button class="confirmbtn" @click="onConfirm">확인</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableItem from './TableItem.vue'
export default {
  components: { TableItem },
  props : {
    receiptList : {
      type: Object,
      default : {}
    }
  },
  data() {
      return {
        orderNum : 0,
        date : '',
        orderer : '',
      }
  },

  methods: {
    onConfirm() {
      this.$emit('onConfirm');
    }
  }
}
</script>

<style scoped>
.infotable {
  width: 100%;
  border-bottom: 3px dashed #252525;
}
.infotable-item {
  font-size: 18px;
  display: flex;
  flex-direction: row;
  margin: 0px 0px 12px 10px;
}
.infotable-item h3 {
  width: 100px;
  text-align: start;
}
.prttable {
  width: 100%;
  padding: 20px 0px;
  border-bottom: 3px dashed #252525;
  margin-bottom: 20px;
}
.prttable-item {
  display: flex;
  flex-direction: row;
  margin: 0px 0px 12px 10px;
  font-size: 18px;
}
.prttable-item .prt {
  width: 200px;
  text-align: start;
}
.prttable-item .opt {
  width: 100px;
  text-align: start;
}
.prttable-item .cnt {
  width: 50px;
  text-align: start;
}
.prttable-item .cost {
  width: 100px;
  text-align: start;
}
.receipt-footer {
  width: 100%;
  height: 45px;
}
.receipt-footer .confirmbtn {
  width: 100%;
  height: 100%;
  background: white;
  color: #fff;
  border: 1px solid #b3b3b3;
  background: #383838;
  border-radius: 7px;
  font-size: 18px;
  letter-spacing: 7px;
}
</style>
