<template>
  <div>
    <div class="order-board">
      <div class="order-tab">
        <VBtn
          :class="{ on: pageMode == 'TABLE' }"
          @click="changePageMode('TABLE')"
          >테이블</VBtn
        >
        <VBtn
          :class="{ on: pageMode == 'ORDER' }"
          @click="changePageMode('ORDER')"
          >주문</VBtn
        >
      </div>
      <div class="order-list">
        <order-numbering
          v-show="!tableEditMode"
          @update="updateOrderPageNum"
        ></order-numbering>
        <order-layer
          :orderList="currentOrderList"
          @delete="deleteOrder"
          @deleteAll="deleteAllOrder"
        ></order-layer>
        <div v-show="tableEditMode" class="new-table">
          <table-attr-change
            :table="tableAttr"
            @change="changeTableAttr"
          ></table-attr-change>
          <p class="layer-tit">테이블 생성</p>
          <div class="attr">
            <span>테이블 이름</span>
            <VInput
              type="text"
              :value="newTableTitle"
              @input="handleNewTableTitle"
            />
          </div>
          <div class="attr">
            <span>수용 인원</span>
            <VInput
              type="text"
              :value="newTableCount"
              @input="handleNewTableCount"
            />
          </div>
          <div class="align-r" style="padding: 5px 0px 0px 0px">
            <VBtn class="btn-type6 st4" @click="createNewTable">생성 완료</VBtn>
          </div>
          <p class="err-msg" v-show="!newTableVisible">
            {{ tableCreateErrMsg }}
          </p>
          <div class="table-wrap" v-show="newTableVisible">
            <div class="table-box">
              <VBtn class="del"></VBtn>
              <span class="table-num">{{ newTableTitle }}</span>
              <div class="menu-name"></div>
              <div class="price">
                {{ 0 | comma }}<span class="unit">원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="pageMode == 'TABLE'" class="store-status">
        <div class="table-status">
          <div class="status-manu">
            <VBtn
              v-if="!tableEditMode && !tableMoveMode"
              class="btn-type2 st3"
              @click="editTable"
              >편집</VBtn
            >
            <VBtn
              v-else-if="tableEditMode && !tableMoveMode"
              class="btn-type2 st3"
              @click="cancelEditTable"
              >취소</VBtn
            >
            <div class="status-txt">
              <div class="text">
                {{ setStatusText }}
              </div>
            </div>
            <VBtn
              v-if="tableEditMode"
              class="btn-type2 st4"
              @click="saveEditTable"
              >저장</VBtn
            >
            <div v-else class="btn-layer">
              <VBtn
                v-if="tableMoveMode"
                class="btn-type2 st4"
                @click="moveCancel()"
                >이동 취소</VBtn
              >
              <VBtn
                v-else
                class="btn-type2 st4"
                @click="$refs.btnlayer.style.display = 'block'"
                >이동/합석</VBtn
              >
              <ul ref="btnlayer" style="display: none">
                <li>
                  <VBtn @click="moveTable">테이블 이동</VBtn>
                </li>
                <li><VBtn @click="mergeTable">테이블 합석</VBtn></li>
              </ul>
            </div>
          </div>
          <div class="table-view" ref="tableView">
            <div
              v-for="(table, index) in tableList"
              :key="index"
              :ref="table.id"
              class="table-box"
              :id="table.id"
              :style="`top:${table.x}px;left:${table.y}px`"
              @dblclick="clickTable(index)"
            >
              <VBtn
                v-if="tableEditMode"
                class="del"
                @click="deleteTable(index)"
              ></VBtn>
              <span class="table-num">{{ table.title }}</span>
              <div class="menu-name">
                {{ !tableEditMode ? table.menu : '' }}
              </div>
              <div class="price" v-if="!tableEditMode">
                {{ table.price | comma }} <span class="unit">원</span>
              </div>
              <div class="price" v-if="tableEditMode">
                {{ table.t_count | comma }}<span class="unit">명</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="pageMode == 'ORDER'" class="order-status">
        <div class="order-menu-tab" v-if="isCategoryData">
          <VueSlickCarousel :arrows="true" :slidesToShow="7">
            <!-- Store처리 하여 DB에 저장 된 값으로 처리 -->
            <div
              v-for="(menu, index) in catList"
              :key="index"
              class="tab"
              :class="{ on: currentMenuTabIndex === index }"
              @click="changeCategory(index)"
            >
              <VBtn>{{ menu.CATEGORY_NAME }} </VBtn>
              <!-- @click="currentMenuTabIndex = index" -->
            </div>
          </VueSlickCarousel>
        </div>
        <menu-list
          :menuList="menuList"
          @addCurrent_Opt="addCurrent_Opt"
        ></menu-list>
      </div>
    </div>
    <table-move-popup
      :isTableMoveAvailable="isTableMoveAvailable"
      :selectedTable="selectedTable"
      :movePop.sync="tableMovePopVisible"
      @cancel="cancelPopup"
      @complete="completePopup"
    ></table-move-popup>
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
import TEMP from '../assets/TempData'
import CONST from '../constants/Pos'
import $ from 'jquery'
import { mapState, mapActions, mapMutations } from 'vuex'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import OrderNumbering from '../components/Pos/OrderNumbering.vue'
import OrderLayer from '../components/Pos/OrderLayer.vue'
import MenuList from '../components/Pos/MenuList.vue'
import TableMovePopup from '../components/Pos/TableMovePopup.vue'
import { cloneDeep } from 'lodash'
import VModal from '../components/common/VModal.vue'
import TableAttrChange from '../components/Pos/TableAttrChange.vue'
export default {
  components: {
    VueSlickCarousel,
    OrderNumbering,
    OrderLayer,
    MenuList,
    TableMovePopup,
    VModal,
    TableAttrChange,
  },
  computed: {
    isTableMoveAvailable() {
      return (
        this.selectedTable[1] !== '' &&
        this.tableList[this.selectedTable[1]].menu !== ''
      )
    },
    setStatusText() {
      if (this.tableEditMode && !this.disableDrag) {
        return '원하는 위치에 드래그하여 놓으세요'
      } else if (this.tableEditMode && this.disableDrag) {
        return '해당위치에는 놓을 수 없습니다!'
      } else if (this.tableMoveMode && this.selectedTable[0] !== '') {
        return '어느 테이블로 이동할지 선택하세요.'
      } else if (this.tableMoveMode) {
        return '이동할 테이블을 선택하세요.'
      } else {
        return '매장 테이블'
      }
    },
    //상품 정보
    ...mapState(TEMP.STORE_PATH.PRODUCT, ['prtList', 'catList']),
    //사용자 정보
    ...mapState(TEMP.STORE_PATH.USER, ['userInfo']),
    //주문 정보
    ...mapState(TEMP.STORE_PATH.ORDER, ['cashOrderPage', 'cashOrderList']),
  },
  data() {
    return {
      newTableTitle: '',
      newTableCount: '',
      newTableVisible: false,
      tableMovePopVisible: false,
      currentOrderPage: 1,
      currentOrderList: [],
      tableList: TEMP.TABLE_LIST,
      currentMenuTabIndex: 0,
      menuTabList: TEMP.MENU_TAB_LIST,
      isCategoryData: false,
      menuList: [],
      store_id: '',
      pageMode: 'TABLE',
      tableEditMode: false,
      tableMoveMode: false,
      selectedTable: ['', ''],
      tempTableList: [],
      override: false,
      disableDrag: false,
      zIndex: 1,
      tableCreateErrMsg: '',
      tableAttr: CONST.DEFAULT_TABLE_ATTR,
      isModalVisible: false,
      modalText: '',
      isModalConfirm: false,
    }
  },
  created() {
    // 로그인 체크 처리
    let isLogin = this.logincheck()
    if (!isLogin) {
      return
    }
    // 가게 정보 존재 유무 체크
    let hasStore = this.storeCheck()
    if (!hasStore) {
      return
    }
    this.set_init_Product()
  },
  mounted() {
    this.initJqueryUI()
  },
  destroyed() {
    // 카테고리 및 상품 리스트 초기화
    this.SET_CLEAR_LIST()
  },
  methods: {
    // 매장에 등록 된 상품 목록 관리
    ...mapActions(TEMP.STORE_PATH.PRODUCT, [
      'FETCH_PRT_LIST',
      'FETCH_PRODUCT_CATEGORY_LIST',
      'FETCH_PRT_LIST_ORDER',
    ]),
    // 상품별 등록 된 옵션 목록 관리
    ...mapActions(TEMP.STORE_PATH.OPTION, ['ACT_PRT_OPT']),
    // 주문별 처리
    ...mapActions(TEMP.STORE_PATH.ORDER, [
      'FETCH_addPageOrderList',
      'FETCH_cashOrderPage',
      'FETCH_changePageOrderList',
      'FETCH_deleteOrder',
      'FETCH_deleteAllOrder',
    ]),

    ...mapMutations(TEMP.STORE_PATH.PRODUCT, [
      'SET_PRT_LIST',
      'SET_CLEAR_LIST',
    ]),

    //상품 정보 Setting
    async set_init_Product() {
      //매장정보 셋팅
      //this.store_id = this.userInfo !== null ? this.userInfo.store_id : 2
      //카테고리 셋팅
      this.$nuxt.$loading.start()
      await this.getPcategory()
      //상품 셋팅
      await this.getProduct()
      this.$nuxt.$loading.finish()
    },

    async getPcategory() {
      // 매장 내 상품카테고리들을 Store 변수(catList)에 저장
      // this.$store.dispatch('product/product/FETCH_CAT_LIST', {url : `pcategory/${this.store_id}`});
      await this.FETCH_PRODUCT_CATEGORY_LIST(this.userInfo.STORE_ID)

      if (this.catList.length !== 0) {
        this.isCategoryData = true
      }
    },

    async getProduct() {
      // 매장 내 상품목록들을 Store 변수(prtList)에 저장
      let payload = {
        store_id: this.userInfo.STORE_ID,
      }
      await this.FETCH_PRT_LIST_ORDER(payload)
      //옵션 셋팅
      this.prtList.forEach(async (item) => {
        let menu = item
        let optionData = await this.ACT_PRT_OPT(menu.PRT_ID)
        if (optionData.length) {
          let NA_OPT_ID = 9999
          for (let option of optionData) {
            option.O_NAMES.unshift({
              O_NAME: 'N/A',
              PRT_OPT_ID: NA_OPT_ID,
              NA_PRT_OPT_ID: NA_OPT_ID,
            })
            NA_OPT_ID--
          }
        }
        menu.options = optionData
      })
      this.SET_PRT_LIST(this.prtList)
    },

    changeCategory(index) {
      //선택 된 카테고리 index가 같은 경우 return 처리
      if (this.currentMenuTabIndex === index) {
        return
      }
      //카테고리 선택 버튼 활성화
      this.currentMenuTabIndex = index

      if (index === 0) {
        //카테고리 "전체"를 선택 한 경우
        this.menuList = this.prtList
        return
      }
      var category_id = this.catList[index].CATEGORY_ID
      var filter_itmes = []
      //카테고리 필터처리 후 해당되는 상품들만 추출
      if (this.prtList !== null && this.prtList.length !== 0) {
        filter_itmes = this.prtList.filter((menu) => {
          return menu.CATEGORY_ID === category_id
        })
      }
      this.menuList = filter_itmes
    },
    // 버튼 리스너모음[Start]
    changePageMode(mode) {
      // 테이블,주문 버튼
      this.pageMode = mode
      this.disableTableEdit()
      this.resetTableMove()
      if (this.pageMode === 'ORDER') {
        //주문 버튼 선택시 목록들을 저장
        if (!this.isCategoryData && !this.catList) {
          this.isCategoryData = true
        }
        if (
          this.prtList !== null &&
          this.prtList.length !== 0 &&
          this.menuList.length === 0
        ) {
          //메뉴 셋팅
          this.setMenuList()
        }
      }
    },
    createNewTable() {
      //생성완료 버튼
      if (this.newTableTitle == '') {
        this.newTableVisible = false
        this.tableCreateErrMsg = '테이블의 이름은 1글자 이상 이여야 합니다.'
      } else if (!this.isTitleAvailable(this.newTableTitle)) {
        this.newTableVisible = false
        this.tableCreateErrMsg = '중복되는 테이블 이름입니다.'
      } else {
        this.newTableVisible = true
        this.tableCreateErrMsg = ''
      }
    },
    editTable() {
      // 편집 버튼
      this.tempTableList = cloneDeep(this.tableList)
      this.enableTableEdit()
    },
    cancelEditTable() {
      //취소 버튼
      this.tableList = cloneDeep(this.tempTableList)
      this.tempTableList = []
      this.disableTableEdit()
      this.resetCreateNewTable()
      this.resetTableAttr()
    },
    saveEditTable() {
      //저장 버튼
      this.disableTableEdit()
      this.resetCreateNewTable()
    },

    moveCancel() {
      //이동 취소 버튼
      this.tableMoveMode = false
      this.resetTableMove()
    },
    moveTable() {
      // 테이블 이동
      this.tableMoveMode = true
      this.$refs.btnlayer.style.display = 'none'
    },
    mergeTable() {
      //테이블 합석 버튼
    },
    deleteTable(index) {
      // 테이블 제거 버튼
      this.tableList.splice(index, 1)
    },
    clickTable(index) {
      // 테이블 클릭 함수
      if (this.tableEditMode) {
        this.editTableAttr(index)
      } else {
        this.selectTable(index)
      }
    },
    editTableAttr(index) {
      this.tableAttr = {
        isActive: true,
        index,
        title: this.tableList[index].title,
        t_count: this.tableList[index].t_count,
      }
    },
    selectTable(index) {
      if (
        !this.tableMoveMode ||
        this.selectedTable[0] === index ||
        (this.selectedTable[0] === '' && this.tableList[index].menu === '')
      )
        return
      if (this.selectedTable[0] === '' && this.tableList[index].menu !== '') {
        this.$set(this.selectedTable, 0, index)
      } else {
        this.$set(this.selectedTable, 1, index)
        this.tableMovePopVisible = true
      }
      $('.table-view .table-box').eq(index).addClass('on')
    },
    cancelPopup() {
      //테이블 이동 팝업에서 취소버튼
      this.resetTableMove()
    },
    completePopup() {
      //테이블 이동 팝업에서 확인버튼
      this.moveComplete()
      this.resetTableMove()
    },
    // 버튼 리스너모음[End]

    changeTableAttr(table) {
      const index = this.tableAttr.index
      this.tableList[index].title = table.title
      this.tableList[index].t_count = table.t_count
      this.resetTableAttr()
    },
    resetTableAttr() {
      this.tableAttr = CONST.DEFAULT_TABLE_ATTR
    },

    isTitleAvailable(title) {
      //tableList 배열 내에 같은타이틀을 가진 테이블이 있는지 확인한다.
      // 사용가능하면 true, 아니면 false를 반환한다.
      return !this.tableList.some((table) => table.title == title)
    },
    resetCreateNewTable() {
      // 테이블생성에 관련된 변수들을 초기화 하는 매소드.
      this.newTableTitle = ''
      this.newTableCount = ''
      this.newTableVisible = false
    },
    enableTableEdit() {
      // 테이블 이동모드로 만들어주는 매소드.
      this.tableEditMode = true
      this.resetTableDraggable()
    },
    disableTableEdit() {
      // 테이블 이동모드를 종료하는 매소드.
      this.tableEditMode = false
      this.resetTableDraggable()
    },
    handleNewTableTitle(value) {
      // 테이블 생성시 테이블 이름을 바인딩하기 위한 매소드.
      this.newTableTitle = value
    },
    handleNewTableCount(value) {
      // 테이블 생성시 테이블 수용인원을 바인딩하기 위한 매소드.
      this.newTableCount = value
    },
    updateOrderPageNum(number) {
      //order-numbering 컴포넌트의 emit 메소드. 현재주문페이지를 업데이트한다.
      this.currentOrderPage = number
      TEMP.STORE_PATH.ORDER
      this.FETCH_cashOrderPage(number)
      this.currentOrderList = this.cashOrderList[number - 1]
    },
    addCurrent_Opt(curOrder) {
      //상품 주문내역 추가(추후 로직 변경 예정)
      let isexist = false
      let exist_index = -1
      let cur_datas = []
      //[ { "G_NAME": "사이즈", "O_NAME": "M" }, { "G_NAME": "온도", "O_NAME": "HOT" }, { "G_NAME": "커스텀 옵션", "O_NAME": "휘핑 추가" } ]
      // 기존에 동일한 주문 내역이 존재하는지 객체 내 탐색 배열 형식을 JSON.stringify을 이용해 String으로 치환 후 비교
      // 단) 동일 상품 이지만 한 상품 내 선택한 옵션이 하나라도 다를 경우 리스트가 새로 추가 됨
      if (this.currentOrderList.length !== 0) {
        exist_index = this.currentOrderList.findIndex((item) => {
          // 상품ID AND 옵션객체(String)
          return (
            item.prtId === curOrder.menuID &&
            JSON.stringify(item.curOpt) === JSON.stringify(curOrder.curOptVal)
          )
        })
      }

      if (exist_index !== -1) {
        isexist = true
      }

      //존재하지 않을 경우 : 객체 삽입
      if (!isexist) {
        // this.currentOrderList.push(
        //   {
        //     prtId : curOrder.menuID,
        //     prtName : curOrder.menuName,
        //     curCnt : curOrder.curInpNum,
        //     curOpt : curOrder.curOptVal,
        //     prtPrice : (curOrder.price * curOrder.curInpNum)
        //   }
        // )
        let add_data = {
          prtId: curOrder.menuID,
          prtName: curOrder.menuName,
          curCnt: curOrder.curInpNum,
          curOpt: curOrder.curOptVal,
          prtPrice: curOrder.price * curOrder.curInpNum,
        }
        //console.log(add_data);
        this.FETCH_addPageOrderList(add_data)
      } else {
        //기존에 동일한 주문 내역이 존재 할 경우 : 수량과 금액만 변경
        cur_datas = this.currentOrderList[exist_index]
        var params = {
          index: exist_index,
          curCnt: cur_datas.curCnt + curOrder.curInpNum,
          prtPrice: cur_datas.prtPrice + curOrder.price * curOrder.curInpNum,
        }
        this.FETCH_changePageOrderList(params)
      }
    },

    setMenuList() {
      //메뉴 셋팅
      this.menuList = this.prtList
    },

    deleteOrder(index) {
      //단일주문 삭제
      this.FETCH_deleteOrder(index)
    },
    deleteAllOrder() {
      //주문내역 전체 삭제
      this.FETCH_deleteAllOrder()
    },
    moveComplete() {
      //테이블 이동을 완료를 위한 메소드. table-move-popup 의 emit메소드.
      //TODO : 백엔드가 확실하게 정해지고 내용 거의다 수정해야될듯.
      let prev = this.selectedTable[0]
      let next = this.selectedTable[1]
      this.tableList[next].menu = this.tableList[prev].menu
      this.tableList[next].price = this.tableList[prev].price
      this.tableList[prev].menu = ''
      this.tableList[prev].price = 0
    },
    resetTableMove() {
      //테이블 이동에 필요한 변수들을 초기화하는 메소드.
      this.selectedTable = ['', '']
      $('.table-view .table-box').removeClass('on')
      this.tableMovePopVisible = false
      this.tableMoveMode = false
    },
    resetTableDraggable() {
      if (this.tableEditMode) {
        //$tableViewBox.draggable('enable')
        $('.table-box').draggable('enable')
      } else {
        //$tableViewBox.draggable('disable')
        $('.table-box').draggable('disable')
      }
    },
    initJqueryUI() {
      // 테이블이동을 위한 JqueryUI 초기화 함수.
      this.initTableViewBoxDraggable()
      let $tableViewBox = $('.table-view .table-box')
      let $newBox = $('.new-table .table-box')
      let $tableView = $('.table-view')

      import('~/assets/js/jquery-ui.js').then((m) => {
        let dragFnc = (ui) => {
          this.override = false
          this.zIndex += 1
          $(ui.helper).draggable({ revert: false })
          $(ui.helper).css('z-index', this.zIndex)
        }
        let dropFnc = (ui) => {
          this.override = true
          this.disableDrag = true
          $(ui.helper).draggable({ revert: true })
          setTimeout(() => {
            this.disableDrag = false
          }, 500)
        }

        $newBox.draggable({
          revert: true,
          helper: 'clone',
          cursor: 'move',
          classes: {
            'ui-draggable': 'drag-clone',
          },
          drag: (e, ui) => {
            dragFnc(ui)
          },
        })
        $tableViewBox.draggable('disable')
        $tableViewBox.droppable({
          accept: '.table-box',
          tolerance: 'touch',
          drop: (e, ui) => {
            dropFnc(ui)
          },
        })

        $tableView.droppable({
          drop: (e, ui) => {
            let uiHelper = ui.helper[0]
            if (this.override) {
              return
            }
            if (uiHelper.className == CONST.CLASS_CURRENT_TABLE) {
              let index = this.tableList.findIndex(
                (table) => table.title == uiHelper.childNodes[2].innerText
              )
              this.$set(this.tableList[index], 'x', parseInt(ui.position.top))
              this.$set(this.tableList[index], 'y', parseInt(ui.position.left))
            } else if (uiHelper.className == CONST.CLASS_NEW_TABLE) {
              let newTop =
                parseInt(uiHelper.offsetTop) -
                parseInt($('.table-view').position().top)
              let newLeft =
                parseInt(uiHelper.offsetLeft) -
                parseInt($('.table-view').position().left)

              if (!this.override) $('.ui-draggable-dragging').hide()
              let newTable = {
                title: this.newTableTitle,
                menu: '',
                t_count: this.newTableCount,
                price: 0,
                x: newTop,
                y: newLeft,
              }
              this.tableList.push(newTable)
              this.resetCreateNewTable()
              this.$nextTick(() => {
                // $nextTick으로 테이블들이 재랜더링 될때까지 기다린다.
                this.initTableViewBoxDraggable()
              })
            }
          },
        })
      })
    },
    initTableViewBoxDraggable() {
      // table-view 안에있는 테이블들의 JqueryUI를 초기화하는 함수.
      // 테이블이 추가될때마다 다시 불러줘야해서 initJqueryUI로 부터 독립 관리.
      import('~/assets/js/jquery-ui.js').then((m) => {
        let $tableViewBox = $('.table-view .table-box')
        let dragFnc = (ui) => {
          this.override = false
          this.zIndex += 1
          $(ui.helper).draggable({ revert: false })
          $(ui.helper).css('z-index', this.zIndex)
        }
        $tableViewBox.draggable({
          containment: 'parent',
          cursor: 'move',
          drag: (e, ui) => {
            dragFnc(ui)
          },
        })
      })
    },
    logincheck() {
      let isLogin = true
      if (!this.userInfo || !this.userInfo.E_MAIL) {
        this.openInfoModal('로그인을 해주세요', false)
        isLogin = false
      }
      return isLogin
    },

    storeCheck() {
      //가게 정보 확인
      let hasStore = true
      if (!this.userInfo.STORE_ID || this.userInfo.STORE_ID == '') {
        this.openInfoModal('가게가 존재하지 않습니다.', false)
        hasStore = false
      }

      return hasStore
    },

    openInfoModal(modalText, isConfirm) {
      this.modalText = modalText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
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

    moveloginPage() {
      //화면 이동
      if (!this.userInfo.USER_ID || this.userInfo.USER_ID == '') {
        //로그인 화면으로 이동
        this.$router.push('/login')
      } else if (!this.userInfo.STORE_ID) {
        //가게 화면으로 이동
        this.$router.push('/store')
      }
    },
    /* 최상단으로 스크롤 해주는 메소드 */
    scrollToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>
