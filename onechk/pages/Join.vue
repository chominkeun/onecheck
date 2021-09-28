<template>
  <div class='cont-box'>
    <h2 class='title-type1'>회원가입</h2>
    <!-- table -->
    <div class='data-type2'>
      <table>
        <colgroup>
          <col style='width:230px' />
          <col style='width:auto' />
        </colgroup>
        <tbody>
        <table-item title='아이디'>
          <VInput
            v-on:blur='checkDuplicate' v-model.trim='$v.id.$model' type='text' id='id' style='width:578px' />
          <div class='error' v-if='!$v.id.required'>아이디 를 입력하세요.</div>
          <div class='error' v-if='!$v.id.minLength'>아이디 는 최소한 {{ $v.id.$params.minLength.min }} 자리 이상 입력하세요.</div>
          <p class='err-msg' v-show='!availableId'> {{ availableErrMsg[0] }} </p>
        </table-item>

        <table-item title='비밀번호'
        >
          <VInput v-model.trim='$v.password.$model' type='text' style='width:578px'
          />
          <div class='error' v-if='!$v.password.required'>패스워드 를 입력하세요.</div>
          <div class='error' v-if='!$v.password.minLength'>패스워드 는 최소한 {{ $v.password.$params.minLength.min }} 자리 이상
            입력하세요.
          </div>
        </table-item>

        <table-item title='이름'
        >
          <VInput v-model.trim='$v.name.$model' type='text' style='width:578px' />
          <div class='error' v-if='!$v.name.required'>이름 을 입력하세요.</div>
          <div class='error' v-if='!$v.name.minLength'>이름 은 최소한 {{ $v.name.$params.minLength.min }} 자리 이상 입력하세요.</div>
        </table-item>


        <table-item title='이메일'
        >
          <VInput v-on:blur='checkDuplicate' v-model.trim='$v.email.$model' type='email' id='email'
                  style='width:578px;' />
          <div class='error' v-if='!$v.email.required'>이메일 을 입력하세요.</div>
          <div class='error' v-if='!$v.email.isEmailAvailable'>이메일 을 사용할 수 업습니다. (10자 미만)</div>
          <div class='error' v-if='!$v.email.email'>이메일 이 올바른 형식의 주소가 아닙니다.</div>
          <p class='err-msg' v-show='!availableEmail'> {{ availableErrMsg[1] }} </p>
        </table-item>

        <table-item title='전화번호'
        >
          <VInput v-on:blur='checkDuplicate' v-model.trim='$v.telnum.$model' type='text' id='telnum'
                  style='width:578px;' />
          <div class='error' v-if='!$v.telnum.required'>전화번호 를 입력하세요.</div>
          <div class='error' v-if='!$v.telnum.minLength'>전화번호 는 최소한 {{ $v.telnum.$params.minLength.min }} 자리 이상 입력하세요.
          </div>
          <p class='err-msg' v-show='!availableTelnum'> {{ availableErrMsg[2] }} </p>
        </table-item>

        </tbody>
      </table>
    </div>
    <div class='btn-box'>
      <VBtn @click='toBack' class='btn-type1 st3'>취소</VBtn>
      <VBtn v-if='createMode' @click='addMemberShip()' class='btn-type1 st1'>가입완료</VBtn>
      <VBtn v-else-if='!createMode' @click='modifyMemberShip()' class='btn-type1 st1'>수정완료</VBtn>
    </div>

    <user-modal v-show='isUserModalVisible'>
      <h3 slot='header'>{{ modalHeaderText }}</h3>
      <div slot='body' />
      <div slot='footer'>
        <button class='modal-default-button' @click='onUserModalConfirm'>
          확인
        </button>
      </div>
    </user-modal>

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

import TableItem from '../components/common/TableItem.vue'
import { required, minLength, email } from 'vuelidate/lib/validators'
import { isEmailAvailable } from '../validate/validators'
import UserModal from '../components/common/UserModal.vue'
import VModal from '../components/common/VModal.vue'

import { fetchCommonAxiosGet } from '../api/common/commonApi.js'
import { mapState, mapActions } from 'vuex'

import UserApiService from '../api/user/userApi.js'


