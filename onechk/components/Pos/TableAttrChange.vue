<template>
  <div style="padding:25px 0px 25px 0px">
    <p class="layer-tit">테이블 편집</p>
    <div class="attr">
      <span>테이블 이름</span>
      <VInput
        type="text"
        :value="table.title"
        @input="handleTitle"
        :disabled="!table.isActive"
        style="width:auto;"
      />
    </div>
    <div class="attr">
      <span>수용 인원</span>
      <VInput
        type="text"
        :value="table.t_count"
        @input="handleCount"
        :disabled="!table.isActive"
        style="width:auto;"
      />
    </div>
    <div class="align-r" style="padding:5px 0px 0px 0px">
      <VBtn class="btn-type6 st4" @click="editComplete">편집 완료</VBtn>
    </div>
  </div>
</template>

<script>
import CONST from '../../constants/Pos'
export default {
  props: {
    table: {
      type: Object,
      default: CONST.DEFAULT_TABLE_ATTR
    }
  },
  data() {
    return {
      title: '',
      t_count: ''
    }
  },
  methods: {
    editComplete() {
      //편집 완료버튼
      const title = this.title == '' ? this.table.title : this.title
      const t_count = this.t_count == '' ? this.table.t_count : this.t_count
      const newTable = {
        title,
        t_count
      }
      this.$emit('change', newTable)
      this.resetDatas()
    },
    handleTitle(value) {
      this.title = value
    },
    handleCount(value) {
      this.t_count = parseInt(value)
    },
    resetDatas() {
      this.title = ''
      this.t_count = ''
    }
  }
}
</script>

<style></style>
