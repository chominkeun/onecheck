<template>
  <div>
    <h2 class='title-type1'>{{ title }}</h2>
    <div class='data-type2'>
      <p align='center' :class="!boolValidate ? 'err-msg-black' : 'err-msg'">{{ failMsg }}</p>
      <p id='demo' align='center' :class="'err-msg'"></p>
      <table>
        <colgroup>
          <col style='width:230px' />
          <col style='width:auto' />
        </colgroup>
        <tbody>
        <table-item title='아이디'>
          <VInput
            v-if='(modifyMode && socialMode)|| createMode'
            v-on:blur='checkDuplicate'
            id='id'
            type='text'
            min='3'
            max='15'
            minlength='3'
            maxlength='15'
            placeholder='아이디를 입력하세요'
            style='width:578px'
            :value='userInfo.USER_ID'
            @input='SET_USER_ID'
          />
          <template v-else>{{ userInfo.USER_ID }}</template>
          <p class='err-msg' v-show='!availableId'> {{ availableErrMsg[0] }} </p>
        </table-item>
        <span></span>

        <table-item v-if='modifyMode' title='비밀번호'>
          <VInput
            type='password'
            id='pass'
            name='password'
            min='8'
            max='15'
            minlength='8'
            maxlength='15'
            autocomplete='off'
            placeholder='비밀번호를 입력하세요'
            style='width:578px'
            :value='userInfo.PAWD'
            @input='SET_USER_PAWD'
          />

        </table-item>

        <table-item title='이름'>
          <VInput
            v-if='modifyMode'
            type='text'
            id='name'
            min='2'
            max='10'
            minlength='2'
            maxlength='10'
            placeholder='이름를 입력하세요'
            style='width:578px'
            :value='userInfo.NAME'
            @input='SET_USER_NAME'
          />
          <template v-else>
            {{ userInfo.NAME }}
          </template>

        </table-item>

        <table-item title='이메일'>
          <div v-if='modifyMode' class='inp-email'>
            <VInput
              type='email'
              min='7'
              max='30'
              minlength='7'
              maxlength='30'
              v-on:blur='checkDuplicate'
              id='email'
              name='email'
              placeholder='이메일를 입력하세요'
              style='width:578px'
              :value='userInfo.E_MAIL'
              @input='SET_USER_EMAIL'
            />
          </div>
          <template v-else>
            {{ userInfo.E_MAIL }}
          </template>
          <p class='err-msg' v-show='!availableEmail'> {{ availableErrMsg[1] }} </p>
        </table-item>

        <table-item title='전화번호'>
          <VInput
            v-if='modifyMode'
            type='tel'

            minlength='13'
            maxlength='20'
            v-on:blur='checkDuplicate'
            id='phoneNum'
            placeholder='전화번호를 입력하세요'
            style='width:578px'
            :value='userInfo.PHONE_NUM'
            @input='SET_USER_PHONE_NUM'
          />
          <template v-else>
            {{ userInfo.PHONE_NUM }}
          </template>
          <p class='err-msg' v-show='!availableTelnum'> {{ availableErrMsg[2] }} </p>
        </table-item>
        </tbody>
      </table>
    </div>

    <div class='btn-box align-r'>
      <VBtn v-if='!modifyMode' class='btn-type1 st5' @click='deleteUser'
      >정보삭제
      </VBtn
      >
      <VBtn v-else-if='modifyMode' class='btn-type1 st5' @click='goPrev'
      >뒤로가기
      </VBtn
      >

      <VBtn v-if='!modifyMode' class='btn-type1 st1' @click='modifyInfo'
      >정보편집
      </VBtn
      >
      <VBtn
        v-else-if='modifyMode && !createMode'
        class='btn-type1 st1'
        @click='modifyUserInfoFinished'
      >수정완료
      </VBtn
      >
      <VBtn
        v-else-if='createMode && createMode'
        class='btn-type1 st1'
        @click='createUserInfoFinished'
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
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import TableItem from '../common/TableItem.vue'
import VModal from '../common/VModal.vue'

