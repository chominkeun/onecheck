<template>
  <div class="first" ref="floors">
    <div class="first-top2">
      <div class="floors-container">
        <ul class="floors-wrapper">
          <li class="floor-list">
            <VBtn name="outFloor" @click="changeOutFloor()">
              <p class="tit">실외도</p>
            </VBtn>
          </li>
        </ul>
      </div>
    </div>
    <div class="first-top">실내도</div>
    <div class="floors-container">
      <ul class="floors-wrapper">
        <li class="floor-list" v-for="floor in floorInfo" :key="floor.FLOOR_ID">
          <VBtn :id="floor.FLOOR_ID" @click="changeFloor(floor)">
            <p class="tit" v-if="floor.IS_GROUND === 'Y'">
              {{ floor.FLOOR_NO }}F
            </p>
            <p class="tit" v-else>B{{ floor.FLOOR_NO }}</p>
          </VBtn>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TEMP from '../../assets/TempData'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    map: {
      type: Object,
      default: {},
    },
    url: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    imgChk: {
      type: Boolean,
      default: false,
    },
    currentFloor: {
      type: Object,
      dafault: {},
    },
  },

  computed: {
    ...mapState(TEMP.STORE_PATH.ATTACH, ['attachInfo']),
    ...mapState(TEMP.STORE_PATH.STORE, ['storeInfo']),
    ...mapState(TEMP.STORE_PATH.SENSOR, ['floorInfo', 'divideInfo']),
    ...mapState(TEMP.STORE_PATH.BUILDING, ['buildingInfo']),
  },
  data() {
    return {}
  },
  created() {
    this.initFloor()
  },
  methods: {
    ...mapActions(TEMP.STORE_PATH.ATTACH, ['FETCH_ATTACH_INFO']),
    ...mapActions(TEMP.STORE_PATH.SENSOR, [
      'FETCH_FLOOR_INFO',
      'FETCH_SENSOR_INFO',
    ]),
    async initFloor() {
      //Floor 초기 셋팅
      const infos =
        this.divideInfo.TARGET_DV_CD === 'STORE'
          ? this.storeInfo
          : this.buildingInfo

      await this.FETCH_FLOOR_INFO(infos)
      await this.loadFloor1F()
    },

    /* 실내도 초기 값 셋팅(1층 정보) */
    async loadFloor1F() {
      // 1층 정보
      const f1 = this.floorInfo.filter(
        (data) => data.FLOOR_NO === 1 && data.IS_GROUND === 'Y'
      )
      const currentFloor = f1[0]
      this.$emit('update:currentFloor', currentFloor)

      // 1층 클래스 변경
      document.getElementById(currentFloor.FLOOR_ID).className = 'on'
      // 센서 정보 FETCH
      await this.FETCH_SENSOR_INFO(currentFloor.FLOOR_ID)

      // 맵 정보 설정
      const floorImg = { attachId: this.currentFloor.ATTACH_ID }

      if (!floorImg.attachId) {
        this.$emit('update:url', require('~/assets/images/temp/add_img.png'))
        this.map.setView([750, 750], -2)
        this.map.dragging.disable()
        this.map.scrollWheelZoom.disable()
        this.map.doubleClickZoom.disable()
        // this.$refs.map.mapObject.contextmenu.removeHooks()
      } else {
        await this.FETCH_ATTACH_INFO(floorImg)
        const ImgSrc = this.attachInfo.IMG_SRC
        this.$emit('update:imgSrc', ImgSrc)
        this.$emit('update:url', ImgSrc)
        this.map.dragging.enable()
        this.map.scrollWheelZoom.enable()
        this.map.contextmenu.addHooks()
        this.$emit('update:imgChk', false)
        this.$emit('loadSensors', 0)
        this.$emit('loadHumanIcon', 1, 1)
      }
    },

    /* 실내도 층수 변경 */
    async changeFloor(floor) {
      this.changeFloorClass(floor.FLOOR_ID)
      this.$emit('update:currentFloor', floor)
      this.$emit('changeFloor', floor)
    },

    /* 실외도 */
    changeOutFloor() {
      this.$parent.changeOutFloor()
    },

    /* Floor Display 버튼 클래스 변경 */
    changeFloorClass(floorId) {
      if (this.currentFloor !== null) {
        if (floorId !== this.currentFloor.FLOOR_ID) {
          document.getElementById(floorId).className = 'on'
          document.getElementById(this.currentFloor.FLOOR_ID).className = null
        }
      } else {
        document.getElementById(floorId).className = 'on'
      }
      const name = document.getElementsByName('outFloor')[0].className
      if (name === 'on') {
        document.getElementsByName('outFloor')[0].className = null
      }
    },
  },
}
</script>
