<template>

  <div style="width:65px; margin:5px; float:left;">
    <div style="margin:5px">
    <button
      v-bind:class="{'cbtn': !clicked, 'click': clicked}"
      @click="handleEvent"
      @mouseover="handleEvent"
      @mouseout="handleEvent"
      @focus="handleEvent"
      @blur="handleEvent"
    >
     <img v-if='!clicked' :src="require('@/assets/images/' + buttonsrc + '.png')">
     <img v-if='clicked' :src="require('@/assets/images/' + buttonsrc + '-clicked.png')">
    </button>
    </div>
    <div style="margin-top:7px; text-align:center; font-size:13px">{{name}}</div>
  </div>
</template>

<script>

export default {
  props:['name', 'clicked','buttonsrc']
  ,
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

<style>
/* .cbtn {
  width:50px;
  height:50px;
  border-radius:50%;
  border:2px solid darkgrey;
  text-align: center;
  line-height: 200px;
  color:darkgrey;
} */
/* .click {
  width:50px;
  height:50px;
  border-radius:50%;
  border:2px solid black;
  text-align: center;
  line-height: 200px;
  color:black;
} */
</style>
