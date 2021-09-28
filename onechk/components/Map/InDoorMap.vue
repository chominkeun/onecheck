<template>
  <div class='indoor' style='height: 600px; min-height: 300px; width: 100%; font-family: Pretendard-Regular'>
    <div class='indoor-overlay'>
      <div class='indoor-card'>
        <div class='indoor-first'>
          <div class='first-top'>실내도</div>
          <div class='floors-container'>
            <ul>
              <li
                class='floor-list'
                v-for='floor in floorInfo'
                :key='floor.FLOOR_ID'
              >
                <VBtn :id='floor.FLOOR_ID' @click='changeFloor(floor)'>
                  <p v-if="floor.IS_GROUND === 'Y'">
                    {{ floor.FLOOR_NO }}F
                  </p>
                  <p v-else>B{{ floor.FLOOR_NO }}</p>
                </VBtn>
              </li>
            </ul>
          </div>

        </div>

        <div class='indoor-second'>
          <VInput
            type='text'
            style='width: 72%; margin-left: 15px; margin-top: 10px'
            :value='searchParam'
            @input='SET_SEARCH_PARAM'
            @keyup='enterKeySearch'
          />

          <img
            src='../../assets/images/ico-search.png'
            style='margin-left: 10px'
            @click='searchStart'
          />
          <div
            v-if='search.searchClicked'
            style='overflow-y: auto; padding: 10px; height: 150px'
          >
            <li v-for='searchList in sList' :key='searchList.SENSOR_ID'>
              <button
                class='searchResult'
                @click='onClickSearchResult(searchList)'
              >
                <div style='float: left; margin-right: 10px; color: red'>
                  <p v-if="searchList.IS_GROUND === 'Y'">
                    {{ searchList.FLOOR_NO }}F
                  </p>
                  <p v-if="searchList.IS_GROUND === 'N'">
                    B{{ searchList.FLOOR_NO }}
                  </p>
                </div>
                {{ searchList.SENSOR_NAME }}
              </button>
            </li>

            <!-- spinner : default, spiral, circles, bubbles, waveDots -->
            <infinite-loading
              :identifier='search.infiniteId'
              @infinite='infiniteHandler($event)'
              ref='infiniteLoading'
              spinner='waveDots'
            >
              <div slot='no-more'></div>
            </infinite-loading>
          </div>

          <div class='sensorInfo' v-if='sensorEvent.sensorClick && (mode.modify && !mode.add)'>

            <p style='font-size: 15px'>
              센서 이름
              <VInput
                type='text'
                style='width: 80%; margin-top: 5px; margin-bottom: 12px'
                :value='currentSensor.SENSOR_NAME'
                @input='SET_CURRENT_SENSOR_NAME'
              >
              </VInput>
            </p>

            <p style='font-size: 15px'>
              센서 설명
              <VInput
                type='text'
                style='width: 80%; margin-top: 5px; margin-bottom: 12px'
                :value='currentSensor.SENSOR_DESC'
                @input='SET_CURRENT_SENSOR_DESC'
              >
              </VInput>
            </p>

            <p style='font-size: 15px'>
              센서 범위
              <VInput
                type='text'
                style='width: 80%; margin-top: 5px; margin-bottom: 12px'
                :value='currentSensor.BOUND'
                @input='changeSensorBound'
              >
              </VInput>
            </p>

            <li
              class='oneSensorEvent'
              v-for='(oneSen, index) in currentSensor.SENSOR_EVENT_LIST'
              :key='oneSen.SENSOR_EVENT_REL_ID'
            >

              <div
                v-if='oneSen.SENSOR_EVENT_REL_ID !== null'
                style='font-size: 15px; margin-top: 5px'
              >
                속성 {{ index + 1 }}

                <select
                  :value='oneSen.SENSOR_EVENT_ID'
                  @change='opChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                  style='width: 80%; margin-bottom: 3px'
                >
                  <option
                    v-for='(eList, index) in sensorEventList'
                    :key='index'
                    v-bind:value='eList.SENSOR_EVENT_ID'
                  >
                    {{ eList.SENSOR_EVENT_NAME }}
                  </option>
                </select>

                <button style='margin-left: 5px' @click='deleteEvent(oneSen)'>
                  <img src='~/assets/images/ico-del.png' />
                </button>
              </div>

              <div v-if='oneSen.SENSOR_EVENT_ID === 3'>
                <select
                  :value='oneSen.EVENT_LIST_ID'
                  @change='eventChange($event, oneSen.SENSOR_EVENT_REL_ID)'
                  style='width: 70%'
                >
                  <option
                    v-for='optionList in eventOption'
                    :key='optionList.EVENT_LIST_ID'
                    v-bind:value='optionList.EVENT_LIST_ID'
                  >
                    {{ optionList.EVENT_LIST_NAME }}
                  </option>
                </select>
              </div>
            </li>

            <button
              @click='addEvent(currentSensor)'
              style='margin-left: 40%; margin-top: 10px; margin-bottom: 10px'
            >
              <img src='~/assets/images/ico-plus-circle.png' />
            </button>

            <div>
              <button v-if='mode.add' class='delButton' @click='delSensor'>
                취소
              </button>
              <button v-if='mode.add' class='saveButton' @click='addNewSensor'>
                센서 추가
              </button>
            </div>
          </div>

          <div v-if='!imgChk' style='margin-top: 30px'>

            <c-button
              :buttonsrc="'ico-all'"
              name='전체'
              v-bind:clicked='chkClick[0]'
              @click='
                ;[
                  loadSensors(0),
                  buttonClick(0),
                  loadHumanIcon(1, 1),
                  drawSensorBound(),
                ]
              '
            ></c-button>

            <li
              class='sensor-event-list'
              v-for='eventList in sensorEventList'
              :key='eventList.SENSOR_EVENT_ID'
            >
              <c-button
                :buttonsrc="'ico-' + eventList.SENSOR_EVENT_NAME"
                v-bind:clicked='chkClick[eventList.SENSOR_EVENT_ID]'
                v-bind:name='eventList.SENSOR_EVENT_NAME'
                @click='[
                    loadSensors(eventList.SENSOR_EVENT_ID),
                    buttonClick(eventList.SENSOR_EVENT_ID),
                    drawSensorBound()]'
              ></c-button>
            </li>


            <c-button
              :buttonsrc="'ico-boundary'"
              v-bind:clicked='selectSensorEventVisible'
              @click='viewSensorsBound'
              name='센서 범위'
            ></c-button>

            <c-button
              :buttonsrc="'ico-edit'"
              v-bind:clicked='mode.modify'
              v-if='!mode.modify'
              @click='editSensor'
              name='편집 시작'
            />
            <c-button
              :buttonsrc="'ico-edit'"
              v-bind:clicked='mode.modify'
              v-else
              @click='saveSensor'
              name='편집 종료'
            />
            <c-button
              :buttonsrc="'ico-human'"
              @click='setHumanDefault'
              name='사람 초기화'
            ></c-button>

          </div>
        </div>

        <div class='indoor-third'>

          <div style='height: 600px;width: 100%; font-family: Pretendard-Regular'>
            <div style='height: 100%;'>
              <input
                ref='imgFile'
                type='file'
                class='offscreen'
                @change='changeFile'
              />
              <l-map
                ref='map'
                :zoom.sync='mapOptions.zoom'
                :center='mapOptions.center'
                :options='lMapOptions'
                :min-zoom='mapOptions.minZoom'
                :max-zoom='mapOptions.maxZoom'
                style='height: 100%; width: 100%'
                @ready='doSomethingOnReady()'
                :crs='mapOptions.crs'
              >
                <l-image-overlay :url='mapOptions.url' :bounds='mapOptions.bounds' />
                <l-control-zoom :position='mapOptions.zoomPosition' />
                <l-control class='example-custom-control'>
                  <p @click="$emit('close-modal')">X</p>
                </l-control>
                <l-control>
                  <p v-if='imgChk' class='indoor-add-image' @click='fileOpen'>이미지 추가</p>
                  <p v-else class='indoor-mod-image' @click='fileOpen'>이미지 편집</p>
                </l-control>

              </l-map>
            </div>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>