export default {
  components: {
    TableItem,
    UserModal,
    VModal
  },
  created() {
    this.funcInitJoin()
  },
  //
  computed: {
    ...mapState('user/user', [
      'userInfo',
      'isLogin'
    ])
  },
  mounted() {
    this.availableErrMsg[0] = '이미 사용중인 아이디 입니다.'
    this.availableErrMsg[1] = '이미 사용중인 이메일 입니다.'
    this.availableErrMsg[2] = '이미 사용중인 전화번호 입니다.'
  },

  data() {
    return {
      id: '',
      password: '',
      name: '',
      email: '',
      telnum: '',
      availableErrMsg: [],
      availableEmail: true,
      availableId: true,
      availableTelnum: true,

      modalHeaderText: '',
      isUserModalVisible: false,

      modalText: '',
      isModalConfirm: false,
      isModalVisible: false,

      createMode: false,
      modifyMode: false


    }
  },
  //
  validations: {
    id: { required, minLength: minLength(1) },
    password: { required, minLength: minLength(6) },
    name: { required, minLength: minLength(2) },
    email: { required, email, isEmailAvailable },
    telnum: { required, minLength: minLength(9) }

  },

  methods: {
    //
    ...mapActions('user/user', ['FETCH_USER_RE_LOGIN']),
    //
    toBack() {
      this.$router.go(-1)
    },
    async checkDuplicate(e) {
      if (e.target.id === 'id') {
        if (this.createMode && this.$v.id.minLength) {
          fetchCommonAxiosGet(`user/name/USER_ID/value/${e.target.value}`)
            .then(response => {
              (response.data.datas !== 0) ? this.availableId = false : this.availableId = true
            })
            .catch(error => {
              console.log('error')
            })
        }
      } else if (e.target.id === 'email') {
        if (!this.createMode && (e.target.value === this.userInfo.E_MAIL)) {
          this.availableEmail = true
          return
        }
        if (this.$v.email.email && this.$v.email.isEmailAvailable) {
          fetchCommonAxiosGet(`user/name/E_MAIL/value/${e.target.value}`)
            .then(response => {
              (response.data.datas !== 0) ? this.availableEmail = false : this.availableEmail = true
            })
            .catch(error => console.log(error))
        }
      } else if (e.target.id === 'telnum') {
        if (!this.createMode && (e.target.value === this.userInfo.PHONE_NUM)) {
          this.availableTelnum = true
          return
        }
        if (this.$v.telnum.minLength) {
          fetchCommonAxiosGet(`user/name/PHONE_NUM/value/${e.target.value}`)
            .then(response => {
              (response.data.datas !== 0) ? this.availableTelnum = false : this.availableTelnum = true
            })
            .catch(error => console.log(error))
        }
      } else {
        console.log('err else', e.target.id)
      }
    },
    //
    async addMemberShip() {
      this.funcOpenModal('회원정보를 등록하시겠습니까?', true)
    },
    //
    async modifyMemberShip() {
      this.funcOpenModal('회원정보를 수정하시겠습니까?', true)
    },

    onUserModalConfirm() {
      this.isUserModalVisible = false
    },
    //
    onModalCancel() {
      this.isModalVisible = false
      return
    },
    //
    async onModalConfirm() {
      this.isModalVisible = false

      if (this.createMode) {
        this.funcValiUserInfo()
        const login_info = this.funcGetUserData()
        const res = await this.funcUserCreate(login_info)
        if (res.status === 201) {
          this.funcClearUserData()
          const msg = '회원가입이 완료되었습니다'
          this.funcUserOpenModal(msg)
        } else {
          const msg = '회원가입이 실패되었습니다'
          this.funcUserOpenModal(msg)
        }
      } else {
        this.funcValiUserInfo()
        const login_info = this.funcGetUserData()
        const res = await this.funcUserModify(login_info)
        if (res.status === 201) {
          this.funcClearUserData()
          const msg = '회원정보가 변경되었습니다.'
          this.funcUserOpenModal(msg)
          this.funcGetProduct()
          this.$router.push('/')
        } else {
          const msg = '회원정보 변경을 실패하였습니다.'
          this.funcUserOpenModal(msg)
        }
      }

    },
    // 이벤트 모음
    funcValiUserInfo() {
      // 사용자 아이디 길이  && 이메일 형식 && 이메일 길이 && 전화번호 길이 && 아이디 중복 && 이메일 중복 && 전화번호 중복
      if (!(this.$v.id.minLength && this.$v.email.email && this.$v.email.isEmailAvailable && this.$v.telnum.minLength
        && this.availableId && this.availableEmail && this.availableTelnum)) {
        const msg = '입력된 정보가 옳바르지 않습니다.'
        this.funcUserOpenModal(msg)
        return
      } else if (this.id === '' || this.password === '' || this.name === '' || this.email === '' || this.telnum === '') {
        const msg = '입력된 정보가 옳바르지 않습니다.'
        this.funcUserOpenModal(msg)
        return
      }
    },
    funcInitJoin() {
      if (this.isLogin) {
        this.createMode = false
        this.funcGetUserInfo()
      } else {
        this.createMode = true
      }
    },
    //
    funcGetUserInfo() {
      this.id = this.userInfo.USER_ID
      this.password = this.userInfo.PAWD
      this.name = this.userInfo.NAME
      this.email = this.userInfo.E_MAIL
      this.telnum = this.userInfo.PHONE_NUM
    },
    //
    funcOpenModal(headerText, isConfirm) {
      // 모달창을 설정하고 여는 메소드
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    // 모달창을 설정하고 여는 메소드
    funcUserOpenModal(headerText) {
      this.modalHeaderText = headerText
      this.isUserModalVisible = true
    },
    //
    funcGetUserData() {

      var login_info = {
        user_id: this.id,
        pawd: this.password,
        name: this.name,
        e_mail: this.email,
        phone_num: this.telnum
      }

      return login_info
    },
    //
    funcClearUserData() {
      this.id = ''
      this.password = ''
      this.name = ''
      this.email = ''
      this.telnum = ''
    },
    async funcUserCreate(data) {
      return await UserApiService.create(data)
    },
    async funcUserModify(data) {
      return await UserApiService.update(this.userInfo.USER_ID, data)
    },
    // 매장 내 상품목록들을 Store 변수(prtList)에 저장
    funcGetProduct() {
      this.$store.dispatch('user/user/FETCH_USER_RE_LOGIN',
        {
          url: `user/${this.userInfo.USER_ID}`,
          url2: `store/${this.userInfo.USER_ID}`
        })
    }

  }

}
</script>
