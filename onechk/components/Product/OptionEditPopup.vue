<template>
 <v-popup :is-open="isModalOptEdit" :pop-width="400" @close="closePopup">
    <template slot="header">
      <p class="pop-tit">옵션추가({{prtName}})</p>
    </template>
    <template slot="body">
      <div class='data-info-top'>
         <select @input='onInput'>
            <option
            v-for='(group, index) in optList'
            :key='index'
            v-bind:value='index'>
              {{group.G_NAME}}
            </option>
        </select>
       <div class='right'>
          <VBtn class='btn-type3 st8' @click="optRegistration">
            <i class='ico i-setting'></i>등록
          </VBtn>
        </div>
       </div>
      <div class="prttable">
        <ul style="margine: 5px;">
          <span
          v-for='(option) in curOptList.O_NAMES'
          :key='option.PRT_OPT_ID'
          style='padding-left: 10px;'>
              ● {{option.O_NAME}}
          </span>
        </ul>
      </div>
      <div class="edit-option-manager">
         <div class="edit-option-set">
           <h2>옵션 목록 등록 확인</h2>
            <div v-for="(regOptgroup, index) in editOptList"
            :key="index"
            class="edit-option"
            >
              <div class="edit-opt-name">{{regOptgroup.G_NAME}}</div> 
              <div class='edit-opt-text'>{{printOpts(regOptgroup)}} </div>
              <div class='btns'>
                  <button class="btn-type4 st7"
                  @click="removeOpt(index)">
                  삭제
                  </button>
              </div>
        </div>
         </div>
      </div>
   
      <div class="btn-box">
        <VBtn class="btn-type2 st1" @click="completePopup">적용</VBtn>
        <VBtn @click="closePopup" class="btn-type2 st6">취소</VBtn>
      </div>
    </template>

     <template slot="footer">
      <p class="pop-tit">옵션추가</p>
    </template>
  </v-popup>

</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import VCheckbox from '../common/VCheckbox.vue'
import TEMP from '../../assets/TempData'
import {cloneDeep} from 'lodash'

export default {
  components: { VCheckbox },
  computed: {
    ...mapState(TEMP.STORE_PATH.USER, ['userInfo']),
    ...mapState(TEMP.STORE_PATH.PRODUCT, ['prtInfo'])
  },
  props: {
    isModalOptEdit: {
      type: Boolean,
      default: false
    },
  
  prtName : {
      type : String,
      default : 'PRT'
    }
  },
  data() {
    return {
      optVal: 'ICED',
      inpNum: 1,
      StoreId: 0,
      curOptList: [],
      optList: [],
      editOptList: []
    }
  },
  created(){
      this.StoreId = this.userInfo.STORE_ID
      this.initPrtOptAll();
  },
  methods:{
    ...mapActions(TEMP.STORE_PATH.OPTION, [
      'ACT_PRT_OPT_LIST',
    ]),
    ...mapMutations(TEMP.STORE_PATH.OPTION, [
      'SET_OPT_LIST'
    ]),
    ...mapMutations(TEMP.STORE_PATH.PRODUCT, [
       'SET_PRT_INFO'
    ]),

   // 버튼 리스너모음[Start] 
   // 적용
   completePopup(){
    this.$emit('applyOpt', this.editOptList)
    // 적용 후 초기화 처리
    this.initCurOptList()
   },
   
   // 취소 또는 닫기
   closePopup(){
    this.initCurOptList()
    this.$emit('update:isModalOptEdit', false)
   },
   
   //등록
   optRegistration(){
    
    let findindex = -1
     if(this.editOptList.length) {
      findindex = this.editOptList.findIndex(item => {
        return item.G_NAME === this.curOptList.G_NAME
      })
    }

    if(findindex === -1){
      this.editOptList.push(this.curOptList);
      // 기존 removeOpts에 해당 객체 정보가 남아 있다면 splice처리
      // 옵션관리 화면 내 삭제 후 재 등록 할 경우
      let removeOptIndex = this.editOptList.removeOpts.findIndex(removeOpt => {
        return removeOpt.G_NAME === this.curOptList.G_NAME
      })
      if(removeOptIndex !== -1){
        this.editOptList.removeOpts.splice(removeOptIndex, 1)
      }
    }
   },
   //삭제
   removeOpt(index){
     this.editOptList.removeOpts.push(this.editOptList[index])
     this.editOptList.splice(index, 1)
   },
   // 버튼 리스너모음[ End ]

   // 이벤트 및 로직처리 리스너모음[Start]
   onInput(e){
     let index = e.target.value
     this.curOptList = this.optList[index]
   },
   // 옵션 모든 정보 GET
   initPrtOptAll(){
     let AllOptData = this.ACT_PRT_OPT_LIST(this.StoreId)
     AllOptData.then(data => {
       this.optList = data
       this.SET_OPT_LIST(this.optList)
       // 옵션 화면 초기화
       this.initCurOptList();
     })
   },
   initCurOptList(){
     if(this.optList.length){
       this.curOptList = this.optList[0]
     }
     //등록 된 리스트 초기화
     if(this.editOptList && !this.editOptList.length)
     {
       this.editOptList = [];
     }

     this.editOptList = cloneDeep(this.prtInfo.options) || []
     this.editOptList.originOpts = cloneDeep(this.editOptList) || [];
     this.editOptList.removeOpts = [];
   },

    /* 옵션 데이터 모두 출력 */
    printOpts(group) {
      if ((!group) || (!group.O_NAMES)) return;
      const optNames = []
      const opts = group.O_NAMES.filter(oName => oName)
      opts.forEach(opt => {
        let name = opt.O_NAME 
        optNames.push(name)
      })
      return optNames.join(', ')
    },
   // 이벤트 및 로직처리 리스너모음[ End ]
  }
}
</script>

<style>
  .optCheckBox{
    padding-left: 10px;
  }

.prttable {
  width: 100%;
  padding: 20px 0px;
  border-bottom: 3px dashed #252525;
  margin-bottom: 20px;
}
.prttable-item {
  display: flex;
  flex-direction: row;
  margin: 0px 0px 12px 10px;
  font-size: 18px;
}
.prttable-item .prt {
  width: 200px;
  text-align: start;
}

.edit-option-manager {
    margin: 0 auto;
    max-height: 300px;
    overflow-y: auto;
}

.edit-option-manager .edit-option-set {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
}

.edit-option-manager .edit-option-set .edit-option {
    width: 98%;
    height: 80px;
    border-radius: 3px;
    position: relative;
    border: 1px solid #dedede;
    padding: 22px 25px;
    margin-top: 12px;
}

.edit-option-manager .edit-option-set .edit-option .edit-opt-name {
    font-size: 18px;
    color: #121212;
}

.edit-option-manager .edit-option-set .edit-option .edit-opt-text {
    margin-top: 10px;
    color: #939393;
    font-size: 15px;
}

.edit-option-manager .edit-option-set .edit-option .btns {
    position: absolute;
    bottom: 15px;
    right: 24px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: flex-start;
}




   /* overflow-y: auto; */
    /* height: 800px; */
      /* height: 100%; */

</style>