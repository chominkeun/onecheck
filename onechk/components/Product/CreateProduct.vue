<template>
  <div>
    <div class='data-type2' v-on:scroll.passive='onScroll'>

      <table>
        <colgroup>
          <col style='width:230px' />
          <col style='width:auto' />
        </colgroup>
        <tbody>
        <table-item title='상품이름'>
          <VInput
            v-if='modifyMode'
            v-on:blur='checkDuplicate'
            type='text'
            minlength='1'
            placeholder='상품 이름을 입력하세요.'
            style='width:578px'
            :value='prtInfo.PRT_NAME'
            @input='SET_PRT_NAME'
          />
          <template v-else>{{ prtInfo.PRT_NAME }}</template>
          <p class='err-msg' v-show='!availableName'> {{ availableErrMsg }} </p>
        </table-item>
        <table-item title='상품 사진'>
          <div class='add-photo'>
            <v-upload ref="imgFile"
                      :childMode='modifyMode'
                      :imgSrc='imgSrc'>
            </v-upload>
          </div>
        </table-item>
        <table-item title='상품 가격'>
          <VInput
            v-if='modifyMode'
            type='number'
            min='0'
            placeholder='상품 가격'
            style='width:112px;'
            :value='prtInfo.PRICE'
            @input='SET_PRICE'
          />
          <template v-else>{{ prtInfo.PRICE | comma }}</template>
          원
        </table-item>
        <table-item title='상품 수량'>
          <VInput
            v-if='modifyMode'
            type='number'
            placeholder='상품 수량'
            min='0'
            style='width:112px;'
            :value='prtInfo.PRT_QTY'
            @input='SET_PRT_QTY'
          />
          <template v-else>{{ prtInfo.PRT_QTY | comma }}</template>
          개
        </table-item>
        <table-item title='상품 카테고리'>
          <div v-if='modifyMode'>
            <!-- 상품 카테고리 리스트 중 전체 제외 -->
            <select
              style='width:112px;'
              :value='prtInfo.CATEGORY_ID'
              @input='onInput'
            >
              <option
                v-for='(option, index) in catList2'
                :key='index'
                v-bind:value='option.CATEGORY_ID'
              >
                {{ option.CATEGORY_NAME }}
              </option>
            </select>
          </div>

          <template v-else>{{ GET_CATEGORY_NAME }}
          </template>
        </table-item>
        <table-item title='옵션'
                    style='max-height:200px'
        >
          <div v-if='modifyMode'>
            <VBtn class='btn-type2 st1'
                  @click='editOptPopup()'>
              옵션 등록 및 편집
            </VBtn>
          </div>
          <div v-for='(group, index) in prtInfo.options'
               :key='index'
               style='padding-top: 10px'>
            <span style='width:100px'> {{ group.G_NAME }} : </span>
            <span style='width:60px'> {{ printOpts(group) }}</span>
          </div>
        </table-item>
        <table-item title='상품 설명'>
          <div v-if='modifyMode' class='textarea'>
            <VInput
              type='textarea'
              style='width:100%;height:130px'
              maxlength='500'
              placeholder='상품설명을 입력하세요'
              :value='prtInfo.DESC'
              @input='SET_DESC'
            />
            <span class='byte'>{{ GET_DESC_LENGTH }} / 500</span>
          </div>
          <div v-else class='textarea'>{{ prtInfo.DESC }}</div>
        </table-item>
        </tbody>
      </table>
    </div>

    <div class='btn-box align-r'>
      <VBtn class='btn-type2 st6' @click='updateSelectedMenu'
      >취소
      </VBtn>
      <VBtn v-if='!modifyMode' class='btn-type2 st1' @click='changeModifyMode'>정보편집</VBtn>
      <VBtn
        v-else-if='modifyMode && !createMode'
        class='btn-type2 st1'
        @click='modifyInfoFinished'
      >수정완료
      </VBtn>
      <VBtn
        v-else-if='modifyMode && createMode'
        class='btn-type2 st1'
        @click='submit'
      >상품등록
      </VBtn>
    </div>

    <option-edit-popup
      :isModalOptEdit.sync='isModalOptEdit'
      :prtName='prtInfo.PRT_NAME'
      @applyOpt='applyOpt'
    />

    <v-modal
      v-show='isModalVisible'
      :text='modalText'
      :isConfirm='isModalConfirm'
      @onCancel='onModalCancel'
      @onConfirm='onModalConfirm'
    />
  </div>

