<template>
  <div v-if="isOpen" :width="popWidth" class="layerpopup">
    <div class="dim"></div>
    <div class="pop-wrap">
      <div class="popup" :style="'width:' + popWidth + 'px'">
        <VBtn class="close" @click="onClose"
          ><i class="ico ico-close"></i
        ></VBtn>
        <div class="pop-header">
          <slot name="header" />
        </div>
        <div class="pop-body">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VPopup',
  head() {
    return {
      bodyAttrs: {
        style: this.isOpen ? 'overflow:hidden' : '',
      },
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    popWidth: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {}
  },

  methods: {
    onClose() {
      this.$emit('close')
    },
  },
}
</script>
