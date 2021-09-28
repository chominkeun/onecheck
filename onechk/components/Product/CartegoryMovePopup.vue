<template>
  <div>
    <v-popup :is-open='popMoveVisible' @close='closePopup'>
      <template slot='header'>
        <p class='pop-tit'>카테고리 이동</p>
      </template>

      <template slot='body'>
        <ul class='cate-list'>
          <li
            class='list-group-item'
            v-for='(category) in catList2'
            :key='category.CATEGORY_ID'
          >
            <div class='cate'>
              <i class='line'></i>
              <span class='txt'>{{ category.CATEGORY_NAME }}</span>
              <VBtn @click='moveProductCategoryInfo(category.CATEGORY_ID)'>이동</VBtn>
            </div>
          </li>
        </ul>
      </template>
    </v-popup>

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
import { mapState, mapActions } from 'vuex'
import VModal from '../common/VModal.vue'
import VPopup from '../common/VPopup'

export default {
  components: {
    VPopup,
    VModal
  },
  computed: {
    ...mapState('user/user', ['userInfo']),
    ...mapState('product/product', ['catList2'])
  },
  data() {
    return {
      modalText: '',
      isModalConfirm: false,
      isModalVisible: false
    }
  },
  props: {
    popMoveVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('product/product', [
      'FETCH_MOVE_PRODUCT_CATEGORY_INFO'
    ]),
    // [START] 버튼 이벤트
    /* 상품 카테고리 이동 팝업 종료 */
    closePopup() {
      this.$emit('update:popMoveVisible', false)
    },
    /* 모달 창 취소  */
    onModalCancel() {
      this.isModalVisible = false
    },
    /* 모달 창 확인  */
    onModalConfirm() {
      this.isModalVisible = false
    },
    /* 상품 카테고리 이동 버튼 */
    async moveProductCategoryInfo(categoryId) {
      let product_data
      let status

      const chkPrt = this.$parent.dataList.find(prtInfo => prtInfo.check === true)
      if (chkPrt === undefined) {
        this.funcOpenModal('카테고리 이동할 상품을 선택해 주세요.', false)
        return
      }

      for (const item of this.$parent.dataList) {
        if (item.check === true) {
          product_data = {
            PRT_ID: item.PRT_ID,
            CATEGORY_ID: categoryId
          }
          const res = await this.FETCH_MOVE_PRODUCT_CATEGORY_INFO(product_data)
          status = res.status
          if (status !== 201) {
            break
          }
        }
      }
      if (status === 201) {
        this.$parent.funcReloadList()
        this.funcOpenModal('상품의 카테고리를 변경하였습니다.', false)
      } else {
        this.$parent.funcReloadList()
        this.funcOpenModal('상품의 카테고리 변경이 실패하였습니다.', false)
      }
    },
    /* 모달 창 열기 */
    funcOpenModal(headerText, isConfirm) {
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    }
  }
}
</script>

<style></style>
