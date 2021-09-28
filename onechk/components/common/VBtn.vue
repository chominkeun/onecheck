<template>
  <nuxt-link v-if="type === 'nlink'" :to="to" :target="target">
    <slot></slot>
  </nuxt-link>

  <a v-else-if="type === 'link'" :href="href" :target="target"
   @click="handleEvent"
   @mouseover="handleEvent"
   @mouseout="handleEvent"
   @focus="handleEvent"
   @blur="handleEvent"
   >
    <slot></slot>
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled"
    @click="handleEvent"
    @mouseover="handleEvent"
    @mouseout="handleEvent"
    @focus="handleEvent"
    @blur="handleEvent"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'VBtn',
  props: {
    to: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '/',
    },
    target: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: [Boolean, String],
      default: false,
    },
    iconClass: {
      type: [Array, String],
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {}
  },

  methods: {
    handleEvent(e) {
      if (this.type === 'submit') {
        e.preventDefault()
      }
      if(e.type === 'click'){
        this.$emit('click', e)
      }else if(e.type === 'focus'){
        this.$emit('focus', e)
      }else if(e.type === 'mouseover'){
        this.$emit('mouseover', e)
      }else if(e.type === 'mouseout'){
        this.$emit('mouseout', e)
      }else if(e.type === 'blur'){
        this.$emit('blur', e)
      }
    },
  },
}
</script>
