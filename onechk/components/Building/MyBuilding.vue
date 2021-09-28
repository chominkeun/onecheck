<template>
  <div>
    <div class='data-type2'>
      <table>
        <colgroup>
          <col style='width:230px' />
          <col style='width:auto' />
        </colgroup>
        <tbody>
        <table-item title='건물명'>
          <VInput
            v-if='modifyMode'
            type='text'
            style='width:578px'
            placeholder='건물명 입력은 필수 입니다.'
            :value='buildingInfo.BUILDING_NAME'
            @input='SET_BUILDING_NAME'
          />
          <template v-else>{{ buildingInfo.BUILDING_NAME }}
          </template>
        </table-item>
        <table-item v-if='!modifyMode' title='층수'>
          <template>
            지상 : {{ buildingInfo.BUILDING_FLOORS }}층,
            지하 : {{ buildingInfo.BUILDING_BASEMENT_FLOORS }}층
          </template>
        </table-item>
        <table-item v-if='modifyMode' title='지상 층수'>
          <VInput
            type="number"
            style='width:578px'
            placeholder='층수 입력은 필수 입니다.'
            v-on:blur='checkMinMax($event)'
            :value='buildingInfo.BUILDING_FLOORS'
            @input='SET_BUILDING_FLOORS'
          />
        </table-item>
        <table-item v-if='modifyMode' title='지하 층수'>
          <VInput
            type="number"
            style='width:578px'
            placeholder='층수 입력은 필수 입니다.'
            v-on:blur='checkMinMax($event)'
            :value='buildingInfo.BUILDING_BASEMENT_FLOORS'
            @input='SET_BUILDING_BASEMENT_FLOORS'
          />
        </table-item>
        <table-item title='건물 사진'>
          <div class='add-photo'>
            <v-upload ref="imgFile"
                      :childMode='modifyMode'
                      :imgSrc='imgSrc'>
            </v-upload>
          </div>
        </table-item>
        <table-item title='건물 주소'>
          <search-address
            v-if='modifyMode'
            :address='buildingInfo.BUILDING_ADDRESS'
            @updateAddress='SET_BUILDING_ADDRESS'
            @updateLatLot='SET_BUILDING_LATLOT'
          ></search-address>
          <template v-else>{{ buildingInfo.BUILDING_ADDRESS }}</template>
        </table-item>
        <table-item title='세부위치'>
          <div class='detail-map' v-if='isGoogleMapVisible'>
            <google-map
              :lat='buildingInfo.BUILDING_LAT'
              :lot='buildingInfo.BUILDING_LOT'
              :editable='modifyMode'
              @update='SET_BUILDING_LATLOT'
            />
            <p class='txt'>
              건물의 정확한 위치에 지도를 클릭하거나,
              마커를 옮겨주세요.
            </p>
          </div>
        </table-item>
        <table-item title='건물 설명'>
          <div v-if='modifyMode' class='textarea'>
            <VInput
              :value='buildingInfo.BUILDING_DESC'
              type='textarea'
              style='width:100%;height:170px'
              maxlength='500'
              placeholder='건물 설명을 입력하세요.'
              @input='SET_BUILDING_DESC'
            ></VInput>
            <span class='byte'>{{ buildingInfo.BUILDING_DESC }} / 500</span>
          </div>
          <div v-else class='textarea'>{{ buildingInfo.BUILDING_DESC }}</div>
        </table-item>
          <table-item title='건물 실내도 (선택)' v-if='!modifyMode&&!createMode'>
              <VBtn class='btn-type2 st6' style='width:145px' @click='isModalViewed=true'>실내도 관리</VBtn>
          </table-item>
        </tbody>
      </table>
    </div>
    <!-- //table -->
    <div class='btn-box align-r'>
      <VBtn v-if='!modifyMode' class='btn-type2 st5' @click='deleteInfo'
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
      <VBtn v-else-if='modifyMode && !createMode' class='btn-type2 st1' @click='modifyInfoFinished'
      >수정완료
      </VBtn
      >
      <VBtn v-else-if='modifyMode && createMode' class='btn-type2 st1' @click='createInfoFinished'
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
  </div>
</template>

<script>
import SearchAddress from '../common/SearchAddress.vue'
import TableItem from '../common/TableItem.vue'
import GoogleMap from './googleMap.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import UserModal from '../common/UserModal.vue'
import VModal from '../common/VModal.vue'

