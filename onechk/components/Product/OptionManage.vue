<template>
  <div>
    <div class="option-manager">
      <div class="option-set">
        <VBtn class="option add" @click="addOpt">
          <i class="ico i-plus-circle"></i>
        </VBtn>
        <div
          v-for="(group, index) in editList"
          :key="index"
          class="option"
          :style="`z-index:${100 - index}`"
        >
          <!-- 상품 옵션 편집 여부에 따라 구성요소 구분 -->
          <!-- 1. 편집중 X (처음 상태) -->
          <div class="opt-name">{{ group.G_NAME }}</div>
          <div class="opt-text">
            {{ printOpts(group) }}
          </div>
          <div class="btns">
            <VBtn class="btn-type4 st7" @click="deleteOpt(group, index)"
              >삭제</VBtn
            >
            <VBtn class="btn-type4 st7" @click="groupEdit(index)">편집</VBtn>
          </div>
          <!-- 2. 편집중 O ('편집' 버튼 눌렀을 때) -->
          <div v-if="index === groupIndex" class="opt-layer">
            <div class="left">
              <div class="opt-tit">
                <VInput type="text" v-model="group.G_NAME" />
              </div>
              <p class="txt">기본 선택 옵션을 골라주세요.</p>
              <ul
                v-for="(option, idx) in group.O_NAMES"
                :key="option.PRT_OPT_ID"
              >
                <li v-if="option.status !== 'D'">
                  <VRadio
                    v-model="group.DEFAULT"
                    :id="option.PRT_OPT_ID"
                    :value="group.DEFAULT ? group.DEFAULT : 0"
                    :name="group.G_NAME"
                  />
                  <div class="input-wrap">
                    <VInput v-model="option.O_NAME" type="text" />
                    <VBtn
                      v-if="idx + 1 === groupListCount"
                      @click="addOName(group.O_NAMES)"
                      class="plus"
                    ></VBtn>
                  </div>
                  <VBtn
                    v-if="group.O_NAMES.length > 1"
                    @click="deleteOName(idx)"
                    ><i class="ico i-del"></i
                  ></VBtn>
                </li>
              </ul>
            </div>
            <div class="right">
              <div>
                <VBtn class="btn-type4 st6" @click="updateGroup(group, index)"
                  ><i class="ico i-check-white"></i>완료
                </VBtn>
                <VBtn class="btn-type4 st6" @click="cancelGroup(group, index)"
                  >취소
                </VBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <VBtn @click="apply" class="btn-type2 st1">적용</VBtn>
        <VBtn @click="refreshData" class="btn-type2 st6">작업취소</VBtn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import PrtOptDataService from '../../api/prtopt/prtoptApi'
import * as _ from 'lodash'