export default {
  name: 'MyJoin.vue',
  components: {
    TableItem,
    VModal
  },
  created() {
    this.initMyJoin()
  },
  destroyed() {
    // DB 저장 없는 경우 이전 사용자 정보로 원복
    if (!this.dbChangeMode) {
      this.SET_USER_ROLLBACK(this.originUserInfo)
    }
  },
  computed: {
    ...mapState('user/user', [
      'userInfo',
      'failMsg',
      'isLogin',
      'boolValidate'
    ])
  },
  mounted() {
    this.availableErrMsg[0] = '이미 사용중인 아이디 입니다.'
    this.availableErrMsg[1] = '이미 사용중인 이메일 입니다.'
    this.availableErrMsg[2] = '이미 사용중인 전화번호 입니다.'
  },
  data() {
    return {
      title: '회원 가입',
      createMode: false,
      modifyMode: false,
      deleteMode: false,
      isModalVisible: false,
      isModalConfirm: false,
      modalText: '',
      originUserInfo: Object,
      dbChangeMode: false,
      resultMsg: '',
      availableErrMsg: [],
      availableEmail: true,
      availableId: true,
      availableTelnum: true,
      alterMode: false,
      socialMode: false
    }
  },
  methods: {
    ...mapMutations('user/user', [
      'SET_INIT_USER_INFO',
      'SET_USER_ID',
      'SET_USER_PAWD',
      'SET_USER_NAME',
      'SET_USER_EMAIL',
      'SET_USER_PHONE_NUM',
      'SET_USER_ROLLBACK',
      'SET_BOOL_VALIDATE',
      'SET_FAIL_MSG'
    ]),
    ...mapActions('user/user', [
      'FETCH_CREATE_USER_INFO',
      'FETCH_UPDATE_USER_INFO',
      'FETCH_DELETE_USER_INFO',
      'FETCH_DUPLICATE_USER_INFO',
      'FETCH_USER_LOGIN',
      'FETCH_USER_LOGOUT',
      'FETCH_DUPLICATE_MODIFY_USER_INFO'
    ]),
    // [START] 버튼 이벤트 모음

    // 사용자 삭제 버튼
    deleteUser() {
      this.deleteMode = true
      this.openModal('사용자 정보를 삭제하시겠습니까?', true)
    },
    // 뒤로가기 버튼
    goPrev() {
      this.$router.go(-1)
    },
    // 사용자 정보편집 버튼
    modifyInfo() {
      this.setModifyMode(true)
    },
    // 사용자 수정완료 버튼
    async modifyUserInfoFinished() {
      const isValid = await this.validate()
      if (!isValid) {
        return
      } else {
        this.openModal('사용자 정보를 변경하시겠습니까?', true)
      }

    },
    // 사용자 생성완료 버튼
    async createUserInfoFinished() {
      const isValid = await this.validate()
      if (!isValid) {
        return
      } else {
        this.openModal('사용자 정보를 생성하시겠습니까?', true)
      }

    },
    // 모달 창 닫기 버튼
    onModalCancel() {
      this.isModalVisible = false
    },
    // 모달 창 확인 버튼
    onModalConfirm() {
      // 사용자 로그인 여부
      if (this.isLogin) {
        if (this.deleteMode) {
          // 사용자 로그인 후 삭제
          this.deleteUserInfo()
        } else if (this.alterMode) {
          this.alterModeConfirm()
        } else {
          // 사용자 로그인 후 변경
          this.updateUserInfo()
        }
      } else {
        if (this.alterMode) {
          this.alterModeConfirm()
        } else {
          // 사용자 생성
          this.createUserInfo()
        }
      }
    },
    // [END] 버튼 이벤트 모음

    // CREATED 시 호출
    initMyJoin() {
      // 사용자 로그인 완료
      if (this.isLogin) {
        this.title = '회원정보수정'
        // 초기값 저장
        this.originUserInfo = this.userInfo
        this.socialMode = (this.userInfo.SOCIAL === 'KAKAO') ? true : false
      } else {
        this.SET_INIT_USER_INFO()
        this.modifyMode = true
        this.createMode = true
      }
    },
    // 모달창을 설정하고 여는 메소드
    openModal(headerText, isConfirm) {
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
    // modifyMode 설정 메소드
    setModifyMode(mode) {
      this.modifyMode = mode
      this.scrollToTop()
    },
    // 스크롤 최상단
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    // 사용자 생성
    async createUserInfo() {
      const res = await this.FETCH_CREATE_USER_INFO()
      const status = res.status
      // 사용자 정보 생성 정상 처리
      if (status === 201) {
        this.dbChangeMode = true
        await this.FETCH_USER_LOGIN()
      } else {
        // 사용자 정보 생성 실패 처리
      }
      this.isModalVisible = false
    },
    async updateUserInfo() {
      const res = await this.FETCH_UPDATE_USER_INFO(this.userInfo.USER_NO)
      const status = res.status
      // 사용자 정보 업데이트 정상 처리
      if (status === 201) {
        // 변경된 값으로 정보수정
        this.originUserInfo = this.userInfo
        this.dbChangeMode = true
      } else if (status === 204) {
        // 변경된 정보가 없는 경우

      } else {
        // 사용자 정보 업데이트 실패 처리

      }
      this.setModifyMode(false)
      this.isModalVisible = false
    },
    async deleteUserInfo() {
      const res = await this.FETCH_DELETE_USER_INFO(this.userInfo.USER_NO)
      const status = res.status
      // 사용자 정보 삭제 정상 처리
      if (status === 204) {
        this.dbChangeMode = true
        // this.SET_INIT_USER_INFO()
        this.FETCH_USER_LOGOUT()
      } else if (status === 404) {
        // 사용자 정보 삭제 대상 없음 처리
      } else {
        // 사용자 정보 삭제 실패 처리
      }

      this.deleteMode = false
      this.isModalVisible = false
    },
    async checkDuplicate(e) {
      if (e.target.value === '' || e.target.value === undefined) {
        return
      }
      if (this.createMode) {
        // 사용자 신규 가입
        const res = await this.FETCH_DUPLICATE_USER_INFO(e.target.id)
        if (res.status === 200) {
          if (e.target.id === 'id') {
            (!res.data.result) ? this.availableId = false : this.availableId = true
          } else if (e.target.id === 'email') {
            (!res.data.result) ? this.availableEmail = false : this.availableEmail = true
          } else if (e.target.id === 'phoneNum') {
            (!res.data.result) ? this.availableTelnum = false : this.availableTelnum = true
          }
        }
      } else {
        // 사용자 정보 수정
        // if (e.target.id === 'id') {
        //   // 카카오 로그인에서 수정하는 경우가 아니라면 사용자 아이디 변경 불가
        //   return
        // }
        const res = await this.FETCH_DUPLICATE_MODIFY_USER_INFO(e.target.id)
        if (res.status === 200) {
          if (e.target.id === 'id') {
            (!res.data.result) ? this.availableId = false : this.availableId = true
          } else if (e.target.id === 'email') {
            (!res.data.result) ? this.availableEmail = false : this.availableEmail = true
          } else if (e.target.id === 'phoneNum') {
            (!res.data.result) ? this.availableTelnum = false : this.availableTelnum = true
          }
        }
      }


      // // 최소 검증
      // let isValid = this.validateMinLength(e.target.minLength, e.target.value.length)
      // if (!isValid) {
      //   this.alterMode = true
      //   this.SET_BOOL_VALIDATE(true)
      //   const msg = `최소 ${e.target.minLength} 자리 이상 입력해주세요.`
      //   this.SET_FAIL_MSG(msg)
      //   this.openModal(msg, false)
      //   return
      // } else {
      //   this.SET_BOOL_VALIDATE(false)
      //   const msg = ``
      //   this.SET_FAIL_MSG(msg)
      // }
      // // 최대 검증
      // const isMaxValid = this.validateMaxLength(e.target.maxLength, e.target.value.length)
      // if (!isMaxValid) {
      //   this.alterMode = true
      //   this.SET_BOOL_VALIDATE(true)
      //   const msg = `최대 ${e.target.minLength} 자리로 입력해주세요.`
      //   this.SET_FAIL_MSG(msg)
      //   this.openModal(msg, false)
      //   return
      // } else {
      //   this.SET_BOOL_VALIDATE(false)
      //   const msg = ``
      //   this.SET_FAIL_MSG(msg)
      // }


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
    alterModeConfirm() {
      this.isModalVisible = false
      this.alterMode = false
    },
    storeValidate(isValid, msg) {
      this.SET_BOOL_VALIDATE(isValid)
      this.SET_FAIL_MSG(msg)
    },
    async validate() {
      let isValid = false
      if (this.failMsg !== '') {
        // 실패 메시지가 있는 경우 검증은 자동 실패
        return isValid
      }
      // for 처리
      const arr = ['id', 'email', 'phoneNum', 'pass', 'name']

      const isEmailValid = await this.validateElement('email')
      if (!isEmailValid) {
        return isValid
      }
      const isIdValid = await this.validateElement('id')
      if (!isIdValid) {
        return isValid
      }
      const isTelValid = await this.validateElement('phoneNum')
      if (!isTelValid) {
        return isValid
      }
      const isPassValid = await this.validateElement('pass')
      if (!isPassValid) {
        return isValid
      }
      const isNameValid = await this.validateElement('name')
      if (!isNameValid) {
        return isValid
      }
      if (!this.availableId || !this.availableEmail || !this.availableTelnum) {
        let demo = document.getElementById('demo')
        demo.innerHTML = '중복 항목이 있습니다.'
        return isValid
      }
      isValid = true
      return isValid
    },
    async validateElement(id) {
      let isValid = false
      const element = document.getElementById(id)
      let demo = document.getElementById('demo')
      let str = ''
      const reg1 = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
      const reg2 = /[0-9]/g
      const reg3 = / /g
      const reg4 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      const hangulCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

      if (id === 'email') {
        str = '이메일'
        if (this.createMode) {
          const res = await this.FETCH_DUPLICATE_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableEmail = false : this.availableEmail = true
          }
        } else {
          const res = await this.FETCH_DUPLICATE_MODIFY_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableEmail = false : this.availableEmail = true
          }
        }
      } else if (id === 'id') {
        str = '아이디'
        if (reg1.test(this.userInfo.USER_ID)) {
          const msg = `${str}에 특수문자가 있습니다.`
          demo.innerHTML = msg
          return isValid
        }
        if (reg3.test(this.userInfo.USER_ID)) {
          const msg = `${str}에 공백이 있습니다.`
          demo.innerHTML = msg
          return isValid
        }
        if (this.createMode) {
          const res = await this.FETCH_DUPLICATE_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableId = false : this.availableId = true
          }
        } else {
          const res = await this.FETCH_DUPLICATE_MODIFY_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableId = false : this.availableId = true
          }
        }
      } else if (id === 'phoneNum') {
        str = '전화번호'
        if (this.createMode) {
          const res = await this.FETCH_DUPLICATE_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableTelnum = false : this.availableTelnum = true
          }
        } else {
          const res = await this.FETCH_DUPLICATE_MODIFY_USER_INFO(id)
          if (res.status === 200) {
            (!res.data.result) ? this.availableTelnum = false : this.availableTelnum = true
          }
        }
      } else if (id === 'pass') {
        str = '비밀번호'
        if (false === reg4.test(this.userInfo.PAWD)) {
          const msg = `비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.`
          demo.innerHTML = msg
          return isValid
        } else if (/(\w)\1\1\1/.test(this.userInfo.PAWD)) {
          const msg = `비밀번호는 같은 문자를 4번 이상 사용하실 수 없습니다.`
          demo.innerHTML = msg
          return isValid
        } else if (this.userInfo.PAWD.search(this.userInfo.USER_ID) > -1) {
          const msg = `비밀번호에 아이디가 포함되었습니다.`
          demo.innerHTML = msg
          return isValid
        } else if (this.userInfo.PAWD.search(/\s/) != -1) {
          const msg = `비밀번호는 공백 없이 입력해주세요.`
          demo.innerHTML = msg
          return isValid
        } else if (hangulCheck.test(this.userInfo.PAWD)) {
          const msg = `비밀번호에 한글을 사용 할 수 없습니다.`
          demo.innerHTML = msg
          return isValid
        } else {
        }
      } else if (id === 'name') {
        str = '이름'
      }

      if (element !== null && element.value === '') {
        const msg = `${str}을 입력해 주세요.`
        demo.innerHTML = msg
        return isValid
      } else {
        return true
      }
      // 최소 검증
      const isEmailValid = this.validateMinLength(element.minLength, element.value.length)
      if (!isEmailValid) {
        const msg = `${str}을 최소 ${element.minLength} 자리 이상 입력해주세요.`
        demo.innerHTML = msg
        return isValid
      }
      // 최대 검증
      const isMaxValid = this.validateMaxLength(element.maxLength, element.value.length)
      if (!isMaxValid) {
        const msg = `${str}을 최대 ${element.maxLength} 자리로 입력해주세요.`
        demo.innerHTML = msg
        return isValid
      }

      if (!element.validity.valid) {
        const msg = `${str} 형식에 맞게 입력해주세요.`
        demo.innerHTML = msg
        return isValid
      }

      if (id === 'email') {
        if (element.validity.typeMismatch) {
          const msg = `${str} 형식에 맞게 입력해주세요.`
          demo.innerHTML = msg
          return isValid
        }
      }
      demo.innerHTML = null
      isValid = true
      return isValid
    },
    // 특수문자 제거
    regExpSpecial(str) {
      const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
      if (reg.test(str)) {
        return str.replace(reg, '')
      } else {
        return str
      }
    },
    // 숫자 제거
    regExpNum(str) {
      const reg = /[0-9]/g
      if (reg.test(str)) {
        return str.replace(reg, '')
      } else {
        return str
      }
    },
    // 공백 제거
    regExpSpace(str) {
      const reg = / /g
      if (reg.test(str)) {
        return str.replace(reg, '')
      } else {
        return str
      }
    }

  }

}
</script>

<style>
input + span {
  position: relative;
}

input + span::before {
  position: absolute;
  right: -20px;
  top: 5px;
}

input:invalid {
  border: 2px solid red;
}

input:invalid + span::before {
  content: '✖';
  color: red;
}

input:valid + span::before {
  content: '✓';
  color: green;
}
</style>
