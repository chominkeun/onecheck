<template>
  <div class='cont-box' style='width: 100%; height: 100%; margin-top: 0px'>
    <out-door-map />
  </div>
</template>

<script>
import OutDoorMap from '../components/Map/OutDoorMap'

export default {
  components: {
    OutDoorMap
  },
  created() {
    window.scrollTo(120, 120)
  },
  mounted() {
    window.scrollTo(120, 120)
  },
  computed: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

