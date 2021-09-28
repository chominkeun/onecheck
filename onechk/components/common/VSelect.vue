<template>
  <select 
    :value="value"
    :name="name" 
    :disabled="disabled"     
    @input="onInput"
    >
    <option
    v-for="(item, index) in data" 
    :key="index" 
    :value="item.value"
    >{{item.label}}</option>
  </select>
</template>

<script>
export default {
  props: {
    name:{
      type:String,
      default:''
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
    },
  },

}
</script>
