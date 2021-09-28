<template>
  <transition>
    <div class='vmodal'>
      <div class='vmodal-wrapper'>
        <div class='vmodal-container'>
            <h3 class='vmodal-header'>
                이벤트 목록 
                <Button class='vmodal-cancelbtn' style="float: right;" @click='onCancel'
                > X
                </Button>
            </h3>
          
          <span class='vmodal-body' >
            <li v-if="!editMode && !addMode">
                <p v-for='optionList in eventOption'
                :key='optionList.EVENT_LIST_ID'
                v-bind:value='optionList.EVENT_LIST_ID'
                style="margin-bottom:5px;">
                {{ optionList.EVENT_LIST_NAME }} - {{optionList.EVENT_LIST_DESC}}
                <button style="float: right;" @click='editButton(optionList)'>
                <img src='~/assets/images/ico-setting.png'>
                </button>
                </p>
            </li>
            <li v-if="editMode">
                <p style='font-size:15px;'>
                이벤트 이름
                <VInput
                    type='text'
                    style='width:80%; margin-top:5px; margin-bottom:12px;'
                    :value='currentOption.EVENT_LIST_NAME'
                    @input='SET_CURRENT_EVENT_NAME'
                >
                </VInput>
                </p>

                <p style='font-size:15px;'>
                이벤트 설명
                <VInput
                    type='text'
                    style='width:80%; margin-top:5px; margin-bottom:12px;'
                    :value='currentOption.EVENT_LIST_DESC'
                    @input='SET_CURRENT_EVENT_DESC'
                >
                </VInput>
                </p>
            </li>
            <li v-if="addMode">
                <p style='font-size:15px;'>
                이벤트 이름
                <VInput
                    type='text'
                    style='width:80%; margin-top:5px; margin-bottom:12px;'
                    :value='currentOption.EVENT_LIST_NAME'
                    @input='SET_CURRENT_EVENT_NAME'
                >
                </VInput>
                </p>

                <p style='font-size:15px;'>
                이벤트 설명
                <VInput
                    type='text'
                    style='width:80%; margin-top:5px; margin-bottom:12px;'
                    :value='currentOption.EVENT_LIST_DESC'
                    @input='SET_CURRENT_EVENT_DESC'
                >
                </VInput>
                </p>
            </li>
          </span>
            <Button v-if="!editMode && !addMode" @click='addEvent'> 
              <img src='~/assets/images/ico-plus-circle.png'> 
            </Button>
          <div class='vmodal-buttons' style='margin-top:10px'>
            <Button class='vmodal-cancelbtn' v-if="editMode" @click='delButton'>삭제</Button>
            <Button class='vmodal-confirmbtn' v-if="editMode" @click='saveEdit'>저장</Button>
            <Button class='vmodal-cancelbtn' v-if="addMode" @click='delButton'>취소</Button>
            <Button class='vmodal-confirmbtn' v-if="addMode" @click='saveEdit'>추가</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  computed: {
    headerText() {
      if (this.isConfirm) return '확인'
      else return '사업자 등록'
    },

    ...mapState('sensor_event/sensor_event', ['eventOption', 'currentOption']),
    ...mapState('sensor/sensor', ['divideInfo'])
  },

  created() {
    this.initEventModal()
  },

  data() {
    return {
        editMode: false,
        addMode: false,
        currentId: null
    }
  },
  methods: {
      ...mapMutations('sensor_event/sensor_event', [
      'SET_CURRENT_EVENT_OPTION',
      'SET_CURRENT_EVENT_NAME',
      'SET_CURRENT_EVENT_DESC',
      'SET_CURRENT_EVENT_DV_INFO',
      'SET_CURRENT_EVENT_DEFAULT'
    ]),
    ...mapActions('sensor_event/sensor_event', [
      'FETCH_EVENT_OPTION',
      'UPDATE_EVENT_LIST',
      'DELETE_EVENT_LIST',
      'CREATE_EVENT_LIST'
    ]),
    initEventModal() {
      console.log(this.divideInfo);
      console.log(this.divideInfo.TARGET_DV_CD)
            if (this.divideInfo.TARGET_DV_CD === 'STORE') {
                    this.FETCH_EVENT_OPTION(this.divideInfo)
            }

    },
    async onCancel() {
        this.addMode = false
        this.editMode = false
        await this.$emit('onCancel')
    },
    editButton(curOption) {
        this.SET_CURRENT_EVENT_OPTION(curOption)
        this.editMode = true
    },
    async saveEdit() {
        if(this.addMode === true) {
            let data = {
                EVENT_LIST_NAME: this.currentOption.EVENT_LIST_NAME,
                EVENT_LIST_DESC: this.currentOption.EVENT_LIST_DESC,
                DV_CD: this.currentOption.DV_CD,
                ID: this.currentOption.ID
            }
            await this.CREATE_EVENT_LIST(data)
            await this.FETCH_EVENT_OPTION(this.divideInfo)
            alert("추가되었습니다!")
            this.addMode = false
        }
        if(this.editMode === true) {
            await this.UPDATE_EVENT_LIST(this.currentOption)
            await this.FETCH_EVENT_OPTION(this.divideInfo)
            alert("저장되었습니다!")
            this.editMode = false
        }
        
    },
    addEvent() {
        this.addMode = true
        this.SET_CURRENT_EVENT_DEFAULT()
        let data = {
            ID: this.divideInfo.TARGET_ID,
            DV_CD: this.divideInfo.TARGET_DV_CD
        }
        this.SET_CURRENT_EVENT_DV_INFO(data)
    },
    delButton() {
        if(this.editMode === true) {
            if (confirm('이벤트를 삭제하시겠습니까?') === true) {
            this.DELETE_EVENT_LIST(this.currentOption.EVENT_LIST_ID)
            this.FETCH_EVENT_OPTION(this.divideInfo)
            alert("삭제되었습니다!")
            }
            this.editMode = false
        }
        if(this.addMode === true) {
            this.addMode = false
        }
        
    }
  }
}
</script>
