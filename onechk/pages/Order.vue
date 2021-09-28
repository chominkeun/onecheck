<template>
  <div class="cont-box">
    <h2 class="title-type1">주문</h2>
    <menu-bar
      :menuBarItems="menuBarItems"
      @update="updateSelectedMenu"
    ></menu-bar>
    <my-order v-if="selectedMenu == '0'" />
    <Statis v-else></Statis>
  </div>
</template>
<script>
import Blank from '../components/common/Blank.vue'
import MenuBar from '../components/common/MenuBar.vue'
import MyOrder from '../components/Order/MyOrder.vue'
import Statis from '../components/Order/Statistics.vue'
import CONST from '../constants/Order'
export default {
  components: { MenuBar, MyOrder, Blank, Statis },
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

MenuBar
