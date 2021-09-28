<template>
  <v-popup :is-open="optPop" :pop-width="400" @close="closePopup">
    <template slot="header">
      <p class="pop-tit">{{ selectedMenu.menuName }}</p>
    </template>
    <template slot="body">
      <div class="prd-option">
        <div class="prd-name" style="height: 200px">
          <img
            v-if="selectedMenu.IMAGE_SRC === ''"
            src="~/assets/images/temp/menu-no-image.png"
            alt=""
          />
          <img v-else :src="selectedMenu.IMAGE_SRC" alt="" />
        </div>
        <ul v-for="(group, gIndex) in optionList" :key="gIndex">
          <li style="overflow-x: auto">
            <span class="label">{{ group.G_NAME }}</span>
            <div
              class="opts"
              v-for="(option, oIndex) in group.O_NAMES"
              :key="oIndex"
            >
              <VRadio
                @change="ChangeOpt(gIndex, oIndex)"
                :name="group.G_NAME"
                :id="option.PRT_OPT_ID"
                :value="
                  group.DEFAULT === option.PRT_OPT_ID
                    ? option.PRT_OPT_ID
                    : option.NA_PRT_OPT_ID
                "
                class="type2"
                >{{
                  group.DEFAULT === option.PRT_OPT_ID
                    ? `${option.O_NAME}(기본)`
                    : option.O_NAME
                }}
              </VRadio>
            </div>
          </li>
        </ul>

        <ul>
          <li>
            <span class="label">수량</span>
            <div class="opts">
              <VInpNum v-model="inpNum" :min="1" :max="12" />
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-wrap">
        <VBtn class="btn-type2 st1 full" @click="completePopup">완료</VBtn>
      </div>
    </template>
  </v-popup>
</template>


<script>
export default {
  props: {
    optPop: {
      type: Boolean,
      default: false,
    },
    selectedMenu: {
      type: Object,
    },
    optionList: {
      type: Array,
    },
  },
  data() {
    return {
      optVal: [],
      inpNum: 1,
    }
  },
  methods: {
    closePopup() {
      this.optVal = []
      this.$emit('close')
      // 이전 주문 수량이 남아 있어 팝업이 닫힐 경우 초기화
      this.inpNum = 1
    },
    ChangeOpt(gIndex, oIndex) {
      const group = this.optionList[gIndex]
      const gName = group.G_NAME
      const oNames = group.O_NAMES[oIndex]
      const oName = oNames.O_NAME

      let findIndex = this.optVal.findIndex((option) => {
        return option.G_NAME === gName
      })

      if (findIndex !== -1) {
        this.optVal[findIndex].O_NAME = oName
      } else {
        this.optVal.push({
          G_NAME: gName,
          O_NAME: oName,
        })
      }
    },

    completePopup() {
      // 유효한 옵션 검증 N/A 선택 시 제외
      let effectiveOpts = []
      if (this.optVal.length) {
        effectiveOpts = this.optVal.filter((option) => {
          return option.O_NAME !== 'N/A'
        })
      } else {
        // 옵션 선택에 대한 action이 없을 경우 optVal값은 빈 배열 값이 됨
        effectiveOpts = this.selectedMenu.defaultOpts
      }

      //TODO : 옵션선택을 완료 후 해야하는 기능들 추가하기
      let current_data = {
        curOptVal: effectiveOpts,
        curInpNum: this.inpNum,
      }

      //parent : MenuList.vue
      this.$emit('addCurrent_Opt', current_data)
      this.closePopup()
    },
  },
}
</script>

<style></style>
