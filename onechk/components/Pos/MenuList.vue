<template>
  <div>
    <div class="status-list">
      <ul>
        <li v-for="(menu, index) in menuList" :key="menu.PRT_ID">
          <VBtn class="menu" @click="openPopup(index)">
            <div class="img">
              <img
                v-if="menu.ATTACH_ID === null"
                src="../../assets/images/temp/menu-no-image.png"
                style="width: 90%; height: 90%"
                alt=""
              />
              <img
                v-else
                style="width: 90%; height: 90%"
                :src="menu.IMAGE_SRC"
                alt=""
              />
            </div>
            <p class="tit">{{ PrintPrtName(menu.PRT_NAME) }}</p>
            <!-- <p class="eng">{{ menu.DESC }}</p> -->
            <p class="price">
              <b>{{ menu.PRICE }}</b
              ><span class="unit">원</span>
            </p>
          </VBtn>
        </li>
      </ul>
    </div>
    <option-popup
      :optPop.sync="optPop"
      :selectedMenu="selectedMenu"
      :optionList="curOptList"
      @close="closePopup"
      @addCurrent_Opt="addCurrent_Opt"
    ></option-popup>
  </div>
</template>

<script>
import TEMP from '../../assets/TempData'
import OptionPopup from './OptionPopup.vue'
export default {
  components: { OptionPopup },
  props: {
    menuList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      optPop: false,
      selectedMenu: {
        menuName: '',
      },
      curOptList: [],
    }
  },

  methods: {
    openPopup(index) {
      let menu = this.menuList[index]
      this.curOptList = menu.options
      this.selectedMenu.menuName = menu.PRT_NAME
      this.selectedMenu.menuID = menu.PRT_ID
      this.selectedMenu.price = menu.PRICE
      this.selectedMenu.IMAGE_SRC = !menu.IMAGE_SRC ? '' : menu.IMAGE_SRC
      this.selectedMenu.desc = menu.DESC
      this.selectedMenu.idx = index
      // 옵션 기본 값 설정
      const DefaultOpts = []
      for (const group of this.curOptList) {
        const gOptions = group.O_NAMES
        const matchDefault = gOptions.find((option) => {
          return group.DEFAULT === option.PRT_OPT_ID
        })

        if (matchDefault) {
          DefaultOpts.push({
            G_NAME: group.G_NAME,
            O_NAME: matchDefault.O_NAME,
          })
        }
      }
      this.selectedMenu.defaultOpts = DefaultOpts
      this.optPop = true
    },
    closePopup() {
      this.optPop = false
    },

    initMenu() {},

    addCurrent_Opt(options) {
      //parent : Pos.vue
      this.selectedMenu.curOptVal = options.curOptVal
      this.selectedMenu.curInpNum = options.curInpNum
      this.$emit('addCurrent_Opt', this.selectedMenu)
    },
    PrintPrtName(prtName) {
      // 상품명이 String Size가 10이 넘을 경우 UI가 깨진다.
      // 체크후 .. 처리
      // ex) 아이스 카라멜 마끼야또 -> 아이스 카라멜..
      if (prtName.length > 10) {
        return `${prtName.substring(0, 7)}..`
      }
      return prtName
    },
  },
}
</script>

<style></style>
