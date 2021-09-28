<template>
  <div v-if="loading" class="loading-page">
    <svg class="loading-spinner">
      <circle
        :cx="circlePositions[index] && circlePositions[index].x"
        :cy="circlePositions[index] && circlePositions[index].y"
        :r="item.radius"
        :fill="item.color"
        v-for="(item, index) in circles"
        :key="index"/>
    </svg>
  </div>
</template>

<script>
const CENTER_X = 50;
const CENTER_Y = 50;
const RADIUS = 20;

function positionOnCircle(radius, angle, center) {
  return {
    x: center.x + (radius * Math.cos(toRadians(angle))),
    y: center.y + (radius * Math.sin(toRadians(angle)))
  };
};

function toRadians(angle) {
  return angle * Math.PI / 180;
};

function calculatePositions(component) {
  let angleIncrement = 360 / component.circles.length;
  let positions = {};
  component.circles.forEach((circle, index) => {
    positions[index] = positionOnCircle(
      RADIUS,
      angleIncrement * index,
      {x: CENTER_X, y: CENTER_Y}
    )
  });
  return positions;
}

export default {
  data() {
    return {
      circles: [
        {color: '#E0F2F1', radius: 0},
        {color: '#B2DFDB', radius: 0},
        {color: '#80CBC4', radius: 0},
        {color: '#4DB6AC', radius: 0},
        {color: '#26A69A', radius: 0},
        {color: '#00897B', radius: 0},
        {color: '#00796B', radius: 0},
        {color: '#00695C', radius: 0},
        {color: '#004D40', radius: 0},
      ],
      counter: 0,
      interval: null,
      loading: false
    }
  },
  computed: {
    circlePositions: calculatePositions
  },
  created() {
    this.interval = setInterval(() => {
      this.counter++;
      this.circles = this.circles.map((item, index) => ({
        ...item,
        radius: (this.counter + index) % 8
      }));
    }, 70);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style scoped>

.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}

.loading-spinner {
  width: 100px;
  height: 100px;
}
</style>
