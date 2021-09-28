<template>
  <div>
    <div class='data-type2'>
      <p id='demo' align='center' :class="'err-msg'"></p>
      <table>
        <colgroup>
          <col style='width:230px' />
          <col style='width:auto' />
        </colgroup>
        <tbody>
        <table-item title='가게 명'>
          <template v-if='modifyMode'>
            <VInput
              minLength='0'
              maxLength='20'
              type='text'
              style='width:578px'
              :value='storeInfo.STORE_NAME'
              @input='SET_STORE_NAME'
              placeholder='필수 입력 항목'
            />
            <p align='center'>{{ failMsg }}</p>
          </template>
          <template v-else>{{ storeInfo.STORE_NAME }}</template>
        </table-item>
        <table-item title='전화번호'>
          <VInput
            minLength='10'
            maxLength='13'
            v-if='modifyMode'
            type='number'
            style='width:578px'
            :value='storeInfo.STORE_TEL_NUM'
            @input='SET_STORE_TEL_NUM'
            placeholder='필수 입력 항목'
          />
          <template v-else>
            {{ storeInfo.STORE_TEL_NUM }}
          </template>
        </table-item>

        <table-item title='업종'>
          <div v-if='modifyMode || createMode' class='inp-search'>
            <select
              style='width:112px;'
              :value='storeInfo.STORE_CODE'
              @input='onInput'
            >
              <option
                v-for='(option, index) in storeCategoryInfo'
                :key='index'
                v-bind:value='option.STORE_CATEGORY_ID'
              >
                {{ option.STORE_KND }}
              </option>
            </select>
          </div>
          <template v-else>{{ GET_STORE_CATEGORY_NAME }}</template>
        </table-item>

        <table-item title='아이콘'>
          <!-- <VUpload v-model="imgSrc"/> -->
          <div class='add-photo'>
            <v-upload ref="imgFile"
                      :childMode='modifyMode'
                      :imgSrc='imgSrc'>
            </v-upload>
          </div>
        </table-item>
        <table-item title='주소'>
          <template v-if='modifyMode'>
            <search-address
              v-if='modifyMode'
              :address='storeInfo.ADDRESS'
              @updateAddress='SET_ADDRESS'
              @updateLatLot='SET_STORE_LATLOT'
            />
            <div class='inp-addr'>
              <div class='row'>
                <VInput
                  type='text'
                  :value='storeInfo.EXTRA_ADDRESS'
                  placeholder='상세주소를 입력하세요.'
                  @input='SET_EXTRA_ADDRESS'
                />
              </div>
            </div>
          </template>
          <template v-else>
            {{ storeInfo.ADDRESS }} {{ storeInfo.EXTRA_ADDRESS }}
          </template>
        </table-item>
        <table-item title='세부위치'>
          <div class='detail-map' v-if='isGoogleMapVisible'>
            <google-map
              :lat='storeInfo.STORE_LAT'
              :lot='storeInfo.STORE_LOT'
              :editable='modifyMode'
              @update='SET_STORE_LATLOT'
            />
            <p class='txt'>
              가게의 정확한 출입구 위치에 지도를 클릭하거나, 마커를
              옮겨주세요.
            </p>
          </div>
        </table-item>
        <table-item title='층수(지상)'>
          <VInput
            v-on:blur='checkMinMax($event,"F")'
            v-if='modifyMode'
            type='number'
            min='0'
            max='20'
            style='width:578px'
            :value='storeInfo.STORE_FLOORS'
            @input='SET_STORE_FLOORS'
            placeholder='필수 입력 항목'
          />
          <template v-else>{{ storeInfo.STORE_FLOORS }}</template>
        </table-item>
        <table-item title='층수(지하)'>
          <VInput
            v-on:blur='checkMinMax($event,"B")'
            v-if='modifyMode'
            type='number'
            min='0'
            max='20'
            style='width:578px'
            :value='storeInfo.STORE_BASEMENT_FLOORS'
            @input='SET_STORE_BASEMENT_FLOORS'
            placeholder='필수 입력 항목'
          />
          <template v-else>{{ storeInfo.STORE_BASEMENT_FLOORS }}</template>
        </table-item>
        <table-item title='가게 설명'>
          <div v-if='modifyMode' class='textarea'>
            <VInput
              :value='storeInfo.DESC'
              type='textarea'
              style='width:100%;height:170px'
              maxlength='500'
              placeholder='가게 설명을 입력하세요.'
              @input='SET_DESC'
            />
            <span class='byte'>{{ DESC_LENGTH }} / 500</span>
          </div>
          <div v-else class='textarea'>{{ storeInfo.DESC }}</div>
        </table-item>
        <table-item title='가게 실내도 (선택)' v-if='!modifyMode&&!createMode'>
          <VBtn class='btn-type2 st6' style='width:145px' @click='interiorOpen'>실내도 관리</VBtn>
        </table-item>
        <table-item title='사업자등록증'>
          {{ bizInfo.BIZ_NUM }}
          <template v-if='modifyMode'>
            <template v-if='!isDataInBiz'>
              <VBtn class='btn-type2 st6' style='width:145px' @click='bizModalViewed=true'>추가</VBtn>
            </template>
            <template v-else>
              <VBtn class='btn-type2 st4' style='width:145px' @click='deleteBizInfo(bizInfo.BIZ_NUM)'>삭제</VBtn>
            </template>
          </template>
        </table-item>
        <table-item v-if="!modifyMode" title='가게 이벤트'>
            <VBtn class='btn-type2 st6' style='width:145px' @click='eventOpen'>이벤트 목록 관리</VBtn>
        </table-item>
        </tbody>
      </table>
    </div>
    <!-- //table -->
    <div class='btn-box align-r'>
      <VBtn v-if='!modifyMode' class='btn-type2 st5' @click='deleteStore'
      >정보삭제
      </VBtn
      >
      <VBtn v-else-if='modifyMode' class='btn-type2 st5' @click='goPrev'
      >뒤로가기
      </VBtn
      >
      <VBtn v-if='!modifyMode' class='btn-type2 st1' @click='modifyInfo'
      >정보편집
      </VBtn
      >
      <VBtn
        v-else-if='modifyMode && !createMode'
        class='btn-type2 st1'
        @click='updateStore'
      >수정완료
      </VBtn
      >
      <VBtn
        v-else-if='modifyMode && createMode'
        class='btn-type2 st1'
        @click='createStore'
      >생성완료
      </VBtn
      >
    </div>
    <v-modal
      v-show='isModalVisible'
      :text='modalText'
      :isConfirm='isModalConfirm'
      @onCancel='onModalCancel'
      @onConfirm='onModalConfirm'
    />
    <!-- 실내도 모달 -->
    <interior-modal
      v-if='isModalViewed' @close-modal='isModalViewed=false'
    />
    <biz-modal
      v-show='bizModalViewed'
      @onCancel='bizModalCancel'
      @onConfirm='bizModalConfirm'
    />

    <!-- 이벤트 모달 -->
    <event-modal
      v-if='eventModalViewed'
      @onCancel='eventModalCancel'
    />
  </div>
