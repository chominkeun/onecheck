<template>
    <div class="inp-number" data-evt="inp-number">
        <VBtn type="button" class="btn down" title="감소" @click="inpDown" />
        <span class="number">
            <input type="number" v-model="inpNum" @input="$emit('input', inpNum)">
        </span>
        <VBtn type="button" class="btn up" title="증가" @click="inpUp" />
    </div>
</template>

<script>
export default {
  props: {
    value:{
      type:[String, Number],
      default:false
    },
    max:{
      type:[String, Number],
      default:false
    },
    min:{
      type:[String, Number],
      default:false
    },
  },
  data() {
    return {
        inpNum: this.value,
        inpNumMax: this.max,
        inpNumMin: this.min
    }
  },

  created() {

  },
  methods: {
        inpDown(){
            //if(this.inpNum <= 0) return
            if(this.inpNum <= this.inpNumMin) return
            this.inpNum -= 1;
            this.$emit('input', this.inpNum)
        },
        inpUp(){
            if(this.inpNum >= this.inpNumMax) return
            this.inpNum += 1;
            this.$emit('input', this.inpNum)
        },
  }

}
</script>