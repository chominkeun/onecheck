<template>
  <v-popup :is-open="popVisible" @close="popVisible = false">
    <template slot="header">
      <p class="pop-tit noline">옵션선택</p>
    </template>
    <template slot="body">
      <div class="apply-box">
        <button class="btn-type4 st7">
          <i class="ico i-chk-circle"></i>적용
        </button>
      </div>
      <div class="option-box">
        <ul>
          <li>
            <label class="inp-chk type2">
              <input type="checkbox" checked="" />
              <span class="ic"></span>
              <span class="t">온도</span>
            </label>
            <ul>
              <li>ICED (기본)</li>
              <li>HOT</li>
            </ul>
          </li>
          <li>
            <label class="inp-chk">
              <input type="checkbox" checked="" />
              <span class="ic"></span>
              <span class="t">온도</span>
            </label>
            <ul>
              <li>ICED (기본)</li>
              <li>HOT</li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
  </v-popup>
</template>

<script>
export default {
  props: {
    popVisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style></style>
