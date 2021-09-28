<template>
  <!-- login-box -->
  <div class='login-box'>
    <h2><img src='~assets/images/logo-login.png' alt='' /></h2>

    <ul>
      <li>
        <p :class="isLogin ? 'err-msg-black' : 'err-msg' ">
          {{ failMsg }}
        </p>
      </li>
      <li>
        <VInput
          type='text'
          style='width:410px'
          :value='userInfo.USER_ID'
          @input='SET_USER_ID'
          @keyup='enter'
        />
      </li>
      <li>
        <VInput
          type='password'
          style='width:410px'
          :value='userInfo.PAWD'
          @input='SET_USER_PAWD'
          @keyup='enter'
        />
      </li>
    </ul>
    <div class='id-save'>
      <VCheckbox type='checkbox' :checked='GET_BOOL_SAVE_ID' @change='handleChange($event)'>아이디 저장</VCheckbox>
    </div>
    <div class='login-btn'>
      <VBtn class='btn-type1 st1 full' @click='FETCH_USER_LOGIN'>로그인</VBtn>
      <!-- <a href="www.naver.com" alt="kakao login">
      <img alt="kakao logo" src="..\assets\images\temp\kakao_login_medium_wide.png" />
      </a> -->

      <hr style="margin:10px" size="3px" color="#D5D5D5">
      <VBtn type="button" @click="kakaoLoginLink"><img src="~/assets/images/temp/kakao_login_medium_wide.png" alt="kakao logo"></VBtn>

    </div>
    <div class='login-menu'>
      <VBtn type='nlink' to='/'>아이디 찾기</VBtn>
      <VBtn type='nlink' to='/'>비밀번호 찾기</VBtn>
      <div class='right'>
        <VBtn type='nlink' to='/Join2' class='btn-type2 st2'>회원가입</VBtn>
      </div>

    </div>
    <v-modal
      v-show="isModalVisible"
      :text="modalText"
      :isConfirm="isModalConfirm"
      @onCancel="onModalCancel"
      @onConfirm="onModalConfirm"
    />
  </div>
  <!-- // login-box -->
</template>
<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import VModal from '../components/common/VModal.vue'

export default {
  components: {VModal},
  created() {
    this.initMyLogin()
  },
  destroyed() {
    if (!this.isLogin) {
      this.SET_INIT_USER_INFO()
    }
  },
  computed: {
    ...mapState('user/user', [
      'userInfo',
      'failMsg',
      'isLogin'
    ]),
    ...mapGetters('user/user', [
      'GET_BOOL_SAVE_ID'
    ])
  },
  data() {
    return {
      isModalVisible: false,
      isModalConfirm: false,
      modalText: '',
    }
  },
  methods: {
    ...mapActions('user/user', ['FETCH_USER_LOGIN','FETCH_USER_LOGIN_KAKAO']),
    ...mapMutations('user/user', [
      'SET_INIT_USER_INFO',
      'SET_USER_ID',
      'SET_USER_PAWD',
      'SET_BOOL_SAVE_ID'
    ]),
    initMyLogin() {
      if (!this.isLogin) {
        this.SET_INIT_USER_INFO()
      }
    },
    handleChange(e) {
      this.SET_BOOL_SAVE_ID(e)
    },
    enter() {
      if(window.event.keyCode === 13){
        this.FETCH_USER_LOGIN()
      }
    },
    async kakaoLoginLink(){
      const apikey = `984e9d07d893775bfe09ed1ae9cbe0fe`
      const redirect = `http://localhost:3000/api/kakao_login/oauth/authorize`
      const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${apikey}&redirect_uri=${redirect}`
      const w =window.open(url,"카카오","left=225,top=10,width=1200,height=850")
      if(!w.closed){
        console.log('asdffsdf')
      }

      this.openModal("카카오로 로그인 하시겠습니까?",true)
      // var load = false
      // w.addEventListener('fetch', (event) => {
      //   console.log(event)
      //   if(load){
      //     this.openModal("카카오로 로그인 하시겠습니까?",true)
      //   }
      //   load = !load

        
      //   // Chrome에서는 returnValue 설정이 필요함
      //   event.returnValue = '';
      // });

    
    },
    onModalCancel() {
      this.isModalVisible = false
    },
    // 모달 창 확인 버튼
    onModalConfirm() {
        const login = this.FETCH_USER_LOGIN_KAKAO()
        if(login===0)
          this.isModalVisible = false
    },
    openModal(headerText, isConfirm) {
      this.modalText = headerText
      this.isModalConfirm = isConfirm
      this.isModalVisible = true
    },
  }
}
</script>
