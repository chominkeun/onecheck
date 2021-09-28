<template>
  <v-popup :is-open='popVisible' @close='closePopup'>
    <template slot='header'>
      <p class='pop-tit'>카테고리 편집</p>
    </template>
    <template slot='body'>
      <VInput type='text' v-model='newName' placeholder='새 카테고리' />
      <VBtn @click='createProductCategoryInfo' class='btn-type6 st5'>추가</VBtn>
      <ul class='cate-list'>
        <li
          class='list-group-item'
          v-for='(category, index) in catList'
          :key='category.CATEGORY_ID'
        >
          <!-- 카테고리 편집 여부에 따라 구성요소 구분 -->
          <!-- 1. 편집중 O -->
          <div v-if='category.CATEGORY_ID == -1'></div>
          <div v-else-if='index == updateIndex' class='cate'>
            <VInput v-model='updateName' />
            <VBtn @click='updateProductCategoryInfo(category)'>적용</VBtn>
            <VBtn @click='cancelUpdate'>취소</VBtn>
          </div>
          <!-- 2. 편집중 X -->
          <div v-else class='cate'>
            <span class='txt'>{{ category.CATEGORY_NAME }}</span>
            <VBtn @click='openUpdate(category.CATEGORY_NAME, index)'
            ><i class='ico i-pen'></i
            ></VBtn>
            <VBtn @click='deleteProductCategoryInfo(category)'
            ><i class='ico i-del'></i
            ></VBtn>
          </div>
        </li>
      </ul>
      <p :class="catEditMsg.isSuccess ? 'err-msg-black' : 'err-msg'">
        {{ catEditMsg.msgText }}
      </p>
    </template>
  </v-popup>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user/user', ['userInfo']),
    ...mapState('product/product', ['catList', 'catEditMsg'])
  },
  data() {
    return {
      newName: '',
      updateName: '',
      updateIndex: 0
    }
  },
  props: {
    popVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('product/product', [
      'FETCH_CREATE_PRODUCT_CATEGORY_INFO',
      'FETCH_UPDATE_PRODUCT_CATEGORY_INFO',
      'FETCH_DELETE_PRODUCT_CATEGORY_INFO'
    ]),
    // [START] 버튼 이벤트
    /* 상품 카테고리 등록 */
    createProductCategoryInfo() {
      const data = {
        CATEGORY_NAME: this.newName,
        NAME: this.userInfo.NAME
      }
      this.FETCH_CREATE_PRODUCT_CATEGORY_INFO(data)
      this.newName = ''
    },
    /* 상품 카테고리 수정 */
    updateProductCategoryInfo(category) {
      const data = {
        CATEGORY_ID: category.CATEGORY_ID,
        CATEGORY_NAME: category.CATEGORY_NAME,
        updateName: this.updateName
      }
      this.FETCH_UPDATE_PRODUCT_CATEGORY_INFO(data)
      this.resetUpdateDatas()
    },
    /* 취소 버튼 */
    cancelUpdate() {
      this.resetUpdateDatas()
    },
    /* 카테고리 명칭을 수정하도록 활성화하는 버튼 */
    openUpdate(categoryName, index) {
      this.updateName = categoryName
      this.updateIndex = index
    },
    /* 상품 카테고리 삭제 */
    deleteProductCategoryInfo(category) {
      this.FETCH_DELETE_PRODUCT_CATEGORY_INFO(category)
    },
    /* 리셋 */
    resetUpdateDatas() {
      this.updateName = ''
      this.updateIndex = 0
    },
    /* 상품 카테고리 편집 닫기 버튼  */
    closePopup() {
      this.$emit('update:popVisible', false)
      this.resetUpdateDatas()
    }
    // [END] 버튼 이벤트 모음
  }
}
</script>

<style></style>
