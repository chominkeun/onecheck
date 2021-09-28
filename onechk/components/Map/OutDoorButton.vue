<template>
  <div>
    <c-button
      :buttonsrc="'ico-boundary'"
      v-bind:clicked='isBoundMode'
      @click='viewSensorsBound'
      name='센서 범위'
    ></c-button>
    <c-button
      :buttonsrc="'ico-edit'"
      v-bind:clicked='isModifyMode'
      v-if='!isModifyMode'
      @click='editSensor'
      name='편집 시작'
    />
    <c-button
      :buttonsrc="'ico-edit'"
      v-bind:clicked='isModifyMode'
      v-else
      @click='saveSensor'
      name='편집 종료'
    />
    <c-button
      :buttonsrc="'ico-human'"
      @click='clearMap'
      name='초기화'
    ></c-button>
  </div>
</template>


<script>

import CButton from '../Interior/CategoryButton'


export default {
  components: {
    CButton
  },
  computed: {},
  created() {
    console.log('created ===>  ', this.$refs.map)
  },
  mounted() {
    console.log('mounted')
  },
  data() {
    return {}
  },
  props: {
    isBoundMode: {
      type: Boolean,
      default: false
    },
    isModifyMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /* Button Event List [Start] */
    /* 모든 센서 범위 확인 */
    viewSensorsBound() {
      console.log('자식 viewSensorsBound')
    },
    /* 센서 편집 */
    editSensor() {
      console.log('자식 editSensor')
    },
    /* 센서 편집모드 나가기 */
    saveSensor() {
      console.log('자식 saveSensor')
    },
    clearMap() {
      console.log('자식 clearMap')
    }
    /* Button Event List [End] */
  }
}

</script>
