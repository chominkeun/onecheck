<template>
  <v-popup :is-open="movePop" :pop-width="400" @close="closePopup">
    <template slot="header">
      <p class="pop-tit noline">테이블 이동</p>
    </template>
    <template slot="body">
      <template v-if="isTableMoveAvailable">
        <div class="alertbox">
          빈테이블을 선택해주세요
        </div>
        <div class="btn-wrap">
          <VBtn class="btn-type3 st7" @click="moveCancel">취소</VBtn>
        </div>
      </template>
      <template v-else>
        <div class="alertbox">
          Table {{ selectedTable[0] + 1 }}에서 Table
          {{ selectedTable[1] + 1 }}로 이동합니다.
        </div>
        <div class="btn-wrap">
          <VBtn class="btn-type3 st7" @click="moveCancel">취소</VBtn>
          <VBtn class="btn-type3 st1" @click="moveComplete">확인</VBtn>
        </div>
      </template>
    </template>
  </v-popup>
</template>

<script>
export default {
  props: {
    isTableMoveAvailable: {
      type: Boolean,
      default: false
    },
    movePop: {
      type: Boolean,
      default: false
    },
    selectedTable: {
      type: Array
    }
  },
  methods: {
    closePopup() {
      this.$emit('update:movePop')
      this.moveCancel()
    },
    moveCancel() {
      this.$emit('cancel')
    },
    moveComplete() {
      this.$emit('complete')
    }
  }
}
</script>

<style></style>
