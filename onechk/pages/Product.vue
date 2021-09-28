<template>
  <div>
    <div class='cont-box'>
      <h2 class='title-type1'>상품</h2>
      <menu-bar
        :menuBarItems='menuBarItems'
        @update='updateSelectedMenu'
      ></menu-bar>
      <my-product
        v-if='selectedMenu == menuBarItems[0].id'
        :deletemode='deleteMode'
        @updateSelectedMenu='updateSelectedMenu'
        @ModalOpen='reqChildModalOpen'
      />
      <option-manage
        v-else-if='selectedMenu == menuBarItems[1].id'
        @ModalOpen='reqChildModalOpen'
      ></option-manage>
      <create-product
        v-else-if="selectedMenu == '4'"
        @updateSelectedMenu='updateSelectedMenu'
      />
      <blank v-else></blank>
    </div>

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
import MyProduct from '../components/Product/MyProduct.vue'
import CONST from '../constants/Product'
import CreateProduct from '../components/Product/CreateProduct.vue'
import { mapState } from 'vuex'
import Blank from '../components/common/Blank.vue'
import OptionManage from '../components/Product/OptionManage.vue'
import VModal from '../components/common/VModal'

export default {
  components: {
    MyProduct,
    CreateProduct,
    Blank,
    OptionManage,
    VModal
  },
  computed: {
    ...mapState('user/user', [
      'userInfo',
      'isLogin'
    ])
  },
  created() {
    //로그인 체크
    if (!this.isLogin) {
      this.openModal('로그인을 해주세요', false)
      return
    }
    //스토어 유무 체크
    const hasStore = this.storeCheck()
    if (!hasStore) return

    this.funcInitProduct()
  },

  data() {
    return {
      menuBarItems: CONST.MENUBAR_ITEMS,
      selectedMenu: '',
      isModalVisible: false,
      isModalConfirm: false,
      modalText: '',
      deleteMode: false,
      isreqChildModalVis: false
    }
  },
  methods: {
    // [START] 버튼 이벤트 모음
    updateSelectedMenu(id) {
      this.selectedMenu = id
    },
    // 자식컴포넌트에서 모달찰 Open 요청
    reqChildModalOpen(modalText, isconfirm) {
      this.isreqChildModalVis = true
      this.openModal(modalText, isconfirm)
    },
    // 모달 취소 버튼 화면
    onModalCancel() {
      this.isModalVisible = false
    },
    // 모달창에서 확인버튼을 눌렀을때 실행되는 메소드
    onModalConfirm() {

      if (this.deleteMode) {

      } else if (!this.userInfo || !this.userInfo.E_MAIL) {
        // 사용자ID 없는 경우 LOGIN화면이동
        this.$router.push('/login')
      } else if (!this.userInfo.STORE_ID) {
        // 가게정보가 없는 경우 가게화면이동
        this.$router.push('/store')
      } else {
        // 자식 컴포넌트에서 호출하지 않을 경우
        if (!this.isreqChildModalVis) {
          // 사용자정보 없는 경우 로그인화면이동
          this.$router.push('/login')
        }
      }
      this.isModalVisible = false
      if (this.isreqChildModalVis) {
        this.isreqChildModalVis = false
      }
    },
    // [END] 버튼 이벤트 모음

    // CREATE 호출
    funcInitProduct() {
      this.selectedMenu = this.menuBarItems[0].id
    },
    // 모달 알림 메세지 Open
    openModal(modalText, isConfirm) {
      this.modalText = modalText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    // 가게정보 확인
    storeCheck() {
      let hasStore = true
      if (!this.userInfo.STORE_ID) {
        this.openModal('가게가 존재하지 않습니다.', false)
        hasStore = false
      }
      return hasStore
    }
  }
}
</script>
