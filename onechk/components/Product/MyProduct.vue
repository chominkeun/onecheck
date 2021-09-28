<template>
  <div>
    <div class='data-info-top'>
      <div class='left'>
        <VBtn
          v-for='item in catList'
          :key='item.CATEGORY_ID'
          class='btn-type3 st5'
          :class='{ st6: currentCatId === item.CATEGORY_ID }'
          @click='checkCategoryMenu(item.CATEGORY_ID)'
        >{{ item.CATEGORY_NAME }}
        </VBtn
        >
      </div>
      <div class='right'>
        <VBtn class='btn-type3 st8' @click='openCatEditPopup'
        ><i class='ico i-setting'></i>카테고리 편집
        </VBtn
        >
        <VBtn class='btn-type3 st8' @click='openCatMovePopup'
        ><i class='ico i-pen'></i>카테고리 이동
        </VBtn
        >
      </div>
    </div>
    <div class='data-type1'>
      <table>
        <colgroup>
          <col style='width:100px' />
          <col style='width:100px' />
          <col style='width:auto' />
          <col style='width:170px' />
          <col style='width:200px' />
        </colgroup>
        <thead>
        <tr>
          <th>
            <VCheckbox :checked.sync='all' @change='allCheckList' />
          </th>
          <th>NO</th>
          <th>상품명</th>
          <th>가격(원)</th>
          <th>수량(개)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(item, index) in dataList' :key='index'>
          <td>
            <VCheckbox
              :checked.sync='item.check'
              @change='checkChangeList(index)'
            />
          </td>
          <td>{{ isCurrentPageNum + index + 1 }}</td>
          <td class='align-l'>
            <VBtn @click='modifyProduct(item)'>{{ item.PRT_NAME }}</VBtn>
          </td>
          <td>{{ item.PRICE | comma }}</td>
          <td>{{ item.PRT_QTY }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class='btn-box align-r'>
      <VBtn class='btn-type2 st5' @click='deleteProductMenu'>상품 삭제</VBtn>
      <VBtn class='btn-type2 st1' @click='updateSelectedMenu'>상품 추가</VBtn>
    </div>
    <v-pagination
      :rangeSize='rangeSize'
      :pageLimit='pageLimit'
      @movePage='movePage'
    />
    <cartegory-edit-popup :popVisible.sync='popVisible' />
    <cartegory-move-popup :popMoveVisible.sync='popMoveVisible' />

    <v-modal
      v-show='isModalVisible'
      :text='modalText'
      :isConfirm='isModalConfirm'
      @onCancel='onModalCancel'
      @onConfirm='onModalConfirm'
    />
  </div>
</template>

<script>
import TEMP from '../../assets/TempData'
import CONST from '../../constants/Product'
import CartegoryEditPopup from './CartegoryEditPopup.vue'
import CartegoryMovePopup from './CartegoryMovePopup.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
import ProductApiService from '../../api/product/productApi'
import VModal from '../common/VModal.vue'

export default {
  components: {
    CartegoryEditPopup,
    CartegoryMovePopup,
    VModal
  },
  computed: {
    ...mapState(TEMP.STORE_PATH.USER, [
      'userInfo',
      'isLogin'
    ]),

    ...mapState(TEMP.STORE_PATH.PRODUCT, [
      'prtList',
      'catList'
    ]),
    isCurrentPageNum() {
      const num = (this.currentPage === 1) ? 0 : this.currentPage * 10 - 10
      return num
    }
  },
  props: {
    deletemode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      all: false,
      list: [],
      listNum: 10,
      currentPage: 1,
      rangeSize: 5,
      pageLimit: 5,
      dataList: [],
      popVisible: false,
      popMoveVisible: false,
      myStoreId: '',
      modalText: '',
      isModalVisible: false,
      isModalConfirm: false,
      currentCatId: -1,
      createMode: false,
      modifyMode: false,
      deleteMode: false,
      currentPrt: []
    }
  },
  created() {
    // 추후 부모 컴포넌트로 공통화 할 예정 - 2021.07.05
    if (this.isLogin) {
      if (!this.userInfo.E_MAIL) {
        this.funcOpenModal('로그인을 해주세요.', false)
      } else if (!this.userInfo.STORE_ID) {
        this.funcOpenModal('가게가 존재하지 않습니다.', false)
      } else {
        this.myStoreId = this.userInfo.STORE_ID
        this.funcInitMyProduct()
      }
    } else {
      this.funcOpenModal('로그인을 해주세요.', false)
    }
  },
  mounted() {
    import('~/assets/js/jquery-ui.js').then(m => {
    })
  },
  methods: {

    ...mapActions(TEMP.STORE_PATH.PRODUCT, [
      'FETCH_PRODUCT_LIST',
      'FETCH_PRODUCT_CATEGORY_LIST',
      'FETCH_PRODUCT_CATEGORY_LIST2',
      'DELETE_PRODUCT_INFO'
    ]),
    ...mapActions(TEMP.STORE_PATH.OPTION, [
      'ACT_PRT_OPT'
    ]),
    ...mapMutations(TEMP.STORE_PATH.PRODUCT, [
      'SET_PRT_LIST',
      'SET_PRT_INFO',
      'SET_PRT_CLEAR'
    ]),
    // [START] 버튼 이벤트 모음
    /* 상품 카테고리 버튼 클릭 */
    async checkCategoryMenu(categoryId) {
      this.currentCatId = categoryId
      await this.funcSetPageLimit()
    },
    /* 상품 카테고리 편집 팝업 */
    openCatEditPopup() {
      this.popVisible = true
    },
    /* 상품 카테고리 이동 팝업 */
    openCatMovePopup() {
      this.popMoveVisible = true
    },
    /* 상품 리스트 전체 체크 */
    allCheckList() {
      this.dataList.forEach((value, index) => {
        this.all ? (value.check = true) : (value.check = false)
      })
    },
    /* 상품 리스트 체크 */
    checkChangeList(index) {
      this.all = true
      this.dataList.forEach((value, index) => {
        if (value.check === false) {
          this.all = false
        }
      })
    },
    /* 상품 상세 조회 */
    modifyProduct(product_info) {
      this.SET_PRT_INFO(product_info.PRT_ID)
      this.$emit('updateSelectedMenu', CONST.CREATE_PRODUCT_BUTTON_ID)
    },
    async deleteProductMenu() {
      /* 리스트 선택 확인 */
      const chkPrt = this.dataList.find(prtInfo => prtInfo.check === true)
      if (chkPrt === undefined) {

        this.funcOpenModal('선택된 상품이 없습니다.', false)
        return
      }
      /* 삭제모드 변경 */
      this.deleteMode = true
      this.funcOpenModal('선택한 상품 정보를 삭제하시겠습니까?', true)

    },
    /* 상품 추가 */
    updateSelectedMenu() {
      this.$emit('updateSelectedMenu', CONST.CREATE_PRODUCT_BUTTON_ID)
    },
    /* Page 이동 */
    async movePage(page) {
      this.currentPage = page
      let response
      if (this.currentCatId === -1) {
        response = await this.funcGetPrtListPage()
      } else {
        response = await this.funcGetCatPrtListPage()
      }
      if (response.status === 200) {
        this.dataList = response.data
        this.dataList.forEach(async (value, index) => {
          value.check = false
          //PRT ID를 가지고 option 목록 조회
          let optionData = await this.ACT_PRT_OPT(value.PRT_ID)
          this.dataList[index].options = optionData
        })
        //상품 내 옵션목록 추출 후 Store에 저장
        this.SET_PRT_LIST(this.dataList)
      }
    },
    /* 모달 창 취소 버튼 */
    onModalCancel() {
      this.isModalVisible = false
    },
    /* 모달 창 확인 버튼 */
    onModalConfirm() {
      if (this.isLogin) {
        /* 삭제 */
        if (this.deleteMode) {
          this.funcDeleteProduct()
        } else if (!this.userInfo.USER_ID) {
          /* 사용자ID 없는 경우 LOGIN화면이동 */
          this.$router.push('/login')
        } else if (!this.userInfo.STORE_ID) {
          /* 가게정보가 없는 경우 가게화면이동 */
          this.$router.push('/store')
        }
      } else {
        // 사용자정보 없는 경우 로그인화면이동
        this.$router.push('/login')
      }
      this.isModalVisible = false
    },
    // [END] 버튼 이벤트 모음

    /* 가게ID 로 상품 10건 조회 */
    async funcGetPrtList() {
      return await ProductApiService.getAll(this.myStoreId)
    },
    /* 가게ID + 카테고리ID 로 상품 10건 조회 */
    async funcGetCatPrtList() {
      return await ProductApiService.getByCategory(
        this.myStoreId,
        this.currentCatId
      )
    },
    /* 가게ID 로 상품 전체 조회 COUNT */
    async funcGetPrtListCnt() {
      return await ProductApiService.count(this.myStoreId)
    },
    /* 가게ID + 카테고리ID 로 상품 전체 조회 COUNT */
    async funcGetCatPrtListCnt() {
      return await ProductApiService.countByCategory(
        this.myStoreId,
        this.currentCatId
      )
    },
    /* 가게ID 로 상품 OFFSET 조회 */
    async funcGetPrtListPage() {
      return await ProductApiService.getAll(
        this.myStoreId,
        this.listNum,
        this.currentPage - 1
      )
    },
    /* 가게ID + 카테고리ID 로 상품 OFFSET 조회 */
    async funcGetCatPrtListPage() {
      return await ProductApiService.getByCategory(
        this.myStoreId,
        this.currentCatId,
        this.listNum,
        this.currentPage - 1
      )
    },
    /* 리스트 조회 */
    async funcReloadList() {
      await this.funcSetPageLimit()
    },
    /* 초기값 설정 */
    funcInitMyProduct() {
      /* 카테고리 셋팅 */
      this.funcGetPcategory()
      /* 상품 셋팅 */
      this.funcGetProduct()
      /* 페이지 설정 */
      this.funcSetPage()
      /* 선택 상품 초기화 */
      this.SET_PRT_CLEAR()
    },
    /* 매장 내 상품카테고리들을 Store 변수(catList)에 저장 */
    // 상품카테고리 '전체' 미포함 설정
    funcGetPcategory() {
      this.FETCH_PRODUCT_CATEGORY_LIST(this.myStoreId)
      this.FETCH_PRODUCT_CATEGORY_LIST2(this.myStoreId)
    },
    /* 매장 내 상품목록들을 Store 변수(prtList)에 저장 */
    async funcGetProduct() {
      const response = await this.FETCH_PRODUCT_LIST(this.myStoreId)
      if (response.status === 200) {
        this.dataList = response.data
        this.dataList.forEach(async (value, index) => {
          value.check = false
          //PRT ID를 가지고 option 목록 조회
          let optionData = await this.ACT_PRT_OPT(value.PRT_ID)
          this.dataList[index].options = optionData
        })
        //상품 내 옵션목록 추출 후 Store에 저장
        this.SET_PRT_LIST(this.dataList)
      }
    },
    /* 모달창을 설정하고 여는 메소드 */
    funcOpenModal(modalText, isConfirm) {
      this.modalText = modalText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    /* 페이지 설정정 */
    async funcSetPage() {
      const res = await this.funcGetPrtListCnt()

      let listLeng = res.data.count,
        listSize = this.listNum
      let page = Math.floor(listLeng / listSize)
      if (listLeng % listSize > 0) page += 1
      this.pageLimit = page
    },
    /* 페이지 수량 확인 */
    async funcSetPageLimit() {
      let res1, res2
      if (this.currentCatId === -1) {
        res1 = await this.funcGetPrtListCnt()
        res2 = await this.funcGetPrtList()
      } else {
        res1 = await this.funcGetCatPrtListCnt()
        res2 = await this.funcGetCatPrtList()
      }

      if (res2.status === 200) {
        this.dataList = res2.data
        this.dataList.forEach(async (value, index) => {
          value.check = false
          //PRT ID를 가지고 option 목록 조회
          let optionData = await this.ACT_PRT_OPT(value.PRT_ID)
          this.dataList[index].options = optionData
        })
        //상품 내 옵션목록 추출 후 Store에 저장
        this.SET_PRT_LIST(this.dataList)
        let listLeng = res1.data.count,
          listSize = this.listNum
        let page = Math.floor(listLeng / listSize)
        if (listLeng % listSize > 0) page += 1
        this.pageLimit = page
      } else {
        this.dataList = []
        this.pageLimit = 0
      }
    },
    /* 상품 삭제 */
    async funcDeleteProduct() {
      /* 삭제모드 초기화 */
      this.deleteMode = false
      let status
      for (const item of this.dataList) {
        if (item.check === true) {
          const response = await this.DELETE_PRODUCT_INFO(item.PRT_ID)
          status = response.status
          if (status !== 204) {
            break
          }
        }
      }

      if (status === 204) {
        await this.funcReloadList()
        this.funcOpenModal('선택한 상품을 삭제하였습니다.', false)
      } else {
        this.funcOpenModal('선택한 상품에 대하여 삭제작업 진행중에 문제가 발생하였습니다.', false)
      }
    }
  }
}
</script>
