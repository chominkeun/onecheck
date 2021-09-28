<template>
  <label :class="['inp-radio', disabled ? 'disabled' : '']">
    <input
      type="radio"
      :checked="checked"
      :name="name"
      :id="id"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="ic"></span>
    <span class="t"><slot /></span>
  </label>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    id: {
      type: [String, Number],
      default: 0,
    },
    value: {
      type: [String, Number],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    checked() {
      return this.id === parseInt(this.value)
    },
  },

  methods: {
    onChange(e) {
      console.log(e.target.value)
      this.$emit('input', e.target.id)
      this.$emit('change', e.target.id)
    },
  },
}
</script>