<template>
  <div class='modal'>
    <div class='overlay' @click="$emit('close-modal')"></div>
    <div class='modal-card'>
      <div class='first'>
        <div class='first-top2'>
          <div class='floors-container'>
            <ul class='floors-wrapper'>
              <li class='floor-list'>
                <VBtn name='outFloor' @click='changeOutFloor()'>
                  <p class='tit'>실외도</p>
                </VBtn>
              </li>
            </ul>
          </div>
        </div>
        <div class='first-top'>
          실내도
        </div>
        <div class='floors-container'>
          <ul class='floors-wrapper'>
            <li class='floor-list' v-for='floor in floorInfo'
                :key='floor.FLOOR_ID'>
              <VBtn :id='floor.FLOOR_ID' @click='changeFloor(floor)'>
                <p class='tit' v-if="floor.IS_GROUND === 'Y'">{{ floor.FLOOR_NO }}F</p>
                <p class='tit' v-else>B{{ floor.FLOOR_NO }}</p>
              </VBtn>
            </li>
          </ul>
        </div>
      </div>
      <div class='second'>
        <VInput
          type='text'
          style='width:70%; margin-left: 15px;margin-top: 10px;'
          :value='searchParam'
          @input='SET_SEARCH_PARAM'
          @keyup='enterkeySearch'
        />
        <img src='../../assets/images/ico-search.png' style='margin-left:10px' @click='searchStart'>
        <div v-if='searchClicked' style='overflow-y:auto; padding: 10px; height: 150px;'>
          <li v-for='(searchList) in slist'
              :key='searchList.SENSOR_ID'>
            <button class='searchResult' @click='onClickSearchResult(searchList)'>
              <div style='float:left; margin-right:10px; color: red'>
                <p v-if='outMode'>OutDoor</p>
                <p v-if="!outMode && searchList.IS_GROUND === 'Y'">{{ searchList.FLOOR_NO }}F</p>
                <p v-if="!outMode && searchList.IS_GROUND === 'N'">B{{ searchList.FLOOR_NO }}</p>
              </div>
              {{ searchList.SENSOR_NAME }}
            </button>
          </li>
          <!-- spinner : default, spiral, circles, bubbles, waveDots -->
          <infinite-loading :identifier='infiniteId' @infinite='infiniteHandler($event) ' ref='infiniteLoading'
                            spinner='waveDots'>
            <div slot='no-more'></div>
          </infinite-loading>
        </div>

        <div class='sensorInfo' v-if='sensorClick'>
          <div v-if='modifyMode && !addMode'>
            <p style='font-size:15px;'>
              센서 이름
              <VInput
                v-if='modifyMode'
                type='text'
                style='width:80%; margin-top:5px; margin-bottom:12px;'
                :value='currentSensor.SENSOR_NAME'
                @input='SET_CURRENT_SENSOR_NAME'
              >
              </VInput>
            </p>
            <p style='font-size:15px;'>
              센서 설명
              <VInput
                v-if='modifyMode'
                type='text'
                style='width:80%; margin-top:5px; margin-bottom:12px;'
                :value='currentSensor.SENSOR_DESC'
                @input='SET_CURRENT_SENSOR_DESC'
              >
              </VInput>
            </p>
            <p style='font-size:15px;'>
              센서 범위
              <VInput
                v-if='modifyMode'
                type='text'
                style='width:80%; margin-top:5px; margin-bottom:12px;'
                :value='currentSensor.BOUND'
                @input='changeSensorBound'
              >
              </VInput>
            </p>
            <li class='oneSensorEvent' v-for='(oneSen, index) in currentSensor.SENSOR_EVENT_LIST'
                :key='oneSen.SENSOR_EVENT_REL_ID'>
              <div v-if='oneSen.SENSOR_EVENT_REL_ID !== null' style='font-size:15px; margin-top:5px'>
                속성 {{ index + 1 }}
                <div v-if='!outMode' style='margin-top:5px'>
                  <select
                    :value='oneSen.SENSOR_EVENT_ID'
                    @change='opChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                    style='width:70%; margin-bottom:3px;'
                  >
                    <option v-for='(eList, index) in sensorEventList'
                            :key='index'
                            v-bind:value='eList.SENSOR_EVENT_ID'
                    >
                      {{ eList.SENSOR_EVENT_NAME }}
                    </option>
                  </select>
                  <button style='margin-left:5px' @click='deleteEvent(oneSen)'>
                    <img src='~/assets/images/ico-del.png'>
                  </button>
                </div>
                <div v-if='outMode' style='margin-top:5px;'>
                  <p style='margin-bottom:8px;'>
                    EVENT
                    <button style='margin-left:5px; margin-right:35px; float: right;' @click='deleteEvent(oneSen)'>
                      <img src='~/assets/images/ico-del.png'>
                    </button>
                  </p>
                </div>
                <div v-if='oneSen.SENSOR_EVENT_ID === 3'>
                  <div>
                    <select
                      :value='oneSen.EVENT_LIST_ID'
                      @change='eventChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                      style='width:70%'>
                      <option v-for='optionList in eventOption'
                              :key='optionList.EVENT_LIST_ID'
                              v-bind:value='optionList.EVENT_LIST_ID'
                      >
                        {{ optionList.EVENT_LIST_NAME }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </li>
            <button
              @click='addEvent(currentSensor)'
              style='margin-left:40%; margin-top:10px; margin-bottom:10px'
            >
              <img src='~/assets/images/ico-plus-circle.png'>
            </button>
            <div>
              <button v-if='modifyMode' class='delButton' @click='delSensor'>
                센서 삭제
              </button>
              <button v-if='modifyMode' class='saveButton' @click='editEvent'>
                변경사항 저장
              </button>
            </div>
          </div>
          <p v-if='!modifyMode' style='padding-bottom:5px'>
            센서 이름 : {{ currentSensor.SENSOR_NAME }}</p>
          <p v-if='!modifyMode' style='font-size:17px'>
            설명 : {{ currentSensor.SENSOR_DESC }}</p>
          <p v-if='!modifyMode' style='font-size:17px'>
            범위 : {{ currentSensor.BOUND }}</p>
          <li class='oneSensorEvent' v-for='(oneSen, index) in
          currentSensor.SENSOR_EVENT_LIST' :key='oneSen.SENSOR_EVENT_ID'>
            <p v-if='!modifyMode &&
            oneSen.SENSOR_EVENT_ID !== 3 &&
            oneSen.SENSOR_EVENT_ID !== null'
               style='font-size:17px'>속성{{ index + 1 }} :
              {{ oneSen.SENSOR_EVENT_NAME }}</p>
            <p v-if='!modifyMode && oneSen.SENSOR_EVENT_ID === 3'
               style='font-size:17px'>속성{{ index + 1 }} :
              {{ oneSen.SENSOR_EVENT_NAME }}
              - {{ oneSen.EVENT_LIST_NAME }}</p>
          </li>
        </div>
        <!-- 센서 추가 -->
        <div v-if='addMode' style='margin-left:10px'>
          <p style='font-size:15px; margin-top:5px'>
            센서 이름
            <VInput
              v-if='addMode'
              type='text'
              style='width:80%; margin-top:5px; margin-bottom:12px;'
              :value='currentSensor.SENSOR_NAME'
              @input='SET_CURRENT_SENSOR_NAME'
            >
            </VInput>
          </p>
          <p style='font-size:15px;'>
            센서 설명
            <VInput
              v-if='addMode'
              type='text'
              style='width:80%; margin-top:5px; margin-bottom:12px;'
              :value='currentSensor.SENSOR_DESC'
              @input='SET_CURRENT_SENSOR_DESC'
            >
            </VInput>
          </p>
          <p style='font-size:15px;'>
            센서 범위
            <VInput
              v-if='addMode'
              type='text'
              style='width:80%; margin-top:5px; margin-bottom:12px;'
              :value='currentSensor.BOUND'
              @input='SET_CURRENT_SENSOR_BOUND'
            >
            </VInput>
          </p>
          <li class='oneSensorEvent' v-for='(oneSen, index) in currentSensor.SENSOR_EVENT_LIST'
              :key='oneSen.SENSOR_EVENT_REL_ID'>
            <div style='font-size:15px; margin-top:5px'>
              속성 {{ index + 1 }}
              <div v-if='!outMode' style='margin-top:5px'>
                <select
                  :value='oneSen.SENSOR_EVENT_ID'
                  @change='opChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                  style='width:70%; margin-bottom:3px;'
                >
                  <option v-for='(eList, index) in sensorEventList'
                          :key='index'
                          v-bind:value='eList.SENSOR_EVENT_ID'
                  >
                    {{ eList.SENSOR_EVENT_NAME }}
                  </option>
                </select>
                <button style='margin-left:5px' @click='deleteEvent(oneSen)'>
                  <img src='~/assets/images/ico-del.png'>
                </button>
              </div>
              <div v-if='outMode' style='margin-top:5px;'>
                <p style='margin-bottom:8px;'>
                  EVENT
                  <button style='margin-left:5px; margin-right:35px; float: right;' @click='deleteEvent(oneSen)'>
                    <img src='~/assets/images/ico-del.png'>
                  </button>
                </p>
              </div>
              <div v-if='oneSen.SENSOR_EVENT_ID === 3'>
                <div>
                  <select
                    :value='oneSen.EVENT_LIST_ID'
                    @change='eventChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                    style='width:70%'>
                    <option v-for='optionList in eventOption'
                            :key='optionList.EVENT_LIST_ID'
                            v-bind:value='optionList.EVENT_LIST_ID'
                    >
                      {{ optionList.EVENT_LIST_NAME }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </li>
          <button
            @click='addEvent(currentSensor)'
            style='margin-left:40%; margin-top:10px; margin-bottom:10px'
          >
            <img src='~/assets/images/ico-plus-circle.png'>
          </button>
          <div>
            <button v-if='addMode' class='delButton' @click='delSensor'>
              취소
            </button>
            <button v-if='addMode' class='saveButton' @click='addNewSensor'>
              센서 추가
            </button>
          </div>
        </div>
        <div v-if='!imgChk' style='margin-top:30px'>
          <div v-if='!outMode'>
            <c-button :buttonsrc="'ico-all'" name='전체' v-bind:clicked='chkClick[0]' @click='[loadSensors(0), buttonClick(0)]'></c-button>
            <li class='sensor-event-list' v-for='eventList in sensorEventList'
                :key='eventList.SENSOR_EVENT_ID'>
              <c-button :buttonsrc="'ico-' + eventList.SENSOR_EVENT_NAME" v-bind:clicked='chkClick[eventList.SENSOR_EVENT_ID]' v-bind:name='eventList.SENSOR_EVENT_NAME'
                        @click='[loadSensors(eventList.SENSOR_EVENT_ID), buttonClick(eventList.SENSOR_EVENT_ID)]'></c-button>
            </li>
          </div>
          <c-button :buttonsrc="'ico-boundary'" v-bind:clicked='selectSensorEventVisible' @click='viewSensorsBound' name='센서 범위'></c-button>
          <c-button :buttonsrc="'ico-edit'" v-bind:clicked='modifyMode' v-if='!modifyMode' @click='editSensor' name='편집 모드' />
          <c-button :buttonsrc="'ico-edit'" v-bind:clicked='modifyMode' v-else @click='saveSensor' name='편집 모드 나가기' />
          <c-button :buttonsrc="'ico-human'" @click='setHumanDefault' name='사람 초기화'></c-button>
        </div>
        <div v-if='imgChk && !outMode' style='margin-top:30px; margin-left:20px'>실내도 이미지를 먼저 추가하세요</div>
        <div v-if='imgChk && outMode' style='margin-top:30px; margin-left:20px'>건물/가게 위치를 먼저 추가하세요</div>
      </div>
      <div class='third'>
        <input ref='imgFile' type='file' class='offscreen' @change='changeFile' />
        <l-map
          ref='map'
          :zoom.sync='zoom'
          :center='center'
          :options='mapOptions'
          :bounds='mapBounds'
          :min-zoom='minZoom'
          :max-zoom='maxZoom'
          style='height: 100%; width: 100%;'
          @ready='doSomethingOnReady()'
          :crs='crs'
        >

          <l-tile-layer
            :url='tileLayer.url'
          />

          <l-image-overlay
            :url='url'
            :bounds='bounds'
          />
          <l-control-zoom :position='zoomPosition' />
          <l-control v-if='!outMode'>
            <p v-if='imgChk' class='add-image' @click='fileOpen'>
              이미지 추가
            </p>
            <p v-else class='mod-image' @click='fileOpen'>
              이미지 편집
            </p>
          </l-control>
          <l-control class='example-custom-control'>
            <p @click="$emit('close-modal')">
              X
            </p>
          </l-control>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import { CRS, latLng, latLngBounds, Icon } from 'leaflet'
import {
  LMap,
  LImageOverlay,
  LMarker,
  LPopup,
  LTooltip,
  LControlLayers,
  LControlZoom,
  LControl,
  LTileLayer
} from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import CButton from './CategoryButton.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})


export default {
  components: {
    LMap,
    LImageOverlay,
    LMarker,
    LPopup,
    LTooltip,
    LControlLayers,
    LControlZoom,
    LControl,
    LTileLayer,
    CButton,
    InfiniteLoading
  },
  created() {
    this.initInteriorModal()

  },
  /* */
  mounted() {
    this.$refs.map.mapObject.setView([750, 750], -1)
    this.$refs.map.mapObject.on('click', this.onMapClick)
    this.$refs.map.mapObject.on('moveend', this.onMapMoveEnd)
  },
  destroyed() {
    //TODO:sensorList 값 초기화
    this.clearSearch()
    this.SET_SEARCH_PARAM_DEFAULT()
    this.SET_SELECT_SENSOR_EVENT_ID_DEFAULT()
    this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
    this.SET_CURRENT_SENSOR_DEFAULT()
  },
  computed: {
    tileLayer() {
      return this.tileLayers[this.tileLayerIndex]
    },
    ...mapState('attach/attach', [
      'attachInfo'
    ]),
    ...mapState('store/store', [
      'storeInfo'
    ]),
    ...mapState('building/building', [
      'buildingInfo'
    ]),
    ...mapState('sensor/sensor', [
      'sensorList', 'currentSensor', 'searchParam', 'searchResponse',
      'selectSensorEventId', 'selectSensorEventVisible', 'divideInfo',
      'floorInfo', 'newSensor'
    ]),
    ...mapState('sensor_event/sensor_event', [
      'sensorEventList',
      'eventOption'
    ]),
    ...mapGetters('sensor/sensor', [
      'GET_SELECT_SENSOR_EVENT'
    ])
  },
  data() {
    return {
      center: [750, 750],
      url: '',
      bounds: [[0, 0], [1500, 1500]],
      crs: CRS.Simple,
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: true,
        contextmenu: true,
        contextmenuWidth: 80,
        contextmenuItems: [{
          text: '센서 추가',
          callback: this.addSensor
        }]
      },
      mapBounds: latLngBounds(
        { lat: 0, lng: 0 },
        { lat: 1500, lng: 1500 }
      ),
      zoom: 0,
      minZoom: -3,
      maxZoom: 8,
      zoomPosition: 'topleft',
      showMap: true,
      map: null,
      imgChk: true,
      imgSrc: '',
      currentFloor: null,
      currentIndex: null,
      imgNull: null,
      sensors: [],    //센서
      layerGroup: '',   //센서 그룹
      layerBoundGroup: '',    //센서 영역 그룹
      layerBoundGroupInvisible: '',//0824추가
      layerChangeBoundGroup: '', // 센서 변경 시 사용
      modifyMode: false,
      sensorClick: false,
      clickSensorIndex: null,
      redIcon: null,
      blueIcon: null,
      oldIndex: null,
      tempRelId: 0,
      addMode: false,
      mySensorId: null,

      //infinite loading
      limit: 0,
      infiniteId: +new Date(),
      searchClicked: false,
      slist: [],
      humanIcon: null,

      //building or store info
      properInfo: null,

      //
      tileLayerIndex: 0,
      tileLayers: [
        {
          url: ''
        },
        {
          url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
        }
      ],
      outMode: false,
      northEast: null,
      southWest: null,
      viewMode: false,
      goldIcon: null,
      outFloorId: 42168135,
      isMyStoreSensor: false,
      humanLoc: '',
      offset: 2,
      chkClick: [false, false, false, false],
      searchEnabled: true
    }
  },
  /* */
  methods: {
    ...mapActions('attach/attach', [
      'FETCH_ATTACH_INFO',
      'UPDATE_ATTACH_INFO',
      'CREATE_ATTACH_INFO'
    ]),

    ...mapActions('sensor/sensor', [
      'FETCH_SENSOR_INFO',
      'UPDATE_SENSOR_INFO',
      'UPDATE_SENSOR_EVENT',
      'FETCH_CURRENT_SENSOR',
      'SEARCH_SENSOR',
      'SEARCH_OUT_SENSOR',
      'CREATE_SENSOR_EVENT',
      'FETCH_FLOOR_INFO',
      'UPDATE_FLOOR_IMAGE',
      'DELETE_ONE_SENSOR',
      'CREATE_ONE_SENSOR',
      'FETCH_OUT_SENSOR_INFO',
      'FETCH_OUT_SENSOR_ONE'
    ]),
    ...mapMutations('sensor/sensor', [
      'SET_SENSOR_NAME',
      'SET_SENSOR_EVENT',
      'SET_EVENT_OPTION',
      'SET_CURRENT_SENSOR_NAME',
      'SET_SEARCH_PARAM',
      'SET_SEARCH_RESPONSE_DEFAULT',
      'SET_SEARCH_PARAM_DEFAULT',
      'SET_SELECT_SENSOR_EVENT_ID',
      'SET_SELECT_SENSOR_EVENT_ID_DEFAULT',
      'SET_SELECT_SENSOR_EVENT_VISIBLE',
      'SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT',
      'PUSH_SENSOR_EVENT',
      'SET_CURRENT_SENSOR_LOC',
      'SET_CURRENT_SENSOR_DEFAULT',
      'SET_SENSOR_EVENT_DEL',
      'SET_FLOOR_ATTACH_FILE_ID',
      'SET_CURRENT_SENSOR_BOUND',
      'SET_CURRENT_SENSOR',
      'SET_CURRENT_SENSOR_DESC',
      'SET_CURRENT_SENSOR_DV'
    ]),
    ...mapActions('sensor_event/sensor_event', [
      'FETCH_SENSOR_EVENT_INFO',
      'FETCH_EVENT_OPTION',
      'DELETE_SENSOR_EVENT'
    ]),
    ...mapMutations('sensor_event/sensor_event', [
      'SET_DEFAULT_SENSOR_EVENT_INFO'
    ]),


    // [START] 버튼 이벤트 모음

    /* 실외도 선택 */
    changeOutFloor() {
      this.sensorClick = false
      this.clickSensorIndex = null
      this.oldIndex = null
      this.SET_CURRENT_SENSOR_DEFAULT()
      this.SET_DEFAULT_SENSOR_EVENT_INFO()
      this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
      // Class Change
      document.getElementsByName('outFloor')[0].className = 'on'
      if (this.currentFloor !== null) {
        document.getElementById(this.currentFloor.FLOOR_ID).className = null
      }

      this.clearLayerGroup(2)
      this.currentFloor = null
      this.outFloorInit()
    },
    /* 층 목록 선택 */
    async changeFloor(floor) {
      this.clearSearch()
      this.SET_SEARCH_PARAM_DEFAULT()
      this.sensorClick = false
      this.clickSensorIndex = null
      this.oldIndex = null
      this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
      /* 레이어 그룹 초기화 */
      this.clearLayerGroup(2)
      /* 버튼 클래스 변경 */
      this.changeFloorClass(floor.FLOOR_ID)
      this.currentFloor = floor

      const floorImg = { attachId: floor.ATTACH_ID }

      await this.FETCH_ATTACH_INFO(floorImg)
      await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
      this.modifyMode = false
      this.addMode = false
      this.inFloorInit()
      this.imgSrc = this.attachInfo.IMG_SRC
      if (this.imgSrc === undefined) {
        // 이미지가 없는 경우, 이미지 추가하도록 유도 필요
        // 이미지가 없을때 imgChk 값 true
        this.imgChk = true
        this.url = require('~/assets/images/temp/add_img.png')
        this.$refs.map.mapObject.setView([750, 750], -3)
        this.$refs.map.mapObject.dragging.disable()
        this.$refs.map.mapObject.scrollWheelZoom.disable()
        this.$refs.map.mapObject.doubleClickZoom.disable()
        this.$refs.map.mapObject.contextmenu.removeHooks()
      } else {
        this.imgChk = false
        this.url = this.imgSrc
        this.$refs.map.mapObject.setView([750, 750], -1)
        this.$refs.map.mapObject.dragging.enable()
        this.$refs.map.mapObject.scrollWheelZoom.enable()
        this.$refs.map.mapObject.contextmenu.addHooks()
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
      }
    },
    /* MAP 우클릭 이벤트 센서 추가 */
    async addSensor(e) {
      if (this.modifyMode === true) {
        if (this.addMode === true) {
          alert('진행중인 센서 추가를 먼저 완료 하세요')
        } else {
          if (this.clickSensorIndex !== null) {
            this.sensors[this.clickSensorIndex].setIcon(this.blueIcon)
          }
          this.addMode = true
          let idx = this.sensors.length
          let FloorId = null

          if (this.outMode) {
            let check = await this.checkOutSensorAdd()
            if (check) {
              this.sensors[idx] = L.marker(
                [this.properInfo.STORE_LAT, this.properInfo.STORE_LOT],
                {
                  icon: this.redIcon,
                  key: -idx,
                  visible: true,
                  draggable: true,
                  name: 'My store',
                  desc: 'My store',
                  bound: 1,
                  state: 'new',
                  locX: this.properInfo.STORE_LOT,
                  locY: this.properInfo.STORE_LAT
                }
              ).on('click', this.onMarkerClick).addTo(this.layerGroup)
              FloorId = 42168135
            } else {
              alert('이미 센서가 있습니다!')
              this.addMode = false
              return
            }
          } else {
            this.sensors[idx] = L.marker(
              e.latlng,
              {
                icon: this.redIcon,
                key: -idx,
                visible: true,
                draggable: true,
                name: 'new ' + idx,
                desc: 'new ' + idx,
                bound: 0,
                state: 'new',
                locX: e.latlng.lng,
                locY: e.latlng.lat
              }
            ).on('click', this.onMarkerClick).addTo(this.layerGroup)
            FloorId = this.currentFloor.FLOOR_ID
          }

          let data = {
            SENSOR_ID: -idx,
            SENSOR_NAME: this.sensors[idx].options.name,
            SENSOR_DESC: this.sensors[idx].options.desc,
            FLOOR_ID: FloorId,
            BOUND: 0,
            SENSOR_LOC_X: this.sensors[idx].options.locX,
            SENSOR_LOC_Y: this.sensors[idx].options.locY,
            IS_ACTIVATE: '',
            DRAGGABLE: false,
            VISIBLE: false,
            CONDITION: '',
            SENSOR_EVENT_LIST: []
          }

          await this.SET_CURRENT_SENSOR_DEFAULT()
          await this.SET_CURRENT_SENSOR(data)
          await this.addEvent(this.currentSensor)
        }
      } else {
        alert('편집 모드에서 추가하세요!')
      }
    },
    /*실외도 센서 추가 시 체크*/
    checkOutSensorAdd() {
      let chk = 0
      let isValid = true
      if (this.sensors.length === 0) {
        return true
      } else {
        for (let i = 0; i < this.sensors.length; i++) {
          if (this.properInfo.STORE_LOT === this.sensors[i].options.locX
            && this.properInfo.STORE_LAT === this.sensors[i].options.locY) {
            chk = 1
            isValid = false
          }
        }
      }
      return isValid
    },
    /* */
    checkMyStoreSensor() {
      if (this.divideInfo.TARGET_DV_CD === this.currentSensor.SENSOR_TARGET_DV_CD && this.divideInfo.TARGET_ID === this.currentSensor.SENSOR_TARGET_ID) {
        this.isMyStoreSensor = true
        this.mySensorId = this.currentSensor.SENSOR_ID
      } else {
        this.isMyStoreSensor = false
      }
    },
    /* 모든 센서 범위 확인 */
    viewSensorsBound() {
      this.SET_SELECT_SENSOR_EVENT_VISIBLE()
      if (!this.selectSensorEventVisible) {
        this.clearLayerGroup(1)
        return
      }
      /* 기존 센서 범위 레이어그룹 초기화 */
      this.clearLayerGroup(1)
      let senlist = this.GET_SELECT_SENSOR_EVENT
      let idx = 0
      let sensorsBounds = []
      senlist.forEach(sensor => {
        sensorsBounds[idx] = L.circle(
          [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
          {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: sensor.BOUND
          }
        ).addTo(this.layerBoundGroup)
        idx = idx + 1
      })
    },
    /* l-map ready */
    doSomethingOnReady() {
      this.map = this.$refs.map.mapObject
      this.$refs.map.mapObject.setView([750, 750], -1)

      this.layerGroup = L.layerGroup().addTo(this.map)
      this.layerBoundGroup = L.layerGroup().addTo(this.map)
      this.layerBoundGroupInvisible = L.layerGroup().addTo(this.map) //0824추가
      this.layerChangeBoundGroup = L.layerGroup().addTo(this.map) // 센서 Bound 변경 시 사용
    },
    /* 이미지 추가, 편집 */
    fileOpen() {
      this.$refs.imgFile.click()
    },
    /*  */
    changeFile(e, type) {
      const file = this.$refs.imgFile
      const overSize = 10000
      const overTxt =
        '용량초과 이미지가 있습니다. 파일당 10MB미만의 jpg, gif, png파일만 첨부하실 수 있습니다.'
      let files = e.target.files || e.dataTransfer.files
      if (files.length === 0) return
      this.addPhotoFile(file, (src, size) => {
        if (parseInt(this.formatSizeUnits(size)) > overSize) {
          alert(overTxt)
        } else {
          this.imgSrc = src
          this.url = this.imgSrc
          this.$refs.map.mapObject.setView([750, 750], -1)
          if (this.imgChk === false) {
            this.updateFile()
          } else {
            this.createFile()
            this.imgChk = false
          }
        }
      })
    },
    /* 센서 편집 */
    editSensor() {
      let chk = 0
      if (this.outMode) {
        if (this.currentSensor.SENSOR_ID !== '') {
          this.checkMyStoreSensor()
          if (this.isMyStoreSensor === false) {
            alert('내 가게만 편집 할 수 있습니다!')
            chk = 1
          }
        }
      }
      if (chk === 0) {
        if (this.clickSensorIndex !== null) {
          if (!this.outMode) {
            this.sensors[this.clickSensorIndex].dragging.enable()
          }
        }
        this.modifyMode = true
      }
    },
    /* 센서 편집모드 나가기 */
    async saveSensor() {
      if (!this.outMode) {
        await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
        this.$refs.map.mapObject.setView([750, 750], -1)
      } else {
        await this.FETCH_SENSOR_INFO(this.outFloorId)
        this.$refs.map.mapObject.setView(this.map.options.center, 17, { animate: true })
        this.outFloorInit()
      }
      this.loadHumanIcon(1, 1)
      this.modifyMode = false
      this.addMode = false
    },
    /* 속성 편집내용 저장 */
    async editEvent() {
      let loc
      for (let i = 0; i < this.sensors.length; i++) {
        if (this.currentSensor.SENSOR_ID === this.sensors[i].options.key) {
          loc = this.sensors[i].getLatLng()
        }
      }
      await this.SET_CURRENT_SENSOR_LOC(loc)
      await this.CREATE_SENSOR_EVENT(this.currentSensor)
      await this.UPDATE_SENSOR_INFO(this.currentSensor)
      await this.UPDATE_SENSOR_EVENT(this.currentSensor.SENSOR_EVENT_LIST)
      alert('저장되었습니다!')
    },
    /* */
    async addNewSensor() {
      if (this.currentSensor.BOUND === '' ||
        this.currentSensor.SENSOR_NAME === '' ||
        this.currentSensor.SENSOR_DESC === '') {
        alert('센서 정보를 반드시 입력하세요!')
      } else if (confirm('센서를 추가하시겠습니까?') === true) {
        if (this.outMode && this.currentSensor.SENSOR_EVENT_LIST[0].EVENT_LIST_ID === null) {
          alert('실외 이벤트를 반드시 추가하십시오!')
        } else {
          let loc
          for (let i = 0; i < this.sensors.length; i++) {
            if (this.currentSensor.SENSOR_ID === this.sensors[i].options.key) {
              loc = this.sensors[i].getLatLng()
            }
          }
          await this.SET_CURRENT_SENSOR_LOC(loc)
          if (this.outMode) {
            await this.SET_CURRENT_SENSOR_DV('OUT')
          } else {
            await this.SET_CURRENT_SENSOR_DV('IN')
          }
          await this.CREATE_ONE_SENSOR(this.currentSensor)
          await this.CREATE_SENSOR_EVENT(this.currentSensor)
          if (this.outMode) {
            await this.FETCH_SENSOR_INFO(this.outFloorId)
            await this.loadOutSensorList()
          } else {
            await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
            await this.loadSensors(0)
          }
          this.addMode = false
        }

      }
    },
    /* */
    async delSensor() {
      if (confirm('정말 센서를 삭제하시겠습니까?') === true) {
        if (this.currentSensor.SENSOR_ID > 0) {
          await this.DELETE_ONE_SENSOR(this.currentSensor.SENSOR_ID)
        } else {
          this.addMode = false
        }
        this.clickSensorIndex = null
        this.sensorClick = false
        this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
        if (this.outMode) {
          await this.FETCH_SENSOR_INFO(this.outFloorId)
          this.$refs.map.mapObject.setView(this.map.options.center, 18, { animate: true })
        } else {
          await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
          this.$refs.map.mapObject.setView([750, 750], -1)
        }
        await this.SET_CURRENT_SENSOR_DEFAULT()
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
      }
    },
    /* 속성 select box값 받아오기*/
    async opChange(event, relId) {
      let count = 0
      let preName
      const data = {
        ID: parseInt(event.target.value),
        SENSOR_EVENT_REL_ID: relId
      }

      for (let i = 0; i < this.currentSensor.SENSOR_EVENT_LIST.length; i++) {
        if (data.ID === this.currentSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_ID) {
          count = count + 1
        }
        if (data.SENSOR_EVENT_REL_ID === this.currentSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_REL_ID) {
          preName = this.currentSensor.SENSOR_EVENT_LIST[i].SENSOR_EVENT_ID
        }
      }

      if (count > 0) {
        alert('이미 있는 속성입니다!')
        if (relId < 0) {
          if (count === 1) {
            event.target.value = preName
          } else {
            event.target.value = null
          }
        } else {
          event.target.value = preName
        }
        count = 0
      } else {
        await this.SET_SENSOR_EVENT(data)
        count = 0
      }
    },
    //속성이 EVENT일때 하위 항목 select box 값 받아오기
    eventChange(event, relId) {
      let id = parseInt(event.target.value, 10)
      let data = {
        ID: id,
        SENSOR_EVENT_REL_ID: relId
      }
      this.SET_EVENT_OPTION(data)
    },
    /* -- */
    async deleteEvent(onesen) {
      if (this.currentSensor.SENSOR_EVENT_LIST.length === 1) {
        alert('속성은 반드시 1개 이상이여야합니다')
      } else {
        if (confirm('속성을 삭제하시겠습니까?') === true) {
          if (onesen.SENSOR_EVENT_REL_ID > 0) {
            await this.DELETE_SENSOR_EVENT(onesen.SENSOR_EVENT_REL_ID)
            if (this.outMode) {
              await this.FETCH_SENSOR_INFO(this.outFloorId)
            } else {
              await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
            }
            await this.FETCH_CURRENT_SENSOR(this.currentSensor.SENSOR_ID)
          } else {
            await this.SET_SENSOR_EVENT_DEL(onesen.SENSOR_EVENT_REL_ID)
          }
        }
      }
    },
    /* -- */
    addEvent(curSensor) {
      this.tempRelId = this.tempRelId - 1
      let sensor_event_id
      if (this.outMode) {
        sensor_event_id = 3
      } else {
        sensor_event_id = null
      }
      const data = {
        SENSOR_EVENT_ID: sensor_event_id,
        EVENT_LIST_ID: null,
        SENSOR_EVENT_REL_ID: this.tempRelId
      }
      this.PUSH_SENSOR_EVENT(data)
    },
    // [END] 버튼 이벤트 모음

    /* CREATED CALL */
    async initInteriorModal() {
      this.iconSettings()
      if (this.divideInfo.TARGET_DV_CD === 'STORE') {
        this.properInfo = this.storeInfo
      } else if (this.divideInfo.TARGET_DV_CD === 'BUILDING') {
        this.properInfo = this.buildingInfo
      }
      await this.FETCH_FLOOR_INFO(this.properInfo)
      await this.loadFloor1F()
      await this.FETCH_SENSOR_EVENT_INFO()
      await this.FETCH_EVENT_OPTION(this.divideInfo)
    },
    /* 1층 정보 가져오기 initInteriorModal call */
    async loadFloor1F() {
      const f1 = this.floorInfo.filter(data => data.FLOOR_NO === 1 && data.IS_GROUND === 'Y')
      this.currentFloor = f1[0]     // 1층 정보
      document.getElementById(this.currentFloor.FLOOR_ID).className = 'on'  // 1층 클래스 변경

      const floorImg = { attachId: this.currentFloor.ATTACH_ID }
      await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)

      if (floorImg.attachId === null) {
        this.url = require('~/assets/images/temp/add_img.png')
        this.$refs.map.mapObject.setView([750, 750], -3)
        this.$refs.map.mapObject.dragging.disable()
        this.$refs.map.mapObject.scrollWheelZoom.disable()
        this.$refs.map.mapObject.doubleClickZoom.disable()
        // this.$refs.map.mapObject.contextmenu.removeHooks()
      } else {
        await this.FETCH_ATTACH_INFO(floorImg)
        this.imgSrc = this.attachInfo.IMG_SRC
        this.url = this.imgSrc
        this.$refs.map.mapObject.dragging.enable()
        this.$refs.map.mapObject.scrollWheelZoom.enable()
        this.$refs.map.mapObject.contextmenu.addHooks()
        this.imgChk = false
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
      }

    },
    /* l-map click */
    onMapClick(e) {
      if (this.imgChk) {
        this.changeFile()
      }
    },
    /* change file call */
    addPhotoFile(obj, callback) {
      let src, size
      if (obj.files && obj.files[0]) {
        let reader = new FileReader()
        reader.readAsDataURL(obj.files[0])
        reader.onload = function(e) {
          size = obj.files[0].size
          src = e.target.result
          callback && callback(src, size)
        }
      }
    },
    /* change file call */
    formatSizeUnits(bytes) {
      if (bytes >= 1000000000) {
        bytes = (bytes / 1000000000).toFixed(2) + ' GB'
      } else if (bytes >= 1000000) {
        bytes = (bytes / 1000000).toFixed(2) + ' MB'
      } else if (bytes >= 1000) {
        bytes = (bytes / 1000).toFixed(2) + ' KB'
      } else if (bytes > 1) {
        bytes = bytes + ' bytes'
      } else if (bytes === 1) {
        bytes = bytes + ' byte'
      } else {
        bytes = '0 byte'
      }
      return bytes
    },
    /* changeFile call */
    async updateFile() {
      const photoFile = this.$refs.imgFile
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        frm.append('image_data', this.imgSrc)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }

        const attach_data = {
          attachId: this.currentFloor.ATTACH_ID,
          config: config,
          attachInfo: frm
        }
        await this.UPDATE_ATTACH_INFO(attach_data)
      }
    },
    /* change file call */
    async createFile() {
      const photoFile = this.$refs.imgFile
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        frm.append('image_data', this.imgSrc)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const attach_data = {
          config: config,
          attachInfo: frm
        }
        const res = await this.CREATE_ATTACH_INFO(attach_data)
        const data = {
          attachId: this.attachInfo.ATTACH_ID,
          floorId: this.currentFloor.FLOOR_ID,
          index: this.currentIndex
        }
        await this.SET_FLOOR_ATTACH_FILE_ID(data)
        await this.UPDATE_FLOOR_IMAGE(data)
        await this.$refs.map.mapObject.dragging.enable()
        await this.$refs.map.mapObject.scrollWheelZoom.enable()
        await this.loadHumanIcon(1, 1)
      }
    },
    /* 센서 목록 불러오기 */
    loadSensors(eventId) {
      let senlist = []
      this.oldIndex = null
      this.SET_CURRENT_SENSOR_DEFAULT()
      this.sensorClick = false
      this.SET_SELECT_SENSOR_EVENT_ID(eventId)
      /* 0 = default
         1 =  출입
         2 = 결제
         3 = 이벤트*/
      senlist = this.GET_SELECT_SENSOR_EVENT
      /* 센서 정보 없는 경우 리턴 */
      this.clearLayerGroup(2)

      if (this.sensorList.length === 0) {
        return
      }
      /* 센서 초기화 */
      this.sensors = []
      let idx = 0
      /* 기존 레이어그룹 초기화 */


      senlist.forEach(sensor => {
        this.sensors[idx] = L.marker(
          [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
          {
            key: sensor.SENSOR_ID,
            visible: sensor.VISIBLE,
            draggable: sensor.DRAGGABLE,
            name: sensor.SENSOR_NAME,
            desc: sensor.SENSOR_DESC,
            locX: sensor.SENSOR_LOC_X,
            locY: sensor.SENSOR_LOC_Y,
            latLng: sensor.POSITION,
            state: 'load',
            bound: sensor.BOUND,
            eventId: sensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID
          }
        ).on('click', this.onMarkerClick).on('dragend', this.onMarkerDrag).addTo(this.layerGroup)
        if (sensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID === 1) {
          this.sensors[idx].setIcon(this.blueIcon)
        }
        if (sensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID === 2) {
          this.sensors[idx].setIcon(this.goldIcon)
        }
        if (sensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID === 3) {
          this.sensors[idx].setIcon(this.greenIcon)
        }
        idx = idx + 1
      })
    },
    /* */
    async onMarkerClick(e) {
      // 신규 센서인 경우 작동 하지 않음
      if ( e.target.options.state === 'new' && e.target.options.key < 0 ) {
        return
      }

      let chk = 0
      await this.FETCH_CURRENT_SENSOR(e.target.options.key)
      if (this.outMode) {
        if (this.modifyMode) {
          // await this.FETCH_CURRENT_SENSOR(e.target.options.key)
          await this.checkMyStoreSensor()
          if (!this.isMyStoreSensor) {
            chk = 1
            alert('내 가게가 아닙니다!')
            this.sensorClick = false
            if (this.sensors[this.oldIndex].options.key === this.mySensorId) {
              this.sensors[this.oldIndex].setIcon(this.goldIcon)
            }
          }
        }
      }
      if (chk === 0) {
        if (this.clickSensorIndex === '') {
          this.clickSensorIndex = null
        }
        if (this.oldIndex !== undefined && this.oldIndex !== null && this.clickSensorIndex !== null) {
          if (this.sensors[this.oldIndex].options.eventId === 1) {
            this.sensors[this.oldIndex].setIcon(this.blueIcon)
          }
          if (this.sensors[this.oldIndex].options.eventId === 2) {
            this.sensors[this.oldIndex].setIcon(this.goldIcon)
          }
          if (this.sensors[this.oldIndex].options.eventId === 3) {
            this.sensors[this.oldIndex].setIcon(this.greenIcon)
          }
          if (this.outMode) {
            if (this.sensors[this.oldIndex].options.key === this.mySensorId) {
              this.sensors[this.oldIndex].setIcon(this.goldIcon)
            }
          }
          this.sensors[this.clickSensorIndex].dragging.disable()
        }
        this.sensorClick = true
        this.clickSensorIndex = this.sensors.findIndex(i => i.options.key === e.target.options.key)
        this.oldIndex = this.clickSensorIndex
        await this.FETCH_CURRENT_SENSOR(e.target.options.key)
        e.target.setIcon(this.redIcon)
        if (this.modifyMode === true) {
          if (!this.outMode) {
            this.sensors[this.clickSensorIndex].dragging.enable()
          }
        }

        let zoomLevel = -0.5
        if (this.outMode) {
          this.viewMode = true
          zoomLevel = 18
        }
        // setView 변경
        this.map.setView(e.target._latlng , zoomLevel)
        // this.map.setView(
        //   [this.sensors[this.clickSensorIndex].options.locY,
        //     this.sensors[this.clickSensorIndex].options.locX], zoomLevel)

        this.viewMode = false
      }
    },
    /*센서 편집시 입력한 이름 저장*/
    input_name(name) {
      this.sensors[this.clickSensorIndex].options.name = name
    },
    /* icon Settings */
    iconSettings() {
      this.redIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/marker-icon-2x-red.png'),
        shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      this.blueIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/marker-icon-2x-blue.png'),
        shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      this.humanIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/test0901.png'),
        iconSize: [50, 50],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })

      this.goldIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/marker-icon-2x-gold.png'),
        shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      this.greenIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/marker-icon-2x-green.png'),
        shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      this.violetIcon = new L.Icon({
        iconUrl: require('~/assets/images/temp/marker-icon-2x-violet.png'),
        shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    },
    /* Class 변경 */
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
    /* layerGroup Clear */
    clearLayerGroup(aNumber) {
      if (aNumber === 0) {
        this.layerGroup.clearLayers()
      } else if (aNumber === 1) {
        this.layerBoundGroup.clearLayers()
      } else {
        this.layerGroup.clearLayers()
        this.layerBoundGroup.clearLayers()
      }
    },
    /* 엔터를 눌렀을 때 search가 실행되게하는 함수 */
    enterkeySearch() {
      if (window.event.keyCode === 13) {
        this.searchStart()
      }
    },
    /* -- */
    async onClickSearchResult(searchedVal) {
      /* 실내도 */
      if (searchedVal.SENSOR_DV === 'IN') {
        const floor = this.floorInfo.filter(data =>
          data.FLOOR_ID === searchedVal.FLOOR_ID
        )
        await this.changeFloor(floor[0])


        if (this.oldIndex !== null) {
          this.sensors[this.oldIndex].setIcon(this.blueIcon)
        }
        this.sensorClick = true
        this.clickSensorIndex = this.sensors.findIndex(i => i.options.key === searchedVal.SENSOR_ID)
        this.oldIndex = this.clickSensorIndex
        await this.FETCH_CURRENT_SENSOR(searchedVal.SENSOR_ID)
        this.sensors[this.clickSensorIndex].setIcon(this.redIcon)
        this.map.setView(
          [this.sensors[this.clickSensorIndex].options.locY,
            this.sensors[this.clickSensorIndex].options.locX], -0.5)
      }
      /* 실외도 */
      else {
        this.sensorClick = false
        await this.FETCH_OUT_SENSOR_ONE(searchedVal.SENSOR_ID)
        let zoomLevel = -0.5
        if (this.outMode) {
          this.viewMode = true
          zoomLevel = 18
        }
        this.viewMode = false
        this.sensorClick = true
        await this.map.setView(
          [this.currentSensor.SENSOR_LOC_Y,
            this.currentSensor.SENSOR_LOC_X], zoomLevel)
      }
      this.clearSearch()
      this.SET_SEARCH_PARAM_DEFAULT()
    },
    /* -- */
    clearSearch() {
      this.SET_SEARCH_RESPONSE_DEFAULT()
      //this.SET_SEARCH_PARAM_DEFAULT()
      this.searchClicked = false
      this.slist = []
      this.limit = 0
    },
    /* -- */
    async infiniteHandler($state) {
      this.searchEnabled = false
      if (this.outMode === true) {
        await this.SEARCH_OUT_SENSOR(this.limit)
      } else {
        await this.SEARCH_SENSOR(this.limit)
      }
      setTimeout(() => {
        if (this.searchResponse.length) {
          this.limit += 10
          this.slist.push(...this.searchResponse)
          $state.loaded()
          this.searchEnabled = true
        } else {
          this.searchEnabled = true
          $state.complete()
        }
      }, 1000)

    },
    async searchStart() {
      if (this.searchEnabled) {
        if (this.searchClicked) {
          await this.clearSearch()
          if (this.$refs.infiniteLoading)
            this.$refs.infiniteLoading.stateChanger.reset()
        }
        this.searchClicked = true
      } else {
        alert('모든 검색이 완료될때까지 기다려주세요')
      }

    },
    /* */
    loadHumanIcon(lon, lat) {

      this.human = L.marker(
        [lon, lat],
        {
          icon: this.humanIcon,
          key: 'human 1',
          visible: true,
          draggable: true,
          name: 'human',
          desc: 'human',
          locX: lon,
          locY: lat,
          latLng: [lon, lat]
        }
      ).addTo(this.layerGroup)
      this.sensorInBound(this.human)
    },
    /* */
    sensorInBound(sensor) {
          const map = this.map
          const sl = this.sensorList
          let sensorsBounds = []
          let idx = 0
          sl.forEach(sensor => {
            sensorsBounds[idx] = L.circle(
              [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
              {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0,
                opacity: 0,
                radius: sensor.BOUND
              }
            ).addTo(this.layerBoundGroupInvisible)//0824수정
            idx = idx + 1
          })
          let popup = L.popup({autoClose: false, autopan: true})
        
          sensor.on('dragend', function(event) {
            let lst = []
            let mapbound = []
            let latlng = event.target.getLatLng()
            console.log()
            sensorsBounds.forEach(circle => {
              let a = circle.getBounds().getCenter().lng - circle.getBounds().getWest()
              let b = circle.getBounds().getCenter().lat - circle.getBounds().getSouth()
              let x = latlng.lng - circle.getBounds().getCenter().lng
              let y = latlng.lat - circle.getBounds().getCenter().lat
              mapbound.push(((x * x) / (a * a)) + ((y * y) / (b * b)))
            })
            for (let i = 0; i < mapbound.length; i++) {
              if (mapbound[i] <= 1) {
                lst.push(sl[i].SENSOR_NAME)
              }
            }
            if (lst.length !== 0) {
              //기존 : alert()
              //수정 : 영역범위 내 팝업 이벤트 표시(2021.09.01)
              let popupLatlng = [latlng.lat + 50, latlng.lng + 20]
              popup.setLatLng(popupLatlng)
              .setContent('<p> Hello World </p>')
              .openOn(map);
            } else {
            if(popup.isOpen()){
              //영역범위 벗어 났을 때
              //Open 되어 있는 팝업 Close
              map.closePopup();
            }
          }
        })
      },
    setHumanDefault() {
      if (this.outMode) {
        this.human = ''
        this.humanLoc = [37.372374050971835, 126.94337458660783]
        this.loadOutSensorList()
      } else {
        this.human.setLatLng([1, 1])
      }

    },
    buttonClick(index) {
      this.chkClick = [false, false, false, false]
      this.chkClick[index] = true
    },
    /* 실외도 설정 */
    async outFloorInit() {
      //사람센서 초기화
      this.human = ''
      this.humanLoc = [37.372374050971835, 126.94337458660783]
      // Bounds 초기화
      this.northEast = null
      this.southWest = null

      // 실외도 설정
      this.outMode = true
      this.imgChk = false
      this.modifyMode = false
      this.sensorClick = false
      this.SET_CURRENT_SENSOR_DEFAULT()
      // Image Overlay Clear
      this.url = ''
      this.bounds = [[0, 0], [0, 0]]
      // Tile Layer
      this.tileLayerIndex = 1
      const lat = (this.divideInfo.TARGET_DV_CD === 'STORE') ? this.properInfo.STORE_LAT : this.properInfo.BUILDING_LAT
      const lng = (this.divideInfo.TARGET_DV_CD === 'STORE') ? this.properInfo.STORE_LOT : this.properInfo.BUILDING_LOT

      if (lat === null || lng === null) {
        this.map.options.center = latLng(37.5642135, 127.0016985)
        this.map.options.zoom = 13
        this.imgChk = true
      } else {
        this.map.options.center = latLng(lat, lng)
        this.map.options.zoom = 17
      }

      this.map.options.minZoom = 0
      this.map.options.maxZoom = 18
      this.map.options.crs = CRS.EPSG3857
      // this.map.options.crs = CRS.EPSG900913
      this.$refs.map.mapObject.setView(this.map.options.center, this.map.options.zoom, { animate: true })
      this.$refs.map.mapObject.dragging.enable()
      this.$refs.map.mapObject.scrollWheelZoom.enable()
      await this.FETCH_SENSOR_EVENT_INFO()
    },
    /* 실내도 설정 */
    inFloorInit() {
      this.outMode = false
      this.FETCH_SENSOR_EVENT_INFO()
      // Image Overlay
      this.bounds = [[0, 0], [1500, 1500]]
      // Tile Layer Clear
      this.tileLayerIndex = 0
      this.map.options.center = [750, 750]
      this.map.options.zoom = 0
      this.map.options.minZoom = -3
      this.map.options.maxZoom = 8
      this.map.options.crs = CRS.Simple
      this.$refs.map.mapObject.setView(this.map.options.center, 18, { animate: true })
    },
    /* l-map MoveEnd */
    /* l-map MoveEnd */
    async onMapMoveEnd(e) {
      // console.trace();
      if (this.outMode && !this.viewMode) {   // 실외도 상태에서만 적용
        const bounds = this.map.getBounds()
        if (this.northEast === null) {
          this.northEast = bounds._northEast
          this.northEast.lat += (this.offset / 1000)
          this.northEast.lng += (this.offset / 1000)
          this.southWest = bounds._southWest
          this.southWest.lat -= (this.offset / 1000)
          this.southWest.lng -= (this.offset / 1000)
          await this.loadOutSensorList()    // DB 조회
        } else {
          const zoomLevel = this.map.getZoom()
          if (zoomLevel < 15) {
            //TODO: 초기화 작업 필요
            return
          }
          let loadChange = false
          if (bounds._northEast.lat > this.northEast.lat ||
            bounds._northEast.lng > this.northEast.lng ||
            bounds._southWest.lat < this.southWest.lat ||
            bounds._southWest.lng < this.southWest.lng
          ) {
            loadChange = true
          }

          if (loadChange) {
            this.northEast = bounds._northEast
            this.northEast.lat += (this.offset / 1000)
            this.northEast.lng += (this.offset / 1000)
            this.southWest = bounds._southWest
            this.southWest.lat -= (this.offset / 1000)
            this.southWest.lng -= (this.offset / 1000)
            await this.loadOutSensorList()    // DB 조회
          }
        }
      }
    },
    async loadOutSensorList() {
      const mapBounds = {
        NORTHEAST: { LAT: this.northEast.lat, LNG: this.northEast.lng },
        SOUTHWEST: { LAT: this.southWest.lat, LNG: this.southWest.lng }
      }
      await this.FETCH_OUT_SENSOR_INFO(mapBounds)
      await this.outSensorDraw()
    },
    outSensorDraw() {
      this.clickSensorIndex = null
      this.oldIndex = null
      this.sensorClick = false
      if (this.human) {
        this.humanLoc = [this.human._latlng.lat, this.human._latlng.lng]
      }

      if (this.sensorList.length === 0) {
        return
      }
      /* 기존 레이어그룹 초기화 */
      this.clearLayerGroup(2)
      /* 센서 초기화 */
      this.sensors = []
      let idx = 0

      if (this.divideInfo.TARGET_DV_CD === 'STORE') {
        this.properInfo = this.storeInfo
      } else if (this.divideInfo.TARGET_DV_CD === 'BUILDING') {
        this.properInfo = this.buildingInfo
      }

      // const photoImg = '<img src="https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg" height="150px" width="150px"/>';
      this.sensorList.forEach(sensor => {
        let storeBuildingInfo
        if (sensor.SENSOR_TARGET_DV_CD === 'STORE') {
          storeBuildingInfo = sensor.storeInfo
        } else {
          storeBuildingInfo = sensor.buildingInfo
        }
        let photoImg = `<img src='{1}' height='100px' width='100px'/>`
        let existImg = false
        //사진데이터가 빈 공백('')으로 들어가는 경우가 존재
        if (storeBuildingInfo && storeBuildingInfo.IMG_SRC !== '') {
          existImg = true
        }
        const replace = existImg ? storeBuildingInfo.IMG_SRC : 'https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg'
        photoImg = photoImg.replace('{1}', replace)
        //`<center>Shop Name</center></br> 센서 명칭:${sensor.SENSOR_NAME}</br> 센서 설명:${sensor.SENSOR_DESC}</br> ${photoImg}`
        let contents
        if (sensor.SENSOR_TARGET_DV_CD === 'STORE') {
          contents = `<center>${storeBuildingInfo.STORE_NAME}</center> </br>
          센서 명칭 : ${sensor.SENSOR_NAME} </br>
          센서 설명 : ${sensor.SENSOR_DESC} </br>
          ${photoImg}
          `
        } else {
          contents = `<center>${storeBuildingInfo.BUILDING_NAME}</center> </br>
          센서 명칭 : ${sensor.SENSOR_NAME} </br>
          센서 설명 : ${sensor.SENSOR_DESC} </br>
          ${photoImg}
          `
        }
        let MarkIcon = this.blueIcon
        if (this.divideInfo.TARGET_DV_CD === sensor.SENSOR_TARGET_DV_CD && this.divideInfo.TARGET_ID === sensor.SENSOR_TARGET_ID) {
          MarkIcon = this.goldIcon
          this.mySensorId = sensor.SENSOR_ID
        }
        //TODO: 자기 건물 or 가게 인 경우 다른 그림으로 그려주기
        this.sensors[idx] = L.marker(
          [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
          {
            icon: MarkIcon,
            key: sensor.SENSOR_ID,
            visible: sensor.VISIBLE,
            draggable: sensor.DRAGGABLE,
            name: sensor.SENSOR_NAME,
            desc: sensor.SENSOR_DESC,
            locX: sensor.SENSOR_LOC_X,
            locY: sensor.SENSOR_LOC_Y,
            bound: sensor.BOUND,
            state: 'load',
            latLng: sensor.POSITION
          }
        ).on('click', this.onMarkerClick)
          .addTo(this.layerGroup).bindPopup(contents, { autoClose: false, autoPan: false })
        idx = idx + 1
      })
      this.loadHumanIcon(this.humanLoc[0], this.humanLoc[1])
      if (this.selectSensorEventVisible) {
        const senlist = this.GET_SELECT_SENSOR_EVENT
        let idx = 0
        let sensorsBounds = []
        senlist.forEach(sensor => {
          sensorsBounds[idx] = L.circle(
            [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
            {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              radius: sensor.BOUND
            }
          ).addTo(this.layerBoundGroup)
          idx = idx + 1
        })
      }
    },
    changeSensorBound(e) {
      this.SET_CURRENT_SENSOR_BOUND(e)
      this.layerChangeBoundGroup.clearLayers()
      const targetSensor = this.getCurrentSensor(this.currentSensor.SENSOR_ID)
      L.circle(
        [targetSensor[0]._latlng.lat, targetSensor[0]._latlng.lng],
        {
          color: 'green',
          fillColor: '#2fff00',
          fillOpacity: 0.3,
          radius: e
        }
      ).addTo(this.layerChangeBoundGroup)
    },
    getCurrentSensor(id) {
      return this.sensors.filter(data => data.options.key === id)
    },
    onMarkerDrag(e) {
      // 신규 센서인 경우 작동 하지 않음
      if ( e.target.options.state === 'new' && e.target.options.key < 0 ) {
        return
      }
      this.layerChangeBoundGroup.clearLayers()
      L.circle(
        [e.target._latlng.lat, e.target._latlng.lng],
        {
          color: 'green',
          fillColor: '#2fff00',
          fillOpacity: 0.3,
          radius: this.currentSensor.BOUND
        }
      ).addTo(this.layerChangeBoundGroup)
    }


  }
}
</script>

<style>

.example-custom-control {
  background: #fff;
  padding: 0 0.5em;
  border: 1px solid #aaa;
  border-radius: 0.1em;
}

.first .first-top2 {
  width: 100%;
  height: 40px;
  background: #4f555f;
  font-size: 14px;
  color: #ccc;
  text-align: center;
  line-height: 40px;
}

.first .first-top {
  width: 100%;
  height: 85px;
  background: #4f555f;
  font-size: 14px;
  color: #ccc;
  text-align: center;
  line-height: 85px;
}

.floors-container li button {
  display: block;
  width: 100%;
  height: 45px;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #666;
}

.floors-container li button.on {
  background: #fff;
  color: #454545;
}


/* Modal */
.modal,
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}

.overlay {
  opacity: 0.5;
  background-color: black;
}

.modal-card {
  position: relative;
  width: 80%;
  margin: auto;
  margin-top: 30px;
  background-color: white;
  min-height: 700px;
  opacity: 1;
}

/* 화면 분할 */
.first {
  height: 700px;
  background-color: #5A5656;
  float: left;
  width: 5%;
  box-sizing: border-box;
  overflow: auto;
  -ms-overflow-style: none;
}

.first::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

.second {
  height: 700px;
  background-color: white;
  float: left;
  width: 21%;
  box-sizing: border-box;
  overflow: auto;
}

.third {
  display: flex;
  height: 700px;
  background-color: #F8F2F5;
  float: right;
  width: 74%;
  box-sizing: border-box;
}

/* 실내도 추가 버튼 스타일 */
.circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px dotted black;
  font-size: 16px;
  text-align: center;
  line-height: 200px;
}

.mod-image {
  position: fixed;
  top: 675px;
  right: 200px;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 20px;
  padding: 6px 25px;
  background-color: #dd6311;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.add-image {
  position: fixed;
  top: 600px;
  right: 690px;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 20px;
  padding: 6px 25px;
  background-color: #dd6311;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.sensorInfo {
  font-size: 25px;
  padding: 15px;
}

.saveButton {
  background-color: #dd6311;
  color: white;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 15px;
  border-radius: 4px;
  padding: 5px 15px;
}

.delButton {
  background-color: #ffffff;
  color: black;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 15px;
  border-radius: 4px;
  margin-right: 10px;
  padding: 5px 15px;
}

.searchResult {
  font-size: 15px;
  margin-top: 10px;
  margin-left: 20px
}

</style>
