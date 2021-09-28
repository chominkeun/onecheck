<template>
  <div class="pagination">
    <VBtn
      class="prev"
      @click="movePrevPage"
      :disabled="!isPrevButtonEnable"
    ></VBtn>
    <span class="page">
      <VBtn
        v-for="page in activePages"
        :key="page"
        :class="{ on: currentPage == page }"
        @click="movePage(page)"
        ><span>{{ page }}</span></VBtn
      >
    </span>
    <VBtn
      class="next"
      :disabled="!isNextButtonEnable"
      @click="moveNextPage"
    ></VBtn>
  </div>
</template>
<script>
export default {
  computed: {
    isPrevButtonEnable() {
      return this.currentPage > 1
    },
    isNextButtonEnable() {
      return this.currentPage < this.pageLimit
    },
    activePages() {
      return this.pages.filter(v => v <= this.pageLimit)
    }
  },
  created() {
    this.initPages()
  },
  props: {
    rangeSize: {
      type: Number,
      default: 0
    },
    pageLimit: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pages: [],
      currentPage: 1
    }
  },
  methods: {
    initPages() {
      for (let i = 0; i < this.rangeSize; i++) {
        this.pages.push(i + 1)
      }
    },
    movePage(page) {
      this.currentPage = page
      this.$emit('movePage', page)
    },
    increasePages() {
      this.pages = this.pages.map(v => v + this.rangeSize)
    },
    decreasePages() {
      this.pages = this.pages.map(v => v - this.rangeSize)
    },
    movePrevPage() {
      if (this.isPrevButtonEnable) {
        if (this.currentPage % this.rangeSize == 1) {
          this.decreasePages()
        }
        this.movePage(this.currentPage - 1)
      }
    },
    moveNextPage() {
      if (this.isNextButtonEnable) {
        if (this.currentPage % this.rangeSize == 0) {
          this.increasePages()
        }
        this.movePage(this.currentPage + 1)
      }
    }
  }
}
</script>