export default {
  components: {
    TableItem,
    SearchAddress,
    GoogleMap,
    UserModal,
    VModal
  },
  created() {
    this.initMyBuilding()
  },
  destroyed() {
    this.SET_DEFAULT_DIVIDE_INFO()
  },
  computed: {
    ...mapState('building/building', ['buildingInfo']),
    ...mapState('user/user', ['userInfo']),
    ...mapState('attach/attach', ['attachInfo']),
    ...mapState('sensor/sensor', ['divideInfo']),
    isGoogleMapVisible() {
      return this.buildingInfo.BUILDING_LAT || this.buildingInfo.BUILDING_LOT
    }
  },
  data() {
    return {
      //TODO : 백엔드에서 사용하는것과 변수명 맞춰서 변경하여 사용할것!!
      createMode: false,
      modifyMode: false,
      deleteMode: false,

      modalText: '',
      isModalConfirm: false,
      isModalVisible: false,

      imgSrc: '',
      isModalViewed: false
    }
  },
  methods: {
    ...mapActions('user/user', [
      'FETCH_USER_BUILDING_INFO'
    ]),
    ...mapActions('building/building', [
      'FETCH_BUILDING_INFO',
      'UPDATE_BUILDING_INFO',
      'DELETE_BUILDING_INFO',
      'CREATE_BUILDING_INFO',
      'UPDATE_BUILDING_INFO_ASYNC'
    ]),
    ...mapMutations('user/user', [
      'SET_BUILDING_ID'
    ]),
    ...mapMutations('building/building', [
      'SET_BUILDING_LATLOT',
      'SET_DEFAULT_BUILDING_INFO',
      'SET_BUILDING_INFO',
      'SET_BUILDING_NAME',
      'SET_BUILDING_ADDRESS',
      'SET_BUILDING_DESC',
      'SET_BUILDING_ATTACH_FILE_ID',
      'SET_BUILDING_FLOORS',
      'SET_BUILDING_BASEMENT_FLOORS'
    ]),
    ...mapActions('attach/attach', [
      'FETCH_ATTACH_INFO',
      'CREATE_ATTACH_INFO',
      'UPDATE_ATTACH_INFO',
      'DELETE_ATTACH_INFO'
    ]),
    ...mapMutations('attach/attach', [
      'SET_ATTACH_INFO',
      'SET_ATTACH_ID',
      'SET_ATTACH_FILE'
    ]),
    ...mapMutations('sensor/sensor', [
      'SET_DIVIDE_INFO',
      'SET_DIVIDE_INFO_USE',
      'SET_DEFAULT_DIVIDE_INFO'
    ]),
    // 버튼 이벤트 모음
    deleteInfo() {
      // 정보삭제 버튼
      this.openModal('정말 건물정보를 삭제하시겠습니까?', true)
      this.deleteMode = true
    },
    goPrev() {
      // 뒤로가기 버튼
      this.setModifyMode(false)
      this.setCreateMode(false)
      this.initMyBuilding()
    },
    modifyInfo() {
      // 정보편집 버튼
      this.setModifyMode(true)
    },
    async modifyInfoFinished() {
      //수정완료 버튼
      if (this.buildingInfo.ATTACH_ID === undefined || this.buildingInfo.ATTACH_ID === null) {
        this.createAttachFile(false)
      } else {
        await this.myBuildingModify()
        this.setModifyMode(false)
      }
      // TODO: 건물정보 업데이트하는 통신수행.
    },
    async createInfoFinished() {
      //생성완료 버튼
      const res = await this.createAttachFile(true)
    },
    setModifyMode(mode) {
      // modifyMode를 변경해주고, 페이지의 최상단으로 스크롤 해주는 메소드
      this.modifyMode = mode
      this.scrollToTop()
    },
    setCreateMode(mode) {
      // createMode를 변경해주고, 페이지의 최상단으로 스크롤 해주는 메소드
      this.createMode = mode
      this.scrollToTop()
    },
    scrollToTop() {
      // 최상단으로 스크롤 해주는 메소드
      window.scrollTo(0, 0)
    },
    // 버튼 이벤트 모음
    async initMyBuilding() {
      this.SET_DEFAULT_BUILDING_INFO()
      // MyBuilding.vue를 열때 userInfo의 상황에 따라서 분기처리하는 메소드
      if (this.userInfo) {
        if (!this.userInfo.E_MAIL) {
          this.openModal('로그인을 해주세요.', false)
        } else if (!this.userInfo.BUILDING_ID) {
          this.openModal(
            '건물이 존재하지 않습니다. 생성화면으로 이동합니다.',
            false
          )
        } else {
          await this.FETCH_BUILDING_INFO(this.userInfo.USER_NO)
          // 건물 위치정보, 건물ID등 설정
          await this.mapDivideInfoSetting()
          // 이미지 불러오기
          if (!(this.buildingInfo.ATTACH_ID === undefined || this.buildingInfo.ATTACH_ID === null)) {
            const datas = { attachId: this.buildingInfo.ATTACH_ID }
            await this.FETCH_ATTACH_INFO(datas)
            this.imgSrc = this.attachInfo.IMG_SRC
          }
        }
      } else {
        this.openModal('로그인을 해주세요.', false)
      }
    },
    onModalCancel() {
      this.isModalVisible = false
    },
    onModalConfirm() {
      if (this.userInfo) {
        if (this.deleteMode) {
          //DB 확인 -> sensor 테이블 생기면서 추가 트리거 필요
          this.DELETE_BUILDING_INFO(this.userInfo.BUILDING_ID)
          this.SET_DEFAULT_BUILDING_INFO()
          this.SET_BUILDING_ID(null)
          this.$router.push('/')
        } else if (!this.userInfo.E_MAIL) {
          this.$router.push('/login')
        } else if (!this.userInfo.BUILDING_ID) {
          this.createMode = true
          this.modifyMode = true
          //this.SET_DEFAULT_BUILDING_INFO() -> 0827 체크체크
        }
      } else {
        this.$router.push('/login')
      }
      this.isModalVisible = false
    },
    openModal(headerText, isConfirm) {
      // 모달창을 설정하고 여는 메소드
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    //건물 정보 수정
    async updateAttachFile() {
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const datas = {
          attachId: this.buildingInfo.ATTACH_ID,
          config: config,
          attachInfo: frm
        }
        await this.UPDATE_ATTACH_INFO(datas)
      }
      this.UPDATE_BUILDING_INFO(this.userInfo.BUILDING_ID)
    },
    async createAttachFile(create) {
      if(this.buildingInfo.BUILDING_NAME !== '' && this.buildingInfo.BUILDING_FLOORS !== '' && this.buildingInfo.BUILDING_BASEMENT_FLOORS !== '') {
        const photoFile = this.$refs.imgFile.getUpLoadFiles()
        if (photoFile.files.length !== 0) {
          let frm = new FormData()
          frm.append('img', photoFile.files[0])
          const config = { headers: { 'Content-Type': 'multipart/form-data' } }
          const datas = {
            config: config,
            attachInfo: frm
          }
          const res = await this.CREATE_ATTACH_INFO(datas)
          this.SET_BUILDING_ATTACH_FILE_ID(this.attachInfo.ATTACH_ID)
        }

        if (create) {
          this.CREATE_BUILDING_INFO(this.userInfo.USER_NO)
          this.FETCH_USER_BUILDING_INFO({ url: `building/${this.userInfo.USER_NO}` })
        } else {
          this.UPDATE_BUILDING_INFO(this.userInfo.BUILDING_ID)
        }
        await this.FETCH_BUILDING_INFO(this.userInfo.USER_NO)
        await this.mapDivideInfoSetting()
        this.setModifyMode(false)
        this.setCreateMode(false)
      }
      else {
        if(this.buildingInfo.BUILDING_NAME === '') {
          alert("건물명을 입력하세요!")
        }
        else {
          alert("층수를 올바르게 입력하세요!")
        }
      }

    },
    mapDivideInfoSetting() {
      const data = {
        TARGET_LAT: this.buildingInfo.BUILDING_LAT,     //위도
        TARGET_LNG: this.buildingInfo.BUILDING_LOT,    //경도
        TARGET_DV_CD: 'BUILDING',   //건물/가게
        TARGET_ID: this.buildingInfo.BUILDING_ID,      //건물ID/가게ID
        TARGET_NM: this.buildingInfo.BUILDING_NAME
      }
      this.SET_DIVIDE_INFO(data)
    },
    async deleteAttachFile() {
      const oldAttachId = this.buildingInfo.ATTACH_ID
      this.SET_BUILDING_ATTACH_FILE_ID(null)
      const res = await this.UPDATE_BUILDING_INFO_ASYNC(this.buildingInfo.BUILDING_ID)
      // res 결과값 정상이면 첨부파일 삭제
      if (res.status === 201) {
        this.DELETE_ATTACH_INFO(oldAttachId)
      }
    },
    async myBuildingModify() {
      const attachId = this.buildingInfo.ATTACH_ID || ''
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      const len = photoFile.files.length
      const imgData = this.imgSrc || ''

      const isResult =
        (attachId === '') ? await this.createAttachFile(false)
          : (len !== 0) ? await this.updateAttachFile()
            : (imgData === '') ? await this.deleteAttachFile()
              : await this.myBuildingUpdate()
      return isResult
    },
    async myBuildingUpdate() {
      await this.UPDATE_BUILDING_INFO(this.userInfo.BUILDING_ID)
      return true
    },
    checkMinMax(event) {
      if(event.target.value > 100 || event.target.value < 1) {
        this.openModal('1~100 사이의 숫자를 입력해주세요')
        event.target.value = ''
      }
    }
  }
}
</script>

<style></style>
