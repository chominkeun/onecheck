<template>
  <div style='height: 550px; min-height: 300px; width: 100%; font-family: Pretendard-Regular'>
    <div style='height: 10%;'>
      <div>
        <c-button
          :buttonsrc="'ico-boundary'"
          v-bind:clicked='selectSensorEventVisible'
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
    </div>
    <div style='height: 90%;'>
      <l-map
        ref='map'
        :zoom='mapOptions.zoom'
        :center='mapOptions.center'
        :options='lMapOptions'
        style='height: 100%; width: 100%'
        :crs='mapOptions.crs'
      >
        <l-tile-layer :url=mapOptions.url></l-tile-layer>
      </l-map>
    </div>
  </div>

</template>


<script>
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import TEMP from '../../assets/TempData'
import CButton from '../Interior/CategoryButton'

import { CRS, latLng } from 'leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    CButton
  },
  computed: {
    ...mapState(TEMP.STORE_PATH.STORE, ['storeInfo']),
    ...mapState(TEMP.STORE_PATH.BUILDING, ['buildingInfo']),
    ...mapState(TEMP.STORE_PATH.SENSOR, [
      'sensorList',
      'selectSensorEventVisible',
      'divideInfo'
    ]),
    ...mapGetters(TEMP.STORE_PATH.SENSOR, ['GET_SELECT_SENSOR_EVENT'])
  },
  created() {
  },
  mounted() {
    this.map = this.$refs.map.mapObject
    this.map.on('moveend', this.onMapMoveEnd)
    this.initOutDoorMap()
  },
  data() {
    return {
      map: null,
      mapOptions: {
        url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
        center: [37.372374050971835, 126.94337458660783],
        zoom: 16,
        crs: CRS.EPSG3857
      },
      lMapOptions: {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: true,
        contextmenu: true,
        contextmenuWidth: 80,
        contextmenuItems: [
          {
            text: '가게 등록',
            callback: this.addSensor
          }
        ]
      },
      targetIcons: '',
      eventItems: {},
      human: '',
      northEast: null,
      southWest: null,
      //building or store info
      properInfo: null,
      sensors: [], //센서,
      layerGroup: '', //센서 그룹
      layerBoundGroup: '', //센서 영역 그룹
      layerBoundGroupInvisible: '', //0824추가
      layerChangeBoundGroup: '', // 센서 변경 시 사용
      sensorClick: false,
      clickSensorIndex: null,
      oldIndex: null,
      isModifyMode: false,
      markers: []
    }
  },
  props: {},
  methods: {
    ...mapActions(TEMP.STORE_PATH.SENSOR, [
      'FETCH_OUT_SENSOR_INFO',
      'FETCH_CURRENT_SENSOR'
    ]),
    ...mapMutations(TEMP.STORE_PATH.SENSOR, [
      'SET_SELECT_SENSOR_EVENT_VISIBLE'
    ]),
    ...mapActions(TEMP.STORE_PATH.SENSOR_EVENT, [
      'FETCH_SENSOR_EVENT_INFO'
    ]),
    /* Button Event List [Start] */

    /* Button Event List [End] */

    /* */
    initOutDoorMap() {
      // 마커 정보 설정
      this.loadIconSettings()

      // leaflet 정보 설정
      this.loadLeafletSettings()

      // 정보 불러오기
      this.loadOutDoorMap()
    },
    loadLeafletSettings() {
      this.map = this.$refs.map.mapObject
      this.layerGroup = L.layerGroup().addTo(this.map)
      this.layerBoundGroup = L.layerGroup().addTo(this.map)
      this.layerBoundGroupInvisible = L.layerGroup().addTo(this.map) //0824추가
      this.layerChangeBoundGroup = L.layerGroup().addTo(this.map) // 센서 Bound 변경 시 사용
    },
    /* 실외도 설정 */
    loadOutDoorMap() {
      this.FETCH_SENSOR_EVENT_INFO()
      this.loadHumanIcon(37.372374050971835, 126.94337458660783)
      this.northEast = null
      this.southWest = null

      this.map.setView(
        this.map.options.center,
        this.map.options.zoom,
        { animate: true }
      )

    },
    async onMapMoveEnd(e) {
      this.reLoadZoomCheck()
        ? this.clearZoomLevel()
        : (this.northEast === null)
          ? await this.setMapBounds()
          : await this.reLoadMapCheck()
    },
    async setMapBounds() {
      const offset = 2
      const bounds = this.map.getBounds()

      this.northEast = bounds._northEast
      this.northEast.lat += offset / 1000
      this.northEast.lng += offset / 1000
      this.southWest = bounds._southWest
      this.southWest.lat -= offset / 1000
      this.southWest.lng -= offset / 1000
      await this.loadOutSensorList() // DB 조회
    },
    reLoadZoomCheck() {
      let loadChange = false
      const zoomLevel = this.map.getZoom()
      if (zoomLevel < 15) {
        loadChange = true
      }
      return loadChange
    },
    clearZoomLevel() {
      //TODO: 초기화 작업 필요
      console.log('Zoom level 15 up icon clear')
      this.clearLayerGroup(0)
      this.northEast = null
    },
    async reLoadMapCheck() {
      console.log('reLoadMapCheck')

      let loadChange = false
      const bounds = this.map.getBounds()
      if (
        bounds._northEast.lat > this.northEast.lat ||
        bounds._northEast.lng > this.northEast.lng ||
        bounds._southWest.lat < this.southWest.lat ||
        bounds._southWest.lng < this.southWest.lng
      ) {
        loadChange = true
      }
      if (loadChange) {
        console.log('setMapBounds')
        this.clearEventLayer()
        await this.setMapBounds()
      }
    },
    async loadOutSensorList() {
      const mapBounds = {
        NORTHEAST: { LAT: this.northEast.lat, LNG: this.northEast.lng },
        SOUTHWEST: { LAT: this.southWest.lat, LNG: this.southWest.lng }
      }
      console.log('mapBounds->', mapBounds)
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

      this.sensorList.forEach((sensor) => {
        let storeBuildingInfo
        if (sensor.SENSOR_TARGET_DV_CD === 'STORE') {
          storeBuildingInfo = sensor.storeInfo
        } else {
          storeBuildingInfo = sensor.buildingInfo
        }
        let photoImg = `<center><img src='{1}' height='100px' width='100px'/></center>`
        let existImg = false
        //사진데이터가 빈 공백('')으로 들어가는 경우가 존재
        if (storeBuildingInfo && storeBuildingInfo.IMG_SRC !== '') {
          existImg = true
        }
        const replace = existImg
          ? storeBuildingInfo.IMG_SRC
          : 'https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg'
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
        let MarkIcon = this.targetIcons.BLUE_ICON
        //임의의 고정된 가게 => GOLD_ICON
        if (
          sensor.SENSOR_ID === 149 ||
          sensor.SENSOR_ID === 150 ||
          sensor.SENSOR_ID === 152
        ) {
          MarkIcon = this.targetIcons.GOLD_ICON
        }
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
        )
          .on('click', this.onMarkerClick)
          .addTo(this.layerGroup)
          .bindPopup(contents, { autoClose: false, autoPan: false })
        idx = idx + 1
      })
      this.loadHumanIcon(this.humanLoc[0], this.humanLoc[1])
      if (this.selectSensorEventVisible) {
        const senlist = this.GET_SELECT_SENSOR_EVENT
        let idx = 0
        let sensorsBounds = []
        senlist.forEach((sensor) => {
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

    async onMarkerClick(e) {
      // 신규 센서인 경우 작동 하지 않음
      if (e.target.options.state === 'new' && e.target.options.key < 0) {
        return
      }

      await this.FETCH_CURRENT_SENSOR(e.target.options.key)

      if (this.clickSensorIndex === '') {
        this.clickSensorIndex = null
      }
      if (
        this.oldIndex !== undefined &&
        this.oldIndex !== null &&
        this.clickSensorIndex !== null
      ) {
        if (
          this.sensors[this.oldIndex].options.key === 149 ||
          this.sensors[this.oldIndex].options.key === 150 ||
          this.sensors[this.oldIndex].options.key === 152
        ) {
          this.sensors[this.oldIndex].setIcon(this.targetIcons.GOLD_ICON)
        } else {
          this.sensors[this.oldIndex].setIcon(this.targetIcons.BLUE_ICON)
        }
        this.sensors[this.clickSensorIndex].dragging.disable()
      }
      this.sensorClick = true
      this.clickSensorIndex = this.sensors.findIndex(
        (i) => i.options.key === e.target.options.key
      )
      this.oldIndex = this.clickSensorIndex
      await this.FETCH_CURRENT_SENSOR(e.target.options.key)
      e.target.setIcon(this.targetIcons.RED_ICON)

      let zoomLevel = -0.5
      zoomLevel = 17
      // setView 변경
      this.map.setView(e.target._latlng, zoomLevel)
    },

    viewSensorsBound() {
      this.SET_SELECT_SENSOR_EVENT_VISIBLE()
      this.drawSensorBound()
    },

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
        contents = `<html>
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
        )
          .bindPopup(contents, { autoClose: false, autoPan: false })
          .addTo(this.layerBoundGroup)
        //.openPopup()
        idx = idx + 1
      })
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
        this.layerChangeBoundGroup.clearLayers()
      }
    },

    setOutEventIcons(iconObj, coordinateObj, msgObj, meterObj) {
      let coordinate, msg
      let iconList = []
      let msgList = []
      let meterList = []

      for (const [key, value] of Object.entries(iconObj)) {
        iconList.push(value.options.iconUrl)
        coordinate = coordinateObj[key]
        meterList.push(meterObj[key])
        msg = `<center> ${msgObj[key]} </center>`
        msgList.push(msg)
        let find = this.markers.find((item) => {
          return item.options.name === msg
        })
        if (!find) {
          this.markers.push(
            L.marker(coordinate, {
              icon: value,
              visible: true,
              draggable: false,
              name: msg,
              desc: msg,
              latLng: coordinate
            })
              .addTo(this.layerGroup)
              .bindPopup(msg, { autoClose: false, autoPan: true })
            // .openPopup()
          )
        }
      }

      let data = {}
      data.iconList = iconList
      data.msgList = msgList
      data.meterList = meterList

      return data
    },
    /* 이벤트 바인드 팝업 html 설정 */
    setOutEventBindPopHtml(iconList, msgList, meterList) {

      let popStr = ''
      let popTemp
      let step

      for (step = 0; step < iconList.length; step++) {
        popTemp = this.setOutEventBindPop(iconList[step], msgList[step], meterList[step])
        popStr = popStr + popTemp
      }

      let msg = `<html>
                <body>`
      const lastMsg = `<div style=width:100%; height: 0px; border: 1px solid #003458;background: #003458; />
                </body>
              </html>`

      msg = msg + popStr
      msg = msg + lastMsg

      return msg
    },
    /* 이벤트 바인드 팝업 설정 */
    setOutEventBindPop(iconObj, msgObj, meter) {
      const strMsg = `<div class='Lpopup-Container-OutMode'>
          <div class='Lpopup-ImageContainer-OutMode'>
            <img src='${iconObj}' />
          </div>
          <div class='Lpopup-ContentContainer-OutMode'>
            <div>
              <span class='leftContent'>${msgObj}</span>
              <span class='rightContent'>${meter}</span>
            </div>
          </div>
        </div>`

      return strMsg
    },
    /* 실외도 이벤트 */
    setOutModeString(eventList) {
      if (eventList.SENSOR_ID === 140) {
        // 금정역 이벤트
        let iconList = []
        let msgList = []
        let meterList = []

        const iconObj = this.eventItems.eventIcons
        const coordinateObj = this.eventItems.eventCoordinate
        const msgObj = this.eventItems.eventMessage
        const meterObj = this.eventItems.eventMeter
        const objData = this.setOutEventIcons(
          iconObj,
          coordinateObj,
          msgObj,
          meterObj
        )
        iconList = objData.iconList
        msgList = objData.msgList
        meterList = objData.meterList

        const msg = this.setOutEventBindPopHtml(iconList, msgList, meterList)
        return msg
      } else if (eventList.SENSOR_ID === 136) {
        // 삼성아파트 버스 정류소 이벤트
        let iconList = []
        let msgList = []
        let meterList = []

        const iconObj = this.eventItems.busEventIcons
        const coordinateObj = this.eventItems.busEventCoordinate
        const msgObj = this.eventItems.busEventMessage
        const meterObj = this.eventItems.busEventMeter
        const objData = this.setOutEventIcons(
          iconObj,
          coordinateObj,
          msgObj,
          meterObj
        )
        iconList = objData.iconList
        msgList = objData.msgList
        meterList = objData.meterList

        const msg = this.setOutEventBindPopHtml(iconList, msgList, meterList)
        return msg
      } else if (eventList.SENSOR_ID === 139) {
        // 삼성아파트 버스 정류소 이벤트

        let iconList = []
        let msgList = []
        let meterList = []
        const iconObj = this.eventItems.busEventIcons2
        const coordinateObj = this.eventItems.busEventCoordinate2
        const msgObj = this.eventItems.busEventMessage2
        const meterObj = this.eventItems.busEventMeter2
        const objData = this.setOutEventIcons(
          iconObj,
          coordinateObj,
          msgObj,
          meterObj
        )
        iconList = objData.iconList
        msgList = objData.msgList
        meterList = objData.meterList

        const msg = this.setOutEventBindPopHtml(iconList, msgList, meterList)
        return msg
      } else {
        return `${eventList.SENSOR_NAME}에 방문했습니다!`
      }
    },

    loadIconSettings() {

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
        KICK_ICON: [37.37055, 126.94030],
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
        KICK_ICON: [37.37055, 126.94030]
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

    loadHumanIcon(lng, lat) {
      this.human = L.marker([lat, lng], {
        icon: this.targetIcons.HUMAN_ICON,
        key: 'human 1',
        visible: true,
        draggable: true,
        name: 'human',
        desc: 'human',
        locX: lng,
        locY: lat,
        latLng: [lng, lat]
      }).addTo(this.layerGroup)
      this.sensorInBound(this.human)
    },

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
            radius: sensor.BOUND,
            id: sensor.SENSOR_ID
          }
        ).addTo(this.layerBoundGroupInvisible) //0824수정
        idx = idx + 1
      })

      let popup = L.popup()

      sensor.on('dragend', function(event) {
        let lst = []
        let mapBound = []
        const latLng = event.target.getLatLng()

        sensorsBounds.forEach((circle) => {
          let a =
            circle.getBounds().getCenter().lng - circle.getBounds().getWest()
          let b =
            circle.getBounds().getCenter().lat - circle.getBounds().getSouth()
          let x = latLng.lng - circle.getBounds().getCenter().lng
          let y = latLng.lat - circle.getBounds().getCenter().lat
          mapBound.push((x * x) / (a * a) + (y * y) / (b * b))
        })

        _this.clearEventLayer()

        for (let i = 0; i < mapBound.length; i++) {
          if (mapBound[i] <= 1) {
            const strMsg = _this.setOutModeString(sl[i])
            lst.push(strMsg)
            var index = i
          }
        }

        if (lst.length !== 0) {
          //기존 : alert()
          //수정 : 영역범위 내 팝업 이벤트 표시(2021.09.01)
          const bounds = _this.map.getBounds()
          console.log(bounds)
          console.log(sensorsBounds[index])
          let popupLatLng = _this.setPopupLatLng(sensorsBounds[index], latLng)

          popup
            .setLatLng(popupLatLng)
            .setContent(lst[0])
            .openOn(map, { autoClose: false })
        }
      })
    },
    setPopupLatLng(sensor, latLng) {
      console.log(latLng)
      let popupLatLng
      const bounds = this.map.getBounds()
      if (this.map._zoom === 16) {
        if (sensor.options.id === 140) {
          popupLatLng = [bounds._northEast.lat - 0.00389, bounds._northEast.lng - 0.00389]
        } else if (sensor.options.id === 136 ||
          sensor.options.id === 139
        ) {
          popupLatLng = [bounds._northEast.lat - 0.00239, bounds._northEast.lng - 0.00389]
        } else {
          popupLatLng = [latLng.lat + 0.00059, latLng.lng + 0.00049]
        }
      }

      if (this.map._zoom === 17) {
        if (sensor.options.id === 140) {
          popupLatLng = [bounds._northEast.lat - 0.00195, bounds._northEast.lng - 0.00189]
        } else if (sensor.options.id === 136 ||
          sensor.options.id === 139
        ) {
          popupLatLng = [bounds._northEast.lat - 0.00119, bounds._northEast.lng - 0.00189]
        } else {
          popupLatLng = [latLng.lat + 0.00034, latLng.lng + 0.00025]
        }
      }

      return popupLatLng
    },
    clearEventLayer() {
      if (this.markers.length) {
        // 영역범위 벗어났을 경우
        // 임의로 생성 된 Marer들 삭제 처리(시연용)
        // 추후 변경 예정
        // _this.marker는 금정역 주변 하드코딩 처리 되어 있음
        for (const marker of this.markers) {
          this.map.removeLayer(marker)
        }
        this.markers = []
      }

      this.map.closePopup()
      if (L.popup().isOpen()) {
        L.popup().removeFrom(this.map)
      }
    }
  }
}

</script>

<style>
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

.Lpopup-Container {
  width: 300px;
  height: 100px;
}

.Lpopup-Container-OutMode {
  width: 350px;
  height: 30px;
}

.Lpopup-Container .Lpopup-ImageContainer {
  width: 30%;
  height: 100%;
  padding: 5px;
  float: left;
}

.Lpopup-Container-OutMode .Lpopup-ImageContainer-OutMode {
  width: 20%;
  text-align: center;
  height: 100%;
  float: left;
}

.Lpopup-Container-OutMode .Lpopup-ContentContainer-OutMode {
  width: 80%;
  padding-top: 5px;
  float: right;
}

.Lpopup-Container-OutMode .Lpopup-ContentContainer-OutMode .leftContent {
  width: 70%;
  float: left;
}

.Lpopup-Container-OutMode .Lpopup-ContentContainer-OutMode .rightContent {
  width: 30%;
  float: right;
}

.Lpopup-Container .Lpopup-ContentContainer {
  width: 70%;
  padding-left: 10px;
  float: right;
}

.Lpopup-Container .Lpopup-ContentContainer ul {
  padding: 10px;
}

.Lpopup-Container .Lpopup-ContentContainer ul li {
  list-style-type: circle;
}

.Lpopup-Container .Lpopup-ContentContainer .Lpopup-Line {
  width: 100%;
  height: 0px;
  border: 1px solid #003458;
  background: #003458;
}

.Lpopup-Container .Lpopup-ImageContainer image {
  height: 100%;
}
</style>
