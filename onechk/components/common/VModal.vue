<template>
  <transition>
    <div class="vmodal">
      <div class="vmodal-wrapper">
        <div class="vmodal-container">
          <h3 class="vmodal-header">{{ headerText }}</h3>
          <span class="vmodal-body">{{ text }}</span>
          <div class="vmodal-buttons">
            <Button class="vmodal-cancelbtn" v-if="isConfirm" @click="onCancel"
              >취소</Button
            >
            <Button class="vmodal-confirmbtn" @click="onConfirm">확인</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    headerText() {
      if (this.isConfirm) return '확인'
      else return '알림'
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    isConfirm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onConfirm() {
      this.$emit('onConfirm')
    },
    onCancel() {
      this.$emit('onCancel')
    }
  }
}
</script>
