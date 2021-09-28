<template>
  <label
    :class="['inp-chk', disabled ? 'disabled': '']"
  >
      <input type="checkbox"
        :name="name"
        :disabled="disabled"
         v-model="isChecked"
        @change="onChange"
      >
      <span class="ic"></span>
      <span class="t"><slot /></span>
	</label>
</template>

<script>
export default {
  props: {
    name:{
      type:String,
      default:''
    },
    value:{
      type:Boolean,
      default:false
    },
    checked: {
      type:Boolean,
      default:false      
    },
    disabled:{
      type:Boolean,
      default:false
    },
  },
  data() {
    return {
      isAllcheck:false,
      // checked: this.value,
      isChecked: null,
    }
  },
  watch: {
    checked(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.isChecked =
          typeof this.checked === 'boolean' ? newValue : newValue !== '' && newValue !== undefined && newValue !== null
      }
    }
  },
  created() {
      const checked =
        typeof this.checked === 'boolean'
          ? this.checked
          : this.checked !== '' && this.checked !== undefined && this.checked !== null
      if (this.isChecked !== checked) {
        this.isChecked = checked
        this.onChange()
      }
  },  
  methods: {
    onChange(e) {
        this.$emit('update:checked', this.isChecked)
        this.$emit('change', this.isChecked)      
    },
  }

}
</script>