export default {
  computed: {
    ...mapState('user/user', ['userInfo']),
    // ...mapState('option/option', ['optList'])
    groupListCount() {
      // 옵션 그룹 내 필요한 요소만 사용하기
      if (!this.editList.length) {
        return 0
      }

      const editList = this.editList[this.groupIndex]

      if (!editList.O_NAMES.length) {
        return 0
      }

      const O_NAMES = this.editList[this.groupIndex].O_NAMES
      //'D' 해당 되었을 경우 카운팅을 제외하기 위해 filter 사용
      let filters = O_NAMES.filter((O_NAME) => {
        return O_NAME.status !== 'D'
      })

      return filters.length
    },
  },
  data() {
    return {
      storeId: 0,
      optList: [],
      editList: [],
      undoList: null,
      groupIndex: 0,
      editOption: [],
      addVisible: false,
      popVisible: false,
      Vopdefault_id: 1000000,
    }
  },
  created() {
    this.initData()
    this.getOpts()
  },
  methods: {
    groupEdit(index) {
      this.groupIndex = index
    },
    //###########################################################################
    /******* 1. 초기화 *******/
    /* 1-1. INIT - DB 조회 데이터 */
    initGroupList(data) {
      const groupList = data
      // 그룹옵션.O_NAMES.status 속성 추가 (L/C/U/D)
      // L : 로드된 기존 데이터 (변경 X)
      // C : 추가할 데이터
      // U : 수정된 기존 데이터
      // D : 삭제할 기존 데이터
      groupList.forEach((group) => {
        const optionList = group.O_NAMES.sort((a, b) => {
          if (a.PRT_OPT_ID > b.PRT_OPT_ID) {
            return 1
          }

          if (a.PRT_OPT_ID < b.PRT_OPT_ID) {
            return -1
          }

          return 0
        })

        optionList.forEach((option) => {
          option.status = 'L'
        })
      })
      return groupList
    },

    /* 1-2. INIT - 변수 초기화 */
    initData() {
      if (this.userInfo !== null) {
        this.storeId = this.userInfo.STORE_ID
      }

      if (this.editList.length !== 0) {
        this.editList = []
      }

      if (this.optList.length !== 0) {
        this.optList = []
      }

      this.groupIndex = -1
      this.editOption = {
        G_NAME: '',
        O_NAMES: [{ status: '', PRT_OPT_ID: 0, O_NAME: '' }],
        STORE_ID: this.storeId,
        DEFAULT: 0,
        IS_MUTI_CUR: 'N',
      }
    },

    /* 2. 정보 수정 - 적용 전 임시 데이터 */
    /* 2-1. 그룹 - 생성 */
    addOpt() {
      // 그룹 내 기본 설정을 위해 임시 ID 채번
      this.Vopdefault_id = this.Vopdefault_id - 1
      let add_data = {
        G_NAME: '',
        O_NAMES: [
          {
            status: 'VC',
            O_NAME: '',
            PRT_OPT_ID: this.Vopdefault_id,
          },
        ],
        STORE_ID: this.storeId,
        DEFAULT: '',
        IS_MUTI_CUR: 'N',
      }
      this.editList.push(add_data)
    },
    /* 2-2. 그룹 - 삭제 */
    deleteOpt(group, index) {
      //group : optList 내 status 값을 D로 처리 하기 위한 용도(G_NAME)
      //index : 해당 editList 내 요소를 삭제 처리 하기 위한 용도
      const opt = this.optList
      let findIndex = opt.findIndex((item) => {
        return group.G_NAME === item.G_NAME
      })
      //옵션 그룹을 삭제시 추후 적용 했을 때 DB 변경 적용 외 UI가 따로 없다.
      //editList index에 해당되는 그룹을 삭제 후 optList로 처리
      if (findIndex !== -1 && opt[findIndex]) {
        opt[findIndex].O_NAMES.forEach((option) => {
          if (option.status !== 'D') {
            option.status = 'D'
          }
        })
      }
      this.editList.splice(index, 1)
    },
    /* 2-3. 그룹 - 수정 */
    updateGroup(group, index) {
      let gname = group.G_NAME
      // 기존에 그룹명이 존재하는지 체크
      let isExistGnameIdx = this.editList.findIndex((edit, index) => {
        if (this.groupIndex !== index) {
          return gname.trim() === edit.G_NAME.trim()
        }
      })

      if (isExistGnameIdx !== -1) {
        let msg = '해당 옵션명은 이미 존재합니다.'
        this.parentOpenModal(msg, false)
        return
      }

      this.editOption = group
      const optionList = this.editOption.O_NAMES
      optionList.forEach((option) => {
        if (option.status === 'L') {
          option.status = 'U'
        } else if (option.status === 'VC') {
          option.status = 'C'
        } else if (option.status === 'D') {
          //optionList.splice(oindex, 1)
        }
      })

      //this.editList.splice(this.groupIndex, 1, this.editOption)
      //this.optList = Object.assign([], this.editList)
      //this.optList.splice(this.groupIndex, 1, this.editOption)
      // 옵션 편집 화면 close
      this.groupIndex = -1

      // 그룹 내 반영 완료 했을 때 이전 상태 값도 관리(편집 후 취소시 undo 처리 하기 위한 용도)
      this.SetEditUndodata()

      // 그룹 내 수정 완료 했을 때
      let findoptIndex = this.optList.findIndex((item) => {
        return item.G_NAME === group.G_NAME
      })

      if (findoptIndex !== -1) {
        // 그룹 수정 완료 적용
        this.optList[findoptIndex] = _.cloneDeep(group)
      } else {
        // 신규 추가 되었을때
        this.optList.push(group)
      }
      // 옵션그룹.O_NAMES[index].status = 'U'
    },
    /* 2-4. 그룹 - 취소 */
    cancelGroup(group, index) {
      if (this.optList[index] === undefined) {
        this.editList.splice(index, 1)
      } else {
        if (this.undoList === null) {
          this.SetEditUndodata()
        }
        this.editList[index] = _.cloneDeep(this.undoList[index])
      }
      this.groupIndex = -1
    },

    /* 2-5. 옵션 - 추가 */
    addOName(data) {
      // 그룹 내 기본 설정을 위해 임시 ID 채번
      this.Vopdefault_id = this.Vopdefault_id - 1
      const Id = this.Vopdefault_id
      data.push({
        O_NAME: data.O_NAME,
        PRT_OPT_ID: Id,
        status: 'VC',
      })
    },
    /* 2-6. 옵션 - 삭제 */
    deleteOName(idx) {
      if (this.editList[this.groupIndex].O_NAMES[idx].status !== 'D') {
        this.editList[this.groupIndex].O_NAMES[idx].status = 'D'
      }
      return
    },

    /* 2-6. 적용 전 옵션 수정 중 취소 할 경우 이전 상태로 되돌리기 */
    SetEditUndodata() {
      this.undoList = _.cloneDeep(this.editList)
    },

    refreshData() {
      this.getOpts()
    },

    /******* 3. DB 관련 함수 *******/
    /* 3-1. 카테고리 전체 조회 */
    async getOpts() {
      const response = await this.getAll()
      // 에러 핸들링
      if (!response.data.result) {
        // let msg = 'Not Found : 옵션 목록이 존재하지 않습니다!'
        // this.parentOpenModal(msg, false)
        // 해당 옵션이 존재이 DB 상 존재하지 않을 경우
        // editList, optList도 초기화 상태처리
        this.initData()
        return
      }

      const groupList = await this.initGroupList(response.data.groupList)
      this.editList = groupList

      //처음 created로 vue가 생성 될 때 초기 데이터 생성
      if (this.undoList !== null) {
        this.undoList = []
        this.SetEditUndodata()
      }

      //깊은 복사
      this.optList = _.cloneDeep(this.editList)
    },

    /* 3-2. 데이터 일괄 처리 (생성, 수정, 삭제) */
    async apply() {
      const data = this.optList
      const status = await this.applyAll(data)
      let msg = ''
      if (status == 200) {
        msg = '상품 옵션이 저장되었습니다.'
        this.getOpts()
      } else {
        msg = '저장에 실패했습니다.'
      }

      this.parentOpenModal(msg, false)
    },

    /******* 4. Axios 호출 함수 *******/
    /* Axios 4-1. 카테고리 전체 조회 */
    async getAll() {
      try {
        const response = await PrtOptDataService.getAll(this.storeId)
        return response
      } catch (err) {
        return err.response
      }
    },
    /* Axios 4-2. 데이터 일괄 처리 (생성, 수정, 삭제) */
    async applyAll(data) {
      try {
        const response = await PrtOptDataService.applyAll(data)
        return response.status
      } catch (err) {
        return err.response.status
      }
    },

    /* 출력 5-1. 옵션 데이터 모두 출력 */
    printOpts(group) {
      const optNames = []
      const opts = group.O_NAMES.filter((oName) => oName)
      opts.forEach((opt) => {
        if (opt.status !== 'D') {
          let name =
            group.DEFAULT && opt.PRT_OPT_ID === parseInt(group.DEFAULT)
              ? opt.O_NAME + '(기본)'
              : opt.O_NAME
          optNames.push(name)
        }
      })
      return optNames.join(', ')
    },

    //###########################################################################

    addData(newdata) {
      if (newdata.G_NAME === '') return
      this.optList.push(newdata)
    },
    changeData(data, index) {
      if (data.G_NAME === '') {
        this.optList.splice(index, 1)
        return
      }
      this.optList.splice(index, 1, data)
    },

    // Product.vue로 모달 Open 요청
    parentOpenModal(modalText, isConfirm) {
      this.$emit('ModalOpen', modalText, isConfirm)
    },
  },
}
</script>
