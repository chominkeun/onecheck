<template xmlns:v-on='http://www.w3.org/1999/xhtml' xmlns:v-bind='http://www.w3.org/1999/xhtml'>
  <div class='cont-box' style='width: 100%; height: 100%; margin:0;, padding:0px'>
    <div class='demo'>
      <div
        id='tabs'
        class='.container'
      >
        <div class='tabs'>
          <a
            v-on:click='activetab = 1'
            v-bind:class="[activetab === 1 ? 'active' : '']"
          >실외도 Map</a
          >
          <a
            v-on:click='activetab = 2'
            v-bind:class="[activetab === 2 ? 'active' : '']"
          >실내도 Video</a
          >
          <a
            v-on:click='activetab = 3'
            v-bind:class="[activetab === 3 ? 'active' : '']"
          >지하철 Video</a
          >
          <a
            v-on:click='activetab = 4'
            v-bind:class="[activetab === 4 ? 'active' : '']"
          >버스 Video</a
          >
          <a
            v-on:click='activetab = 5'
            v-bind:class="[activetab === 5 ? 'active' : '']"
          >실내도 Map</a
          >
        </div>

        <div class='content'>
          <div v-show='activetab === 1' class='tabcontent'>
            <out-door-map />
            <br /><br />
          </div>
          <div v-show='activetab === 2' class='tabcontent'>
            <video width='100%'  height='550px' :autoplay='false' muted controls>
              <source :src='videoIndoorUrl'  :type='videoType' />
            </video>
          </div>
          <div v-show='activetab === 3' class='tabcontent'>
            <video width='100%'  height='550px' :autoplay='false' muted controls>
              <source :src='videoSubwayUrl' :type='videoType' />
            </video>
          </div>
          <div v-show='activetab === 4' class='tabcontent'>
            <video  width='100%'  height='550px' :autoplay='false' muted controls>
              <source :src='videoBusUrl' :type='videoType' />
            </video>
          </div>
          <div v-show='activetab === 5' class='tabcontent'>
            <in-door-map />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OutDoorMap from '../components/Map/OutDoorMap'
import InDoorMap from '../components/Map/InDoorMap'

export default {
  name: 'OckDemo.vue',
  components: {
    OutDoorMap,
    InDoorMap
  },
  data() {
    return {
      videoSubwayUrl: require('~/assets/video/지하철 타겟마케팅.mp4'),
      videoBusUrl: require('~/assets/video/버스 타겟마케팅.mp4'),
      videoIndoorUrl: require('~/assets/video/실내 결제&마케팅.mp4'),
      videoType: 'video/mp4',
      isSubway: false,
      isBus: false,
      isIndoor: false,
      isOutdoor: false,
      activetab: 1
    }
  },
  methods: {
    ockDemo1() {
    }
  }
}
</script>

<style scoped>
</style>