</template>

<script>
import SearchAddress from '../common/SearchAddress.vue'
import TableItem from '../common/TableItem.vue'
import GoogleMap from './googleMap.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import UserModal from '../common/UserModal.vue'
import VModal from '../common/VModal.vue'
import InteriorModal from '../Interior/InteriorModal.vue'
import BizModal from './BizModal.vue'
import EventModal from '../Interior/EventModal.vue'

export default {
  components: {
    TableItem,
    SearchAddress,
    GoogleMap,
    UserModal,
    VModal,
    InteriorModal,
    BizModal,
    EventModal
  },
  created() {
    this.initMyStore()
    //Todo: biz get by user 만들면 여기에서 state 값을 set 해줘야한다.
  },
  destroyed() {
    this.FETCH_DEFAULT_STORE_INFO()
    this.SET_DEFAULT_DIVIDE_INFO()
  },
  computed: {
    ...mapState('store/store', ['storeInfo', 'storeCategoryInfo']),
    ...mapState('user/user', ['userInfo', 'isLogin']),
    ...mapState('attach/attach', ['attachInfo']),
    ...mapState('biz/biz', ['bizInfo']),
    ...mapGetters('store/store', ['DESC_LENGTH', 'GET_STORE_CATEGORY_NAME']),
    ...mapGetters('biz/biz', ['GET_BIZ_NUM']),
    ...mapState('sensor/sensor', ['divideInfo']),
    isGoogleMapVisible() {
      return this.storeInfo.STORE_LAT || this.storeInfo.STORE_LOT
    }
  },
  data() {
    return {
      createMode: false,
      modifyMode: false,
      deleteMode: false,
      modalText: '',
      isModalConfirm: false,
      isModalVisible: false,
      imgSrc: '',
      //실내도 모달 여부
      isModalViewed: false,
      bizModalViewed: false,
      eventModalViewed: false,

      //초기값 get을 통한 초기화
      isDataInBiz: false,
      failMsg: ''
    }
  },
  methods: {
    ...mapMutations('user/user',[
      'SET_STORE_ID'
    ]),
    ...mapActions('user/user', [
      'FETCH_USER_STORE_INFO',
      'FETCH_USER_LOGIN'
    ]),
    ...mapActions('store/store', [
      'FETCH_STORE_INFO',
      'UPDATE_STORE_INFO',
      'CREATE_STORE_INFO',
      'DELETE_STORE_INFO',
      'UPDATE_STORE_INFO_ASYNC',
      'FETCH_STORE_CATEGORY_INFO',
      'FETCH_DEFAULT_STORE_INFO'
    ]),
    ...mapMutations('store/store', [
      'SET_STORE_LATLOT',
      'SET_ADDRESS',
      'SET_STORE_NAME',
      'SET_STORE_TEL_NUM',
      'SET_EXTRA_ADDRESS',
      'SET_DESC',
      'SET_DEFAULT_STORE_INFO',
      'SET_ATTACH_FILE_ID',
      'SET_STORE_FLOORS',
      'SET_STORE_BASEMENT_FLOORS',
      'SET_STORE_STORE_CODE'
    ]),
    ...mapActions('biz/biz', [
      'DELETE_BIZ',
      'FETCH_BIZ'
    ]),
    ...mapMutations('biz/biz', [
      'SET_DEFAULT_BIZ_INFO',
      'SET_BIZ_INFO'
    ]),
    ...mapActions('attach/attach', [
      'FETCH_ATTACH_INFO',
      'CREATE_ATTACH_INFO',
      'UPDATE_ATTACH_INFO',
      'DELETE_ATTACH_INFO'
    ]),
    ...mapMutations('attach/attach', [
      'SET_ATTACH_INFO',
      'SET_ATTACH_ID'
    ]),
    ...mapMutations('sensor/sensor', [
      'SET_DIVIDE_INFO',
      'SET_DIVIDE_INFO_USE',
      'SET_DEFAULT_DIVIDE_INFO'
    ]),

    // [START] 버튼 이벤트 모음

    // 생성완료 버튼
    createStore() {
      this.openModal('가게 정보를 생성하시겠습니까?', true)
      // createInfoFinished
    },
    // 수정완료 버튼
    updateStore() {
      this.openModal('가게 정보를 수정하시겠습니까?', true)
      // modifyInfoFinished
    },
    // 가게정보 삭제 버튼
    deleteStore() {
      this.openModal('가게정보를 삭제하시겠습니까?', true)
      this.deleteMode = true
    },
    // 뒤로가기 버튼
    goPrev() {
      this.initMyStore()
      this.setModifyMode(false)
    },
    // 정보편집 버튼
    modifyInfo() {
      this.setModifyMode(true)
      this.CheckIsDataInBiz()
    },
    //수정완료 버튼
    async modifyInfoFinished() {
      this.scrollToTop()
      const isValid = this.getStoreValid()
      if(!isValid) return
      this.$nuxt.$loading.start()
      await this.myStoreModify()
      this.setModifyMode(false)
      this.$nuxt.$loading.finish()
    },
    //생성완료 버튼
    async createInfoFinished() {
      const isValid = this.getStoreValid()
      if(!isValid) return

      this.scrollToTop()
      this.$nuxt.$loading.start()
      await this.createAttachFile(true)
      this.setCreateMode(false)
      this.$nuxt.$loading.finish()
    },
    getStoreValid(){
      let isValid = true
      let demo = document.getElementById('demo')
      let strMsg = ''

      if(this.storeInfo.STORE_NAME === '') {
        isValid = false
        strMsg = '가게 명칭을 입력해주세요.\n'
      } else if(this.storeInfo.STORE_TEL_NUM === ''){
        isValid = false
        strMsg = '가게 전화번호를 입력해주세요.\n'
      } else if(this.storeInfo.ADDRESS === ''){
        isValid = false
        strMsg = '가게 주소를 입력해주세요.\n'
      }
      demo.innerHTML = strMsg
      return isValid
    },
    // 모달 창 취소
    onModalCancel() {
      this.isModalVisible = false
    },
    onModalConfirm() {
      if (this.isLogin) {
        if (this.deleteMode) {
          this.deleteStoreInfo()
          if (this.isDataInBiz)
            this.deleteBizInfo(this.bizInfo.BIZ_NUM)
        } else if (!this.userInfo.E_MAIL) {
          this.$router.push('/login')
        } else if (this.modifyMode && this.createMode) {
          this.createInfoFinished()
        } else if (this.modifyMode && !this.createMode) {
          this.modifyInfoFinished()
        } else if (!this.userInfo.STORE_ID) {
          this.createMode = true
          this.SET_DEFAULT_STORE_INFO()
          this.modifyMode = true
          this.SET_DEFAULT_BIZ_INFO()
        } else {
          console.log('store page else case')
        }
      } else {
        this.$router.push('/login')
      }
      this.isModalVisible = false
    },
    // 사업자등록 모달 창 취소
    bizModalCancel() {
      this.bizModalViewed = false
    },
    bizModalConfirm() {
      // this.modifyInfoFinished()
      this.CheckIsDataInBiz()
      if(this.isDataInBiz){
        this.bizModalViewed = false
      }
    },
    // 사업자 등록번호 삭제 버튼
    deleteBizInfo(biz_num) {
      this.DELETE_BIZ(biz_num)
      this.isDataInBiz = false
    },
    //해당 user에 biz여부 확인
    CheckIsDataInBiz() {
      if (this.bizInfo === undefined || this.bizInfo === null) {
        this.isDataInBiz = false
      } else {
        if (!Object.keys(this.bizInfo).includes('BIZ_NUM') || !this.bizInfo.BIZ_NUM) {
          this.isDataInBiz = false
        } else {
          this.isDataInBiz = true
        }
      }
    },
    interiorOpen() {
      this.SET_DIVIDE_INFO_USE('실내도')
      this.scrollToTop()
      this.isModalViewed = true
    },
    eventOpen() {
      this.scrollToTop()
      this.eventModalViewed = true
    },
    eventModalCancel() {
      this.eventModalViewed = false
    },
    onInput(e) {
      this.SET_STORE_STORE_CODE(e.target.value)
    },
    // [END] 버튼 이벤트 모음

    // CREATED 시 호출
    async initMyStore() {
      if (this.isLogin) {
        // 로그인 상태
        if (!this.userInfo.E_MAIL) {
          this.openModal('로그인을 해주세요.', false)
        } else if (!this.userInfo.STORE_ID) {
          await this.FETCH_STORE_CATEGORY_INFO()
          this.openModal(
            '가게가 존재하지 않습니다. 생성화면으로 이동합니다.',
            false
          )
        } else {
          const ids = {
            userId: this.userInfo.USER_ID,
            storeId: this.userInfo.STORE_ID,
            userNo: this.userInfo.USER_NO
          }
          await this.FETCH_STORE_INFO(ids)
          await this.FETCH_STORE_CATEGORY_INFO()
          const userNo = {
            userNo: this.userInfo.USER_NO
          }
          await this.FETCH_BIZ(userNo)
          this.CheckIsDataInBiz()

          // 건물 위치정보, 건물ID등 설정
          await this.mapDivideInfoSetting()

          // 이미지 불러오기
          if (!(this.storeInfo.ATTACH_ID === undefined || this.storeInfo.ATTACH_ID === null)) {
            const datas = { attachId: this.storeInfo.ATTACH_ID }
            await this.FETCH_ATTACH_INFO(datas)
            this.imgSrc = this.attachInfo.IMG_SRC
          }
        }
      } else {
        // 로그인 아닌 상태
        this.openModal('로그인을 해주세요.', false)
      }
    },
    // 모달창 설정 및 열기
    openModal(headerText, isConfirm) {
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    // createMode 변경해주고, 페이지의 최상단으로 스크롤 해주는 메소드
    setCreateMode(mode) {
      this.createMode = mode
    },
    // modifyMode 변경해주고, 페이지의 최상단으로 스크롤 해주는 메소드
    setModifyMode(mode) {
      this.modifyMode = mode
      this.scrollToTop()
    },
    // 최상단으로 스크롤 해주는 메소드
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    // create True : 가게 생성 / create False : 가게 수정
    async createAttachFile(create) {
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const attach_data = {
          config: config,
          attachInfo: frm
        }
        const res = await this.CREATE_ATTACH_INFO(attach_data)
        // 결과값이 확인 필요
        this.SET_ATTACH_FILE_ID(this.attachInfo.ATTACH_ID)
      }

      if (create) {
        await this.CREATE_STORE_INFO(this.userInfo.USER_NO)
        const res = await this.FETCH_USER_LOGIN()
      } else {
        this.UPDATE_STORE_INFO(this.userInfo.STORE_ID)
      }
    },
    // 가게 정보 수정
    async updateAttachFile() {
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const attach_data = {
          attachId: this.storeInfo.ATTACH_ID,
          config: config,
          attachInfo: frm
        }
        this.UPDATE_ATTACH_INFO(attach_data)
      }
      this.UPDATE_STORE_INFO(this.userInfo.STORE_ID)
    },
    // 가게정보 삭제
    deleteStoreInfo() {
      this.DELETE_ATTACH_INFO(this.storeInfo.ATTACH_ID)
      this.DELETE_STORE_INFO(this.userInfo.STORE_ID)
      this.SET_DEFAULT_STORE_INFO()
      this.deleteAttachFile()
      this.SET_STORE_ID('')
      this.deleteBizInfo(this.bizInfo.BIZ_NUM)
      this.$router.push('/')
    },
    async deleteAttachFile() {
      const oldAttachId = this.storeInfo.ATTACH_ID
      this.SET_ATTACH_FILE_ID(null)
      const res = await this.UPDATE_STORE_INFO_ASYNC(this.userInfo.STORE_ID)
      // res 결과값 정상이면 첨부파일 삭제
      if (res.status === 201) {
        this.DELETE_ATTACH_INFO(oldAttachId)
      }
    },
    /* mapDivideInfoSetting : */
    mapDivideInfoSetting() {
      const data = {
        TARGET_LAT: this.storeInfo.STORE_LAT,     //위도
        TARGET_LNG: this.storeInfo.STORE_LOT,    //경도
        TARGET_DV_CD: 'STORE',   //건물/가게
        TARGET_ID: this.storeInfo.STORE_ID,      //건물ID/가게ID
        TARGET_NM: this.storeInfo.STORE_NAME
      }
      this.SET_DIVIDE_INFO(data)

    },
    /* 가게 정보 가져오기 */
    async loadMyStoreInfo() {
      const userData = {
        userId: this.userInfo.USER_ID,
        storeId: this.userInfo.STORE_ID,
        userNo: this.userInfo.USER_NO
      }
      await this.FETCH_STORE_INFO(userData)
      await this.FETCH_STORE_CATEGORY_INFO()
      const userNo = {
        userNo: this.userInfo.USER_NO
      }
      await this.FETCH_BIZ(userNo)
      this.CheckIsDataInBiz()

      // 건물 위치정보, 건물ID등 설정
      await this.mapDivideInfoSetting()

      // 이미지 불러오기
      if (!(this.storeInfo.ATTACH_ID === undefined || this.storeInfo.ATTACH_ID === null)) {
        const attachData = { attachId: this.storeInfo.ATTACH_ID }
        await this.FETCH_ATTACH_INFO(attachData)
        this.imgSrc = this.attachInfo.IMG_SRC
      }

    },
    async myStoreModify() {
      const attachId = this.storeInfo.ATTACH_ID || ''
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      const len = photoFile.files.length
      const imgData = this.imgSrc || ''

      const isResult =
        (attachId === '') ? await this.createAttachFile(false)
          : (len !== 0) ? await this.updateAttachFile()
            : (imgData === '') ? await this.deleteAttachFile()
              : await this.myStoreUpdate()
      return isResult
    },
    async myStoreUpdate() {
      await this.UPDATE_STORE_INFO(this.userInfo.STORE_ID)
      return true
    },

    async checkMinMax(e,bf){
      // 최소 검증
      let isValid = this.validateMinLength(0, e.target.value)
      if (!isValid) {
        const msg = `최소 0이상 입력해주세요.`
        this.openModal(msg, false)
        if(bf==='F')
          this.SET_STORE_FLOORS(0)
        else
          this.SET_STORE_BASEMENT_FLOORS(0)
        return
      }
      // 최대 검증
      const isMaxValid = this.validateMaxLength(20, e.target.value)
      if (!isMaxValid) {
        const msg = `최대 20으로 입력해주세요.`
        this.openModal(msg, false)
        if(bf==='F')
          this.SET_STORE_FLOORS(0)
        else
          this.SET_STORE_BASEMENT_FLOORS(0)
        return
      }
    },
    validateMinLength(minLen, len) {
      let isValid = true
      if (minLen > len) {
        isValid = false
      }
      return isValid
    },
    validateMaxLength(maxLen, len) {
      let isValid = true
      if (maxLen < len) {
        isValid = false
      }
      return isValid
    },
  }
}
</script>

<style></style>
