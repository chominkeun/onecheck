<template>
  <div class="cont-box">
    <div class='data-type2'>
      <div class='btn-box align-r'>

        <loading-bar>
        </loading-bar>
        <VBtn class='btn-type2 st5' @click='start'
        >start
        </VBtn>
      </div>

    </div>
  </div>
</template>

<script>
import LoadingBar from '../components/common/LoadingBar'


export default {
  components: {
    LoadingBar
  },
  data() {
    return {
    }
  },
  methods: {
    start() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        setTimeout(() => this.$nuxt.$loading.finish(), 4000)
      })
    }
  }
}


</script>
