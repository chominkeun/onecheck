<template>
  <div class="cont-box">
    <h2 class="title-type1">가게</h2>
    <menu-bar
      :menuBarItems="menuBarItems"
      @update="updateSelectedMenu"
    ></menu-bar>
    <my-store v-if="selectedMenu == '0'" />
    <blank v-else></blank>
  </div>
</template>
<script>
import MyStore from '../components/Store/MyStore.vue'
import CONST from '../constants/Store'
export default {
  components: { MyStore },
  created() {
    this.initPage()
  },
  data() {
    return {
      menuBarItems: CONST.MENUBAR_ITEMS,
      selectedMenu: ''
    }
  },
  methods: {
    initPage() {
      this.selectedMenu = this.menuBarItems[0].id
    },
    updateSelectedMenu(id) {
      this.selectedMenu = id
    }
  }
}
</script>