</template>

<script>
import TEMP from '../../assets/TempData'
import CONST from '../../constants/Product'
import TableItem from '../common/TableItem.vue'
import axios from 'axios'
import OptionEditPopup from './OptionEditPopup.vue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'


export default {
  name: 'CreateProduct',
  components: { TableItem, OptionEditPopup },
  computed: {
    ...mapState(TEMP.STORE_PATH.USER, ['userInfo']),
    ...mapState(TEMP.STORE_PATH.ATTACH, ['attachInfo']),
    ...mapState(TEMP.STORE_PATH.PRODUCT, [
      'catList',
      'prtInfo'
    ]),
    ...mapGetters(TEMP.STORE_PATH.PRODUCT, [
      'GET_CATEGORY_NAME',
      'GET_DESC_LENGTH'
    ])
  },
  data() {
    return {
      form: {
        pdtName: '',
        pdtPrice: '',
        pdtQty: '',
        explanation: '',
        selected: ''
      },
      imgSrc: '',
      myStoreId: '',
      createMode: false,
      modifyMode: false,
      isModalVisible: false,
      isModalConfirm: false,
      isModalOptEdit: false,
      modalText: '',
      catList2: [],
      availableName: true,
      availableErrMsg: '이미 사용중인 상품명 입니다.'
    }
  },
  created() {
    this.funcInitCreateProduct()
    //'전체' 미 포함
    this.setCategotyList()
  },
  methods: {
    ...mapActions(TEMP.STORE_PATH.ATTACH, [
      'FETCH_ATTACH_INFO',
      'CREATE_ATTACH_INFO',
      'UPDATE_ATTACH_INFO',
      'DELETE_ATTACH_INFO'
    ]),
    ...mapActions(TEMP.STORE_PATH.PRODUCT, [
      'FETCH_PRODUCT_CATEGORY_LIST',
      'UPDATE_PRODUCT_INFO',
      'FETCH_OPTION_REL',
      'FETCH_DUPLICATE_PRODUCT_NAME',
      'FETCH_DUPLICATE_PRODUCT_ID_NAME'
    ]),
    ...mapActions(TEMP.STORE_PATH.OPTION, [
      'FETCH_PRT_OPT_LIST_CHECK',
      'ACT_PRT_OPT_LIST'
    ]),
    ...mapMutations(TEMP.STORE_PATH.PRODUCT, [
      'SET_PRT_LIST',
      'SET_PRT_INFO',
      'SET_PRT_CLEAR',
      'SET_PRT_NAME',
      'SET_PRICE',
      'SET_PRT_QTY',
      'SET_CATEGORY_ID',
      'SET_ATTACH_ID',
      'SET_DESC',
      'SET_DEFAULT_PRODUCT_INFO',
      'SET_OPTIONS'
    ]),
    ...mapMutations(TEMP.STORE_PATH.ATTACH, [
      'SET_ATTACH_INFO_CLEAR'
    ]),
    ...mapMutations(TEMP.STORE_PATH.OPTION, [
      'SET_OPT_LIST',
      'SET_STORE_ID'
    ]),
    // [START] 버튼 이벤트 모음
    /* 취소 버튼 */
    updateSelectedMenu() {
      this.funcProductInfoClear()
      this.$emit('updateSelectedMenu', CONST.MENUBAR_ITEMS[0].id)
    },
    /* 등록 버튼 */
    async submit() {
      const isValid = await this.validateProduct()
      if(!isValid) {
        return
      }
      this.scrollToTop()
      this.$nuxt.$loading.start()

      let frm = new FormData()
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      frm.append('img', photoFile.files[0])
      frm.append('prt_name', this.prtInfo.PRT_NAME)
      frm.append('price', this.prtInfo.PRICE)
      frm.append('prt_qty', this.prtInfo.PRT_QTY)
      frm.append('desc', this.prtInfo.DESC)
      frm.append('category_id', this.prtInfo.CATEGORY_ID)
      frm.append('store_id', this.userInfo.STORE_ID)

      const apiUrl = 'api/product/' + this.userInfo.STORE_ID
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const res = await axios.post(apiUrl, frm, config)

      if (res.status === 201) {
        const bodyText = '입력한 상품이 등록되었습니다.'
        this.funcOpenUserModal(bodyText)
        if (this.prtInfo.options) {
          //추가적으로 옵션이 존재 할 경우 입력처리
          const res2 = await axios.get(`api/product/getMaxId/${this.userInfo.STORE_ID}`)
          if (res2.status === 200) {
            const maxPrtId = res2.data.maxPrtId
            await this.fetchOption(maxPrtId)
          }
        }
        this.funcProductInfoClear()
      } else {
        const bodyText = '상품 입력이 실패하였습니다.'
        this.funcOpenUserModal(bodyText)
      }

      this.$nuxt.$loading.finish()
    },
    /* 옵션 등록 및 편집 버튼시 "옵션추가(상품명)" 모달화면 활성화 */
    async editOptPopup() {
      const apiUrl = '/api/prtopt/getCount/' + this.userInfo.STORE_ID
      const res = await axios.get(apiUrl)
      if (res.status === 200) {
        const count = res.data.count || 0
        if (count === 0) {
          const bodyText = `옵션 목록이 등록되어 있지 않습니다.`
          this.funcOpenUserModal(bodyText)
          return
        }
        this.isModalOptEdit = true
      }
    },
    /* 모달창에서 확인버튼을 눌렀을때 실행되는 메소드 */
    onModalConfirm() {
      this.isModalVisible = false
    },

    /* 정보편집 버튼 */
    changeModifyMode() {
      this.setModifyMode(true)
    },
    /* modifyMode를 변경해주고, 페이지의 최상단으로 스크롤 해주는 메소드 */
    setModifyMode(mode) {
      this.modifyMode = mode
      this.scrollToTop()
    },
    /* 최상단으로 스크롤 해주는 메소드 */
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    /* 수정완료 */
    async modifyInfoFinished() {
      const isValid = await this.validateProduct()
      if(!isValid) {
        return
      }
      this.scrollToTop()
      this.$nuxt.$loading.start()
      await this.myProductModify()
      this.setModifyMode(false)
      this.$nuxt.$loading.finish()
    },
    /* 상품의 첨부파일 삭제하고 저장  */
    async deleteAttachFile() {
      const oldAttachId = this.prtInfo.ATTACH_ID
      this.SET_ATTACH_ID(null)
      const res = await this.UPDATE_PRODUCT_INFO(this.prtInfo.PRT_ID)
      /* res 결과값 정상이면 첨부파일 삭제  */
      if (res.status === 201) {
        this.DELETE_ATTACH_INFO(oldAttachId)
      }
    },
    /* 모달 창 취소 */
    onModalCancel() {
      this.isModalVisible = false
    },

    /* 상품옵션 모달창에서 적용 버튼 클릭 시*/
    applyOpt(applyoptList) {
      this.SET_OPTIONS(applyoptList)
      this.isModalOptEdit = false
    },
    /*  */
    onInput(e) {
      this.SET_CATEGORY_ID(e.target.value)
    },
    // [END] 버튼 이벤트 모음
    /* 모달창을 설정하고 여는 메소드 */
    funcOpenUserModal(modalText, isConfirm) {
      this.modalText = modalText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    /* 초기값 설정 */
    funcInitCreateProduct() {
      if (this.userInfo) {
        if (this.userInfo.STORE_ID) {
          this.myStoreId = this.userInfo.STORE_ID
          // this.FETCH_PRODUCT_CATEGORY_LIST(this.myStoreId)
          if (!this.prtInfo.PRT_ID || this.prtInfo.PRT_ID === '') {
            this.funcProductInfoClear()
            this.imgSrc = ''
            this.createMode = true
            this.modifyMode = true
          } else {
            this.funcSetPrtInfo()
          }
        }
      }
    },
    /* 상품정보 설정 */
    async funcSetPrtInfo() {
      this.form.selected = this.prtInfo.CATEGORY_ID
      /* 이미지 불러오기 */
      const attachId = this.prtInfo.ATTACH_ID
      if (!(attachId === undefined || attachId === null)) {
        const datas = { attachId: attachId }
        await this.FETCH_ATTACH_INFO(datas)
        this.imgSrc = this.attachInfo.IMG_SRC
      }
    },
    /*
      create True  : 가게 생성
      create False : 가게 수정
    */
    async funcCreateAttachFile(create) {
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
        this.SET_ATTACH_ID(this.attachInfo.ATTACH_ID)
      }
      if (!create) {
        // 변경되지 않은 경우에 404 error로 인해 그 다음 흐름은 진행 불가 되어
        // try, catch로 예외 처리
        try {
          await this.UPDATE_PRODUCT_INFO(this.prtInfo.PRT_ID)
        } catch (error) {
        }
        this.fetchOption(this.prtInfo.PRT_ID)
      }
    },
    /* 가게 정보 수정 */
    async funcUpdateAttachFile() {
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      if (photoFile.files.length !== 0) {
        let frm = new FormData()
        frm.append('img', photoFile.files[0])
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const attach_data = {
          attachId: this.prtInfo.ATTACH_ID,
          config: config,
          attachInfo: frm
        }
        await this.UPDATE_ATTACH_INFO(attach_data)
      }
      try {
        await this.UPDATE_PRODUCT_INFO(this.prtInfo.PRT_ID)
      } catch (error) {
      }
    },
    /* 상품 초기화 */
    funcProductInfoClear() {
      this.imgSrc = ''
      this.SET_PRT_CLEAR()
      this.SET_ATTACH_INFO_CLEAR()
      this.SET_OPTIONS([])
    },
    /* 카테고리 필터 */
    setCategotyList() {
      if (this.catList.length !== 0) {
        //전체를 제외 추후 소스 보안 필요..
        this.catList2 = this.catList.filter(item => {
          return item.CATEGORY_ID !== -1
        })
      }
    },
    /* 옵션 데이터 모두 출력 */
    printOpts(group) {
      if ((!group) || (!group.O_NAMES)) return
      const optNames = []
      const opts = group.O_NAMES.filter(oName => oName)
      opts.forEach(opt => {
        let name = '● ' + opt.O_NAME
        optNames.push(name)
      })
      return optNames.join(' ')
    },
    /* 옵션 DB 적용 */
    async fetchOption(PRT_ID) {
      //originOpts 및 removeOpts가 존재하지 않는다는 건
      //옵션 편집 자체가 없었다고 판단
      const options = this.prtInfo.options
      if (!options.originOpts && !options.removeOpts) return

      let optionRelPayload = {
        PRT_ID,
        options
      }
      await this.FETCH_OPTION_REL(optionRelPayload)
    },
    /* 상품 수정 */
    async myProductModify() {
      const attachId = this.prtInfo.ATTACH_ID || ''
      const photoFile = this.$refs.imgFile.getUpLoadFiles()
      const len = photoFile.files.length
      const imgData = this.imgSrc || ''

      const isResult =
        (attachId === '') ? await this.funcCreateAttachFile(false)
          : (len !== 0) ? await this.funcUpdateAttachFile()
            : (imgData === '') ? await this.deleteAttachFile()
              : await this.myProductUpdate()
      return isResult
    },
    /* 상품 정보 업데이트 */
    async myProductUpdate() {
      await this.UPDATE_PRODUCT_INFO(this.prtInfo.PRT_ID)
      await this.fetchOption(this.prtInfo.PRT_ID)
      return true
    },
    /* 검증 */
    async validateProduct() {
      let isValid = false

      if (!this.availableName){
        alert('이미 사용중인 상품이름입니다.')
        return isValid
      }
      isValid = (this.prtInfo.PRT_NAME === '') ? false : true

      if (isValid) {
        isValid = (this.prtInfo.PRICE === ''  || this.prtInfo.PRICE < 0 ) ? false : true
      } else {
        alert('상품이름을 입력해주세요.')
        return isValid
      }

      if (isValid) {
        isValid = (this.prtInfo.PRT_QTY === ''  || this.prtInfo.PRT_QTY < 0 ) ? false : true
      } else {
        alert('상품 가격을 입력해주세요.')
        return isValid
      }

      if (isValid) {
        isValid = (this.prtInfo.CATEGORY_ID === '') ? false : true
      } else {
        alert('상품 수량을 입력해주세요.')
        return isValid
      }
      if (!isValid) {
        alert('상품 카테고리를 입력해주세요.')
        return isValid
      }

      return isValid
    },
    async checkDuplicate() {
      let res
      if (this.createMode) {
        // 생성 시 가게에 중복 상품명 검색
        res = await this.FETCH_DUPLICATE_PRODUCT_NAME()
      } else {
        // 수정 시 가게에 중복 상품명 검색, 자기 상품번호를 제외
        res = await this.FETCH_DUPLICATE_PRODUCT_ID_NAME()
      }
      if ( res.status === 200 ){
        (!res.data.result) ? this.availableName = false : this.availableName = true
      }
    }

  }

}
</script>