<script>
import {
  LMap, LTileLayer, LImageOverlay, LMarker, LControlLayers, LControlZoom,
  LControl, LPopup, LTooltip
} from 'vue2-leaflet'
import { CRS, latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import '../../assets/style/customInterior.scss'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import TEMP from '../../assets/TempData'
import CButton from '../Interior/CategoryButton'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'InDoorMap.vue',
  components: {
    LMap,
    LTileLayer,
    LImageOverlay,
    LMarker,
    LControlLayers,
    LControlZoom,
    LControl,
    LPopup,
    LTooltip,
    InfiniteLoading,
    CButton
  },
  computed: {
    ...mapState(TEMP.STORE_PATH.ATTACH, ['attachInfo']),
    ...mapState(TEMP.STORE_PATH.STORE, ['storeInfo']),
    ...mapState(TEMP.STORE_PATH.BUILDING, ['buildingInfo']),
    ...mapState(TEMP.STORE_PATH.SENSOR, [
      'divideInfo',
      'floorInfo',
      'sensorList',
      'currentSensor',
      'searchParam',
      'searchResponse',
      'selectSensorEventVisible'
    ]),
    ...mapState(TEMP.STORE_PATH.SENSOR_EVENT, [
      'sensorEventList',
      'eventOption'
    ]),

    ...mapGetters(TEMP.STORE_PATH.SENSOR, ['GET_SELECT_SENSOR_EVENT'])
  },
  created() {
    this.initIndoorMap()
  },
  mounted() {
    this.$refs.map.mapObject.on('click', this.onMapClick)
    this.$refs.map.mapObject.on('moveend', this.onMapMoveEnd)

  },
  data() {
    return {
      map: null,
      mapOptions: {
        url: '',
        center: [750, 750],
        zoom: 16,
        crs: CRS.Simple,
        minZoom: -2,
        maxZoom: 4,
        bounds: [[0, 0], [1500, 1500]],
        zoomPosition: 'topleft'
      },
      lMapOptions: {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: true,
        contextmenu: true,
        contextmenuWidth: 80,
        contextmenuItems: [
          {
            text: '센서 등록',
            callback: this.addSensor
          }
        ]
      },
      targetIcons: '',    // Icons
      mapBound: {
        northEast: null,
        southWest: null
      },
      lGroup: {
        layerGroup: '',
        layerBoundGroup: '',
        layerBoundGroupInvisible: '',
        layerChangeBoundGroup: ''
      },
      sensorEvent: {
        sensorClick: false,
        clickSensorIndex: null,
        oldIndex: null
      },
      mode: {
        modify: false,
        add: false,
        view: false
      },


      sensors: [],
      markers: [],
      sList: [],

      limit: 0,

      floor: {
        currentFloor: null,
        currentIndex: null
      },

      imgSrc: '',
      imgChk: false,
      chkClick: [true, false, false, false],
      properInfo: null,

      // 검색 관련
      search: {
        searchClicked: false,
        searchEnabled: true,
        infiniteId: +new Date()
      },
      // Event Test
      eventItems: {},
      human: ''

    }
  },
  props: {},
  methods: {
    ...mapActions(TEMP.STORE_PATH.ATTACH, [
      'FETCH_ATTACH_INFO',
      'UPDATE_ATTACH_INFO',
      'CREATE_ATTACH_INFO'
    ]),
    ...mapActions(TEMP.STORE_PATH.SENSOR, [
      'SEARCH_SENSOR',
      'FETCH_SENSOR_INFO',
      'FETCH_FLOOR_INFO',
      'FETCH_OUT_SENSOR_INFO',
      'FETCH_CURRENT_SENSOR'
    ]),
    ...mapMutations(TEMP.STORE_PATH.SENSOR, [
      'SET_EVENT_OPTION',
      'SET_DIVIDE_INFO',
      'SET_SEARCH_PARAM',
      'SET_CURRENT_SENSOR',
      'SET_SEARCH_RESPONSE_DEFAULT',
      'SET_SELECT_SENSOR_EVENT_VISIBLE',
      'SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT',
      'SET_SEARCH_PARAM_DEFAULT',
      'SET_CURRENT_SENSOR_DEFAULT',
      'SET_SELECT_SENSOR_EVENT_ID',

      'PUSH_SENSOR_EVENT',
    ]),
    ...mapActions(TEMP.STORE_PATH.SENSOR_EVENT, [
      'FETCH_EVENT_OPTION',
      'FETCH_SENSOR_EVENT_INFO'
    ]),


    ...mapActions('store/store', [
      'FETCH_STORE_INFO'
    ]),

    // [START] 버튼 이벤트 모음
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
          this.mapOptions.url = this.imgSrc
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
    /* l-map ready */
    doSomethingOnReady() {
      this.map = this.$refs.map.mapObject
      this.map.setView([750, 750], -1)

      this.lGroup.layerGroup = L.layerGroup().addTo(this.map)
      this.lGroup.layerBoundGroup = L.layerGroup().addTo(this.map)
      this.lGroup.layerBoundGroupInvisible = L.layerGroup().addTo(this.map) //0824추가
      this.lGroup.layerChangeBoundGroup = L.layerGroup().addTo(this.map) // 센서 Bound 변경 시 사용
    },
    /* MAP 우클릭 이벤트 센서 추가 */
    async addSensor(e) {

      if (this.mode.modify === true) {
        if (this.mode.add === true) {
          alert('진행중인 센서 추가를 먼저 완료 하세요')
        } else {
          if (this.sensorEvent.clickSensorIndex !== null) {
            this.sensors[this.sensorEvent.clickSensorIndex].setIcon(
              this.targetIcons.BLUE_ICON
            )
          }
          this.mode.add = true
          let idx = this.sensors.length
          let FloorId = null

          this.sensors[idx] = L.marker(e.latlng, {
            icon: this.targetIcons.RED_ICON,
            key: -idx,
            visible: true,
            draggable: true,
            name: 'new ' + idx,
            desc: 'new ' + idx,
            bound: 0,
            state: 'new',
            locX: e.latlng.lng,
            locY: e.latlng.lat
          })
            .on('click', this.onMarkerClick)
            .addTo(this.lGroup.layerGroup)
          FloorId = this.floor.currentFloor.FLOOR_ID

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
    /* Floor Display 버튼 클래스 변경 */
    async changeFloor(floor) {
      this.changeFloorClass(floor.FLOOR_ID)
      this.floor.currentFloor = floor
      this.clearSearch()
      this.SET_SEARCH_PARAM_DEFAULT()
      this.sensorEvent.sensorClick = false
      this.sensorEvent.clickSensorIndex = null
      this.sensorEvent.oldIndex = null
      this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
      /* 레이어 그룹 초기화 */
      this.clearLayerGroup(2)

      /* 팝업 Close */
      this.closeLpopup()

      const floorImg = { attachId: floor.ATTACH_ID }

      await this.FETCH_ATTACH_INFO(floorImg)
      await this.FETCH_SENSOR_INFO(this.floor.currentFloor.FLOOR_ID)
      this.mode.modify = false
      this.mode.add = false

      this.inFloorInit()

      this.imgSrc = this.attachInfo.IMG_SRC
      if (this.imgSrc === undefined) {
        // 이미지가 없는 경우, 이미지 추가하도록 유도 필요
        // 이미지가 없을때 imgChk 값 true
        this.imgChk = true
        this.mapOptions.url = require('~/assets/images/temp/add_img.png')
        this.map.options.minZoom = -2
        this.$refs.map.mapObject.setView([750, 750], -2)
        this.$refs.map.mapObject.dragging.disable()
        this.$refs.map.mapObject.scrollWheelZoom.disable()
        this.$refs.map.mapObject.doubleClickZoom.disable()
        this.$refs.map.mapObject.contextmenu.removeHooks()
      } else {
        this.imgChk = false
        this.mapOptions.url = this.imgSrc
        this.map.options.minZoom = -1
        this.$refs.map.mapObject.setView([750, 750], -1)
        this.$refs.map.mapObject.dragging.enable()
        this.$refs.map.mapObject.scrollWheelZoom.enable()
        this.$refs.map.mapObject.contextmenu.addHooks()
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
      }

      this.$refs.map.mapObject.setView([750, 750], -1)
    },

    /* Class 변경 */
    changeFloorClass(floorId) {
      console.log('changeFloorClass floorId ===> ', floorId)
      console.log('changeFloorClass this.floor.currentFloor ===> ', this.floor.currentFloor)
      if (this.floor.currentFloor !== null) {
        if (floorId !== this.floor.currentFloor.FLOOR_ID) {
          document.getElementById(floorId).className = 'on'
          document.getElementById(this.floor.currentFloor.FLOOR_ID).className = null
        }
      } else {
        document.getElementById(floorId).className = 'on'
      }
    },

    /* 엔터를 눌렀을 때 search가 실행되게하는 함수 */
    enterKeySearch() {
      if (window.event.keyCode === 13) {
        this.searchStart()
      }
    },

    /* */
    async searchStart() {
      if (this.search.searchEnabled) {
        if (this.search.searchClicked) {
          await this.clearSearch()
          if (this.$refs.infiniteLoading)
            this.$refs.infiniteLoading.stateChanger.reset()
        }
        this.search.searchClicked = true
      } else {
        alert('모든 검색이 완료될때까지 기다려주세요')
      }
    },

    /* -- */
    async infiniteHandler($state) {

      this.search.searchEnabled = false
      await this.SEARCH_SENSOR(this.limit)

      setTimeout(() => {
        if (this.searchResponse.length) {
          this.limit += 10
          this.sList.push(...this.searchResponse)
          $state.loaded()
          this.search.searchEnabled = true
        } else {
          this.search.searchEnabled = true
          $state.complete()
        }
      }, 1000)

    },

    /* 검색 결과 선택 */
    async onClickSearchResult(searchedVal) {

      const floor = this.floorInfo.filter(
        (data) => data.FLOOR_ID === searchedVal.FLOOR_ID
      )
      await this.changeFloor(floor[0])

      if (this.sensorEvent.oldIndex !== null) {
        this.sensors[this.sensorEvent.oldIndex].setIcon(this.targetIcons.BLUE_ICON)
      }
      this.sensorEvent.sensorClick = true
      this.sensorEvent.clickSensorIndex = this.sensors.findIndex(
        (i) => i.options.key === searchedVal.SENSOR_ID
      )
      this.sensorEvent.oldIndex = this.sensorEvent.clickSensorIndex
      await this.FETCH_CURRENT_SENSOR(searchedVal.SENSOR_ID)
      this.sensors[this.sensorEvent.clickSensorIndex].setIcon(this.targetIcons.RED_ICON)
      this.map.setView(
        [
          this.sensors[this.sensorEvent.clickSensorIndex].options.locY,
          this.sensors[this.sensorEvent.clickSensorIndex].options.locX
        ],
        -0.5
      )

      this.clearSearch()
      this.SET_SEARCH_PARAM_DEFAULT()

    },
    /* -- */
    addEvent(curSensor) {
      this.tempRelId = this.tempRelId - 1
      let sensor_event_id = null

      const data = {
        SENSOR_EVENT_ID: sensor_event_id,
        EVENT_LIST_ID: null,
        SENSOR_EVENT_REL_ID: this.tempRelId
      }
      this.PUSH_SENSOR_EVENT(data)
    },

    /* 센서 속성 삭제 */
    async deleteEvent(onesen) {
      if (this.currentSensor.SENSOR_EVENT_LIST.length === 1) {
        alert('속성은 반드시 1개 이상이여야합니다')
      } else {
        if (confirm('속성을 삭제하시겠습니까?') === true) {
          if (onesen.SENSOR_EVENT_REL_ID > 0) {
            await this.DELETE_SENSOR_EVENT(onesen.SENSOR_EVENT_REL_ID)
            await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
            await this.FETCH_CURRENT_SENSOR(this.currentSensor.SENSOR_ID)
          } else {
            await this.SET_SENSOR_EVENT_DEL(onesen.SENSOR_EVENT_REL_ID)
          }
        }
      }
    },

    /*  속성이 EVENT일때 하위 항목 select box 값 받아오기 */
    eventChange(event, relId) {
      let id = parseInt(event.target.value, 10)
      let data = {
        ID: id,
        SENSOR_EVENT_REL_ID: relId
      }
      this.SET_EVENT_OPTION(data)
    },

    /* 센서 삭제 */
    async delSensor() {
      if (confirm('정말 센서를 삭제하시겠습니까?') === true) {
        if (this.currentSensor.SENSOR_ID > 0) {
          await this.DELETE_ONE_SENSOR(this.currentSensor.SENSOR_ID)
        } else {
          this.mode.add = false
        }

        this.sensorEvent.clickSensorIndex = null
        this.sensorEvent.sensorClick = false
        this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
        await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
        this.$refs.map.mapObject.setView([750, 750], -1)
        await this.SET_CURRENT_SENSOR_DEFAULT()
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
      }
    },

    /* 센서 추가 */
    async addNewSensor() {

      if (
        this.currentSensor.BOUND === '' ||
        this.currentSensor.SENSOR_NAME === '' ||
        this.currentSensor.SENSOR_DESC === ''
      ) {
        alert('센서 정보를 반드시 입력하세요!')
      } else if (confirm('센서를 추가하시겠습니까?') === true) {

        let loc
        for (let i = 0; i < this.sensors.length; i++) {
          if (this.currentSensor.SENSOR_ID === this.sensors[i].options.key) {
            loc = this.sensors[i].getLatLng()
          }
        }

        await this.SET_CURRENT_SENSOR_LOC(loc)
        await this.SET_CURRENT_SENSOR_DV('IN')
        await this.CREATE_ONE_SENSOR(this.currentSensor)
        await this.CREATE_SENSOR_EVENT(this.currentSensor)
        await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
        await this.loadSensors(0)

        this.addMode = false
      }

    },
    buttonClick(index) {
      this.chkClick = [false, false, false, false]
      this.chkClick[index] = true
    },
    /* 사람 아이콘 그리기 */
    loadHumanIcon(lon, lat) {
      this.human = L.marker([lon, lat], {
        icon: this.targetIcons.HUMAN_ICON,
        key: 'human 1',
        visible: true,
        draggable: true,
        name: 'human',
        desc: 'human',
        locX: lon,
        locY: lat,
        latLng: [lon, lat]
      }).addTo(this.lGroup.layerGroup)
      this.sensorInBound(this.human)
    },

    /* 센서 범위 영역 그리기 */
    drawSensorBound() {
      if (!this.selectSensorEventVisible) {
        this.clearLayerGroup(1)
        return
      }
      /* 기존 센서 범위 레이어그룹 초기화 */
      this.clearLayerGroup(1)
      let senlist = this.GET_SELECT_SENSOR_EVENT
      let idx = 0
      let sensorsBounds = []
      let contents

      senlist.forEach((sensor) => {
        contents =
          `<html>
            <body>
              <h1 style='text-align:center'> - ${sensor.SENSOR_NAME} - </h1>
              <div style='width: 100%; height: 0px; border: 1px solid #003458; background: #003458;'></div>
              <div >
                <ul style='padding:10px;'>
                  <li style='list-style-type:circle'>설명 : ${sensor.SENSOR_DESC}</li>
                  <li style='list-style-type:circle'>범위 : ${sensor.BOUND}</li>
                </ul>
              </div>
            </body>
          </html>`

        sensorsBounds[idx] = L.circle(
          [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
          {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: sensor.BOUND
          }
        ).bindPopup(contents, { autoClose: false, autoPan: false }).addTo(this.lGroup.layerBoundGroup)
        //.openPopup()
        idx = idx + 1
      })
    },
    /* 센서 범위 */
    viewSensorsBound() {
      this.SET_SELECT_SENSOR_EVENT_VISIBLE()
      this.drawSensorBound()
    },
    /* 센서 편집 */
    editSensor() {
      if (this.sensorEvent.clickSensorIndex !== null) {
        this.sensors[this.sensorEvent.clickSensorIndex].dragging.enable()
      }
      this.mode.modify = true
    },
    /* 센서 편집모드 나가기 */
    async saveSensor() {
      await this.FETCH_SENSOR_INFO(this.currentFloor.FLOOR_ID)
      this.$refs.map.mapObject.setView([750, 750], -1)
      this.mode.modify = false
      this.mode.add = false
      // 레이어 초기화 및 센서 초기화
      this.chkClick = [true, false, false, false]
      this.SET_SELECT_SENSOR_EVENT_VISIBLE_DEFAULT()
      this.clearLayerGroup(2)
      await this.loadSensors(0)
      this.loadHumanIcon(1, 1)
    },
    /* 사람 초기화 */
    setHumanDefault() {
      this.clearEventLayer()
      this.human.setLatLng([1, 1])
      this.map.setView([750, 750], -1)
    },
    // [END] 버튼 이벤트 모음


    /* mapDivideInfoSetting : */
    async mapDivideInfoSetting() {

      const ids = {
        userId: 'test001',
        storeId: 52,
        userNo: 8
      }
      await this.FETCH_STORE_INFO(ids)

      const data = {
        TARGET_LAT: 37.37299198361456,     //위도
        TARGET_LNG: 126.94788681388624,    //경도
        TARGET_DV_CD: 'STORE',   //건물/가게
        TARGET_ID: 52,      //건물ID/가게ID
        TARGET_NM: '원체크 Coffee'
      }
      this.SET_DIVIDE_INFO(data)

    },

    /* 실내도 create call */
    async initIndoorMap() {

      // Demo Page 상점 정정보 설정
      await this.mapDivideInfoSetting()

      this.iconSettings()
      if (this.divideInfo.TARGET_DV_CD === 'STORE') {
        this.properInfo = this.storeInfo
      } else if (this.divideInfo.TARGET_DV_CD === 'BUILDING') {
        this.properInfo = this.buildingInfo
      }

      // // Demo Page
      // this.properInfo = {STORE_ID: 52}
      await this.FETCH_FLOOR_INFO(this.properInfo)

      await this.loadFloor1F()
      this.$refs.map.mapObject.setView([750, 750], -1)
      await this.FETCH_SENSOR_EVENT_INFO()
      await this.FETCH_EVENT_OPTION(this.divideInfo)
    },
    /* 1층 정보 가져오기 initInteriorModal call */
    async loadFloor1F() {
      const f1 = this.floorInfo.filter(
        (data) => data.FLOOR_NO === 1 && data.IS_GROUND === 'Y'
      )
      this.floor.currentFloor = f1[0] // 1층 정보
      // const doc = document.getElementById(this.floor.currentFloor.FLOOR_ID)
      // if(doc){
      //   doc.className = 'on'
      // }
      // document.getElementById(this.floor.currentFloor.FLOOR_ID).className = 'on' // 1층 클래스 변경
      const floorImg = { attachId: this.floor.currentFloor.ATTACH_ID }
      await this.FETCH_SENSOR_INFO(this.floor.currentFloor.FLOOR_ID)
      if (floorImg.attachId === null) {
        this.mapOptions.url = require('~/assets/images/temp/add_img.png')
        this.$refs.map.mapObject.setView([750, 750], 2)
        this.$refs.map.mapObject.dragging.disable()
        this.$refs.map.mapObject.scrollWheelZoom.disable()
        this.$refs.map.mapObject.doubleClickZoom.disable()
        // this.$refs.map.mapObject.contextmenu.removeHooks()
      } else {
        await this.FETCH_ATTACH_INFO(floorImg)
        this.imgSrc = this.attachInfo.IMG_SRC
        this.mapOptions.url = this.imgSrc
        this.$refs.map.mapObject.dragging.enable()
        this.$refs.map.mapObject.scrollWheelZoom.enable()
        this.$refs.map.mapObject.contextmenu.addHooks()
        this.imgChk = false
        this.loadSensors(0)
        this.loadHumanIcon(1, 1)
        this.$refs.map.mapObject.setView([750, 750], -1)
      }
      document.getElementById(this.floor.currentFloor.FLOOR_ID).className = 'on' // 1층 클래스 변경
    },
    /* icon Settings */
    iconSettings() {
      this.targetIcons = {
        RED_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/marker-icon-2x-red.png'),
          shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        BLUE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/marker-icon-2x-blue.png'),
          shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        HUMAN_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/customer.png'),
          iconSize: [50, 50],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        GOLD_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/marker-icon-2x-gold.png'),
          shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        GREEN_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/marker-icon-2x-green.png'),
          shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        VIOLET_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/marker-icon-2x-violet.png'),
          shadowUrl: require('~/assets/images/temp/marker-shadow.png'),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }

      this.eventItems.eventCoordinate = {
        CONVENIENCE_STORE_ICON: [37.37288489552112, 126.94226278639636],
        BAKERY_ICON: [37.371118104101654, 126.94307628224682],
        GAS_STATION_ICON: [37.36999906477972, 126.94645150634227],
        CAFE_ICON: [37.371739, 126.941723],
        KICK_ICON: [37.37055, 126.9403],
        TAXI_ICON: [37.37238, 126.94267]
      }

      this.eventItems.eventMessage = {
        CONVENIENCE_STORE_ICON: '삼각김밥 20% 할인',
        BAKERY_ICON: '오픈 기념 이벤트 케익 10% 할인',
        GAS_STATION_ICON: '1L당 80원 할인',
        CAFE_ICON: '전 메뉴 20%',
        KICK_ICON: '10분당 100원 할인',
        TAXI_ICON: '택시 정류장'
      }

      this.eventItems.eventMeter = {
        CONVENIENCE_STORE_ICON: '34M',
        BAKERY_ICON: '18M',
        GAS_STATION_ICON: '419M',
        CAFE_ICON: '82M',
        KICK_ICON: '82M',
        TAXI_ICON: '82M'
      }

      this.eventItems.eventIcons = {
        // 편의점
        CONVENIENCE_STORE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/gs25.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        // 빵집
        BAKERY_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/paris.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        // 주유소
        GAS_STATION_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/sk.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        // 카페
        CAFE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/starbuckslogo.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        KICK_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/kick.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        TAXI_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/taxi.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }

      this.eventItems.busEventIcons = {
        // 편의점
        CONVENIENCE_STORE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/gs25.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        // 빵집
        BAKERY_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/paris.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        KICK_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/kick.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }

      this.eventItems.busEventCoordinate = {
        CONVENIENCE_STORE_ICON: [37.36869, 126.93837],
        BAKERY_ICON: [37.37014, 126.93728],
        KICK_ICON: [37.37055, 126.9403]
      }

      this.eventItems.busEventMessage = {
        CONVENIENCE_STORE_ICON: '삼각김밥 20% 할인',
        BAKERY_ICON: '오픈 기념 이벤트 케익 10% 할인',
        KICK_ICON: '10분당 100원 할인'
      }

      this.eventItems.busEventMeter = {
        CONVENIENCE_STORE_ICON: '100M',
        BAKERY_ICON: '100M',
        KICK_ICON: '100M'
      }

      this.eventItems.busEventIcons2 = {
        // 편의점
        CONVENIENCE_STORE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/CU.jpg.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        // 빵집
        BAKERY_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/paris.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        }),
        CAFE_ICON: new L.Icon({
          iconUrl: require('~/assets/images/temp/starbuckslogo.png'),
          iconSize: [40, 40],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }

      this.eventItems.busEventCoordinate2 = {
        CONVENIENCE_STORE_ICON: [37.36954, 126.93699],
        BAKERY_ICON: [37.36805, 126.93787],
        CAFE_ICON: [37.36547, 126.92942]
      }

      this.eventItems.busEventMessage2 = {
        CONVENIENCE_STORE_ICON: '삼각김밥 20% 할인',
        BAKERY_ICON: '오픈 기념 이벤트 케익 10% 할인',
        CAFE_ICON: '전 메뉴 20%'
      }

      this.eventItems.busEventMeter2 = {
        CONVENIENCE_STORE_ICON: '200M',
        BAKERY_ICON: '200M',
        CAFE_ICON: '200M'
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

    onMapClick(e) {
      console.log(' onMapClick  ===>   lat : ', e.latlng.lat, '  lng : ', e.latlng.lng)
    },
    onMapMoveEnd(e) {

    },
    /* 검색결과 초기화 */
    clearSearch() {
      this.SET_SEARCH_RESPONSE_DEFAULT()
      this.search.searchClicked = false
      this.sList = []
      this.limit = 0
    },

    /* 실내도 설정 */
    inFloorInit() {
      this.FETCH_SENSOR_EVENT_INFO()
      this.map.setView(this.map.options.center, 18, { animate: true })
    },

    /* 팝업화면 Close */
    closeLpopup() {
      const map = this.map
      const popup = map._popup
      if (popup && popup.isOpen()) {
        map.closePopup()
      }
    },

    /* 센서 목록 불러오기 */
    loadSensors(eventId) {
      /* 팝업화면 Close */
      this.closeLpopup()

      let senlist = []
      this.sensorEvent.oldIndex = null
      this.SET_CURRENT_SENSOR_DEFAULT()
      this.sensorEvent.sensorClick = false
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

      senlist.forEach((sensor) => {
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
        )
          .on('click', this.onMarkerClick)
          .on('dragend', this.onMarkerDrag)
          .addTo(this.lGroup.layerGroup)
        const eventId = sensor.SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID
        this.setSensorIcons(eventId, idx)
        idx = idx + 1
      })
    },

    setSensorIcons(eventId, sensorIndex) {

      if (eventId === 1) {
        this.sensors[sensorIndex].setIcon(this.targetIcons.BLUE_ICON)
      }
      if (eventId === 2) {
        this.sensors[sensorIndex].setIcon(this.targetIcons.GOLD_ICON)
      }
      if (eventId === 3) {
        this.sensors[sensorIndex].setIcon(this.targetIcons.GREEN_ICON)
      }

    },

    /* 센서 이동 시 변경된 위치에 영역 표현 */
    onMarkerDrag(e) {
      // 신규 센서인 경우 작동 하지 않음
      if (e.target.options.state === 'new' && e.target.options.key < 0) {
        return
      }
      this.layerChangeBoundGroup.clearLayers()
      L.circle([e.target._latlng.lat, e.target._latlng.lng], {
        color: 'green',
        fillColor: '#2fff00',
        fillOpacity: 0.3,
        radius: this.currentSensor.BOUND
      }).addTo(this.layerChangeBoundGroup)
    },
    /* */
    async onMarkerClick(e) {

      const targetKey = e.target.options.key
      if (e.target.options.state === 'new' && targetKey < 0) {
        return
      }

      await this.FETCH_CURRENT_SENSOR(targetKey)

      if (this.sensorEvent.clickSensorIndex === '') {
        this.sensorEvent.clickSensorIndex = null
      }

      if (
        this.sensorEvent.oldIndex !== undefined &&
        this.sensorEvent.oldIndex !== null &&
        this.sensorEvent.clickSensorIndex !== null
      ) {
        if (this.sensors[this.sensorEvent.oldIndex].options.eventId === 1) {
          this.sensors[this.sensorEvent.oldIndex].setIcon(this.targetIcons.BLUE_ICON)
        }
        if (this.sensors[this.sensorEvent.oldIndex].options.eventId === 2) {
          this.sensors[this.sensorEvent.oldIndex].setIcon(this.targetIcons.GOLD_ICON)
        }
        if (this.sensors[this.sensorEvent.oldIndex].options.eventId === 3) {
          this.sensors[this.sensorEvent.oldIndex].setIcon(this.targetIcons.GREEN_ICON)
        }
        this.sensors[this.sensorEvent.clickSensorIndex].dragging.disable()
      }

      this.sensorEvent.sensorClick = true
      this.sensorEvent.clickSensorIndex = this.sensors.findIndex(
        (i) => i.options.key === targetKey
      )

      this.sensorEvent.oldIndex = this.sensorEvent.clickSensorIndex
      await this.FETCH_CURRENT_SENSOR(targetKey)
      e.target.setIcon(this.targetIcons.RED_ICON)

      if (this.mode.modify === true) {
        this.sensors[this.sensorEvent.clickSensorIndex].dragging.enable()
      }

      this.map.setView(e.target._latlng, -0.5)
      this.mode.view = false
    },
    /* layerGroup Clear */
    clearLayerGroup(aNumber) {
      if (aNumber === 0) {
        this.lGroup.layerGroup.clearLayers()
      } else if (aNumber === 1) {
        this.lGroup.layerBoundGroup.clearLayers()
      } else {
        this.lGroup.layerGroup.clearLayers()
        this.lGroup.layerBoundGroup.clearLayers()
        this.lGroup.layerChangeBoundGroup.clearLayers()
      }
    },

    /* */
    sensorInBound(sensor) {
      let _this = this
      const map = this.map
      const sl = this.sensorList
      let sensorsBounds = []
      let idx = 0

      sl.forEach((sensor) => {
        sensorsBounds[idx] = L.circle(
          [sensor.SENSOR_LOC_Y, sensor.SENSOR_LOC_X],
          {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0,
            opacity: 0,
            radius: sensor.BOUND
          }
        ).addTo(this.lGroup.layerBoundGroupInvisible) //0824수정
        idx = idx + 1
      })


      let popup = L.popup({ autoClose: false, autopan: true })


      // // Demo
      // const trandNm = 'Onecheck Coffee'
      //가게명
      const trandNm =
        this.divideInfo.TARGET_DV_CD === 'STORE'
          ? this.storeInfo.STORE_NAME
          : this.buildingInfo.BUILDING_NAME


      sensor.on('dragend', function(event) {
        let lst = []
        let mapbound = []
        const latlng = event.target.getLatLng()


        sensorsBounds.forEach((circle) => {
          let a =
            circle.getBounds().getCenter().lng - circle.getBounds().getWest()
          let b =
            circle.getBounds().getCenter().lat - circle.getBounds().getSouth()
          let x = latlng.lng - circle.getBounds().getCenter().lng
          let y = latlng.lat - circle.getBounds().getCenter().lat
          mapbound.push((x * x) / (a * a) + (y * y) / (b * b))
        })


        for (let i = 0; i < mapbound.length; i++) {
          if (mapbound[i] <= 1) {
            const eventId = sl[i].SENSOR_EVENT_LIST[0].SENSOR_EVENT_ID
            const strMsg = (eventId === 1) ? _this.setStringAccess(sl[i])
              : (eventId === 2) ? _this.setStringPayment(sl[i]) : _this.setStringEvent(sl[i])
            lst.push(strMsg)
          }
        }


        if (lst.length !== 0) {
          //기존 : alert()
          //수정 : 영역범위 내 팝업 이벤트 표시(2021.09.01)
          let popupLatlng = [latlng.lat + 50, latlng.lng + 20]
          popup.setLatLng(popupLatlng).setContent(lst[0]).openOn(map)
        } else {
          if (popup.isOpen()) {
            //영역범위 벗어 났을 때
            //Open 되어 있는 팝업 Close
            map.closePopup()
          }
        }
      })
    },

    setStringAccess(eventList) {

      // // Demo
      // const trandNm = 'Onecheck Coffee'

      //가게명
      const trandNm =
        this.divideInfo.TARGET_DV_CD === 'STORE'
          ? this.storeInfo.STORE_NAME
          : this.buildingInfo.BUILDING_NAME

      const msgOne = `오늘도 저희 ${trandNm}를 찾아주신 <br> 고객여러분 대단히 고맙습니다.`
      const msgTwo = '방문 확인 되었습니다.'


      const contents =
        `<html>
            <body>
              <h1 style='text-align:center'> - ${msgOne} - </h1>
              <div style='width: 100%; height: 0px; border: 1px solid #003458; background: #003458;'></div>
              <div >
                <ul style='padding:10px;'>
                  <li style='list-style-type:circle'>${msgTwo}</li>
                </ul>
              </div>
            </body>
          </html>`

      return contents
    },
    setStringPayment(eventList) {

      // // Demo
      // const trandNm = 'Onecheck Coffee'

      const trandNm =
        this.divideInfo.TARGET_DV_CD === 'STORE'
          ? this.storeInfo.STORE_NAME
          : this.buildingInfo.BUILDING_NAME

      const msgOne = `오늘도 저희 ${trandNm}를 찾아주신 <br> 고객여러분 대단히 고맙습니다.`
      const msgTwo = '결제 완료되었습니다.'


      const contents =
        `<html>
            <body>
              <h1 style='text-align:center'> - ${msgOne} - </h1>
              <div style='width: 100%; height: 0px; border: 1px solid #003458; background: #003458;'></div>
              <div >
                <ul style='padding:10px;'>
                  <li style='list-style-type:circle'>${msgTwo}</li>
                </ul>
              </div>
            </body>
          </html>`

      return contents
    },
    setStringEvent(eventList) {

      // // Demo
      // const trandNm = 'Onecheck Coffee'

      const trandNm =
        this.divideInfo.TARGET_DV_CD === 'STORE'
          ? this.storeInfo.STORE_NAME
          : this.buildingInfo.BUILDING_NAME

      const eventName = eventList.SENSOR_EVENT_LIST[0].EVENT_LIST_NAME
      const eventDesc = eventList.SENSOR_EVENT_LIST[0].EVENT_LIST_DESC

      const msgOne = `${trandNm}의 쿠폰이 발행되었습니다.`
      const msgTwo = `${eventName} : ${eventDesc}`


      const contents =
        `<html>
            <body>
              <h1 style='text-align:center'> - ${msgOne} - </h1>
              <div style='width: 100%; height: 0px; border: 1px solid #003458; background: #003458;'></div>
              <div >
                <ul style='padding:10px;'>
                  <li style='list-style-type:circle'>${msgTwo}</li>
                </ul>
              </div>
            </body>
          </html>`

      return contents
    },
    /* event */
    clearEventLayer() {
      this.map.closePopup()
      if (L.popup().isOpen()) {
        L.popup().removeFrom(this.map)
      }
    }
  }


}
</script>

<style scoped>
/* Modal */
.indoor,
.indoor .indoor-overlay {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 1;
  /*position: fixed;*/
  /*background-color: black;*/
}

.indoor .indoor-card {
  /*position: relative;*/
  width: 100%;

  /*margin: 30px auto auto;*/
  /*background-color: white;*/
  min-height: 700px;
  opacity: 1;
}

/* 화면 분할 */
.indoor-card .indoor-first {
  /*height: 765px;*/
  height: 600px;
  background-color: #5a5656;
  float: left;
  width: 5%;
  box-sizing: border-box;
  overflow: auto;
  -ms-overflow-style: none;
}

.indoor-first::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

.indoor-first .first-top {
  width: 100%;
  /*min-width: 50px;*/
  height: 10%;
  background: #4f555f;
  font-size: 14px;
  color: #ccc;
  text-align: center;
  line-height: 50px;
}

.indoor-second {
  height: 600px;
  background-color: white;
  float: left;
  width: 21%;
  box-sizing: border-box;
  overflow: auto;
}

.indoor-third {
  display: flex;
  /*height: 765px;*/
  background-color: rgba(248, 242, 245, 0.99);
  float: right;
  width: 74%;
  box-sizing: border-box;
}

.indoor-mod-image {
  /*position: fixed;*/
  top: 745px;
  right: 200px;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 18px;
  padding: 6px 25px;
  background-color: #e77529;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.indoor-add-image {
  /*position: fixed;*/
  top: 680px;
  right: 686px;
  border: 1px solid #aaa;
  border-radius: 0.1em;
  font-size: 18px;
  padding: 6px 25px;
  background-color: #e77529;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.floors-container li button {
  display: block;
  width: 100%;
  height: 45px;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: -0.5px;
  text-align: center;
  color: rgb(131, 131, 131);
}

.floors-container li button.on {
  background: #fff;
  color: #454545;
}

</style>
