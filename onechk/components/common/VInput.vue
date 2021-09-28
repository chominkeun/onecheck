<template>
  <textarea
    v-if="type === 'textarea'"
    :type="type"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    :minlength="minlength"
    @input="onInput"
  ></textarea>
  <input
    v-else
    :type="type"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    :minlength="minlength"
    @input="onInput"
    @blur="checkblur"
    @focus="onFocus"
    @keyup="onKeyup"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: ''
    },
    minlength: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
  },
  data() {
    return {}
  },
  methods: {
    onInput(e) {
      let value = e.target.value
      if (this.maxlength !== '' && value.length > this.maxlength) {
        value = value.slice(0, this.maxlength)
      }
      this.$emit('input', value)
    },
    checkblur(e) {
      this.$emit('blur', e)
    },
    onFocus() {
      this.$emit('focus')
    },
    onKeyup(e){
      this.$emit('keyup', e)
    }
  }
}
</script>
