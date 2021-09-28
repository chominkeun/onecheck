<template>
  <div id="googleMap">
    <GmapMap
      :center="latLot"
      :zoom="19"
      map-style-id="roadmap"
      :options="mapOptions"
      style="width: 100%; height: 350px"
      @click="handleMarker"
    >
      <GmapMarker
        :position="latLot"
        :draggable="editable"
        @drag="handleMarker"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  computed: {
    latLot() {
      return { lat: this.lat, lng: this.lot }
    }
  },
  props: {
    lat: {
      type: Number,
      default: 0
    },
    lot: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mapOptions: {
        disableDefaultUI: true
      }
    }
  },
  methods: {
    handleMarker(e) {
      if (this.editable) {
        let lat = e.latLng.lat()
        let lot = e.latLng.lng()
        this.updateLatLot(lat, lot)
      }
    },
    updateLatLot(lat, lot) {
      this.$emit('update', { lat, lot })
    }
  }
}
</script>

<style></style>
