<template>
  <div class="cont-box">
    <h2 class="title-type1">건물</h2>
    <menu-bar
      :menuBarItems="menuBarItems"
      @update="updateSelectedMenu"
    ></menu-bar>
    <my-building v-if="selectedMenu == '0'"  />
    <blank v-else></blank>
  </div>
</template>
<script>
import CONST from '../constants/building'
import Blank from '../components/common/Blank.vue'
import MyBuilding from '../components/Building/MyBuilding.vue'
export default {
  components: { MyBuilding, Blank },
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
