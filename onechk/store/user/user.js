import { fetchCommonAxiosGet } from '../../api/common/commonApi.js'

import UserDataService from '../../api/user/userApi'

// 사용자 정보 기본값
const USER_INFO_DATA = () => {
  return {
    USER_ID: '',
    PAWD: '',
    NAME: '',
    E_MAIL: '',
    PHONE_NUM: '',
    SOCIAL: ''
  }
}

export const state = () => ({
  userInfo: USER_INFO_DATA(),
  isLogin: false,
  isLoginError: false,
  failMsg: '',
  counter: 0,
  boolSaveId: false,
  boolValidate: false
})

// 특수문자 제거
function regExpSpecial(str) {
  const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
  if(reg.test(str)){
    return str.replace(reg, "");
  } else {
    return str;
  }
}
// 숫자 제거
function regExpNum(str) {
  const reg = /[0-9]/g
  if(reg.test(str)){
    return str.replace(reg, "");
  } else {
    return str;
  }
}
// 공백 제거
function regExpSpace(str) {
  const reg = / /g
  if(reg.test(str)){
    return str.replace(reg, "");
  } else {
    return str;
  }
}


export const mutations = {

  // 사용자 정보 초기화, 아이디 저장 체크한 경우 아이디 저장
  SET_INIT_USER_INFO(state) {
    const userId = state.userInfo.USER_ID
    state.userInfo = USER_INFO_DATA()
    if (state.boolSaveId) {
      state.userInfo.USER_ID = userId
    }
    state.isLogin = false
    state.isLoginError = false
    state.failMsg = ''
  },
  // 사용자 정보 변경작업을 취소 시 원복
  SET_USER_ROLLBACK(state, userInfo) {
    const userId = state.userInfo.USER_ID
    state.userInfo = userInfo
    if (state.boolSaveId) {
      state.userInfo.USER_ID = userId
    }
  },
  // 사용자 아이디 설정
  SET_USER_ID(state, userId) {
    // const str = regExpSpecial(userId)
    // const str2 = regExpSpace(str)
    state.userInfo.USER_ID = userId

    // state.userInfo = {
    //   USER_NO: state.userInfo.USER_NO,
    //   USER_ID: str2,
    //   PAWD: state.userInfo.PAWD,
    //   NAME: state.userInfo.NAME,
    //   E_MAIL: state.userInfo.E_MAIL,
    //   PHONE_NUM: state.userInfo.PHONE_NUM,
    //   SOCIAL: state.userInfo.SOCIAL
    // }

  },
  // 사용자 패스워드 설정
  SET_USER_PAWD(state, userPwd) {
    // const str = regExpSpace(userPwd)
    state.userInfo.PAWD = userPwd
  },
  // 사용자 소셜 설정
  SET_USER_SOCIAL(state, social) {
    state.userInfo.SOCIAL = social
  },
  // 사용자 이름 설정
  SET_USER_NAME(state, userName) {
    // const str = regExpSpecial(userName)
    // const str2 = regExpNum(str)
    state.userInfo.NAME = userName
  },
  // 사용자 이메일 설정
  SET_USER_EMAIL(state, userEmail) {
    state.userInfo.E_MAIL = userEmail
  },
  // 사용자 전화번호 설정
  SET_USER_PHONE_NUM(state, userPhoneNumber) {
    const no = String(userPhoneNumber.replace(/[^0-9]/g,''))
    const len = no.length
    let str = null
    if ( len > 6 ) {
      if (len >= 11) {
        str = no.substring(0,3) + '-' + no.substring(3,7) + '-' + no.substring(7,len+1)
      } else {
        str = no.substring(0,3) + '-' + no.substring(3,6) + '-' + no.substring(6,len+1)
      }
    }
    if ( str === null ) { str = no}
    state.userInfo.PHONE_NUM = str
  },
  // 아이디 저장여부 체크 설정
  SET_BOOL_SAVE_ID(state, value) {
    state.boolSaveId = value
  },
  // 아이디 저장여부 체크 설정
  SET_BOOL_VALIDATE(state, value) {
    state.boolValidate = value
  },
  // 가게 ID 설정
  SET_STORE_ID(state, storeId) {
    state.userInfo.STORE_ID = storeId
  },

  // 건물 ID 설정
  SET_BUILDING_ID(state, buildingId) {
    state.userInfo.BUILDING_ID = buildingId
  },
  // 로그인 성공
  SET_LOGIN_SUCCESS(state, userInfo) {
    state.isLogin = true
    state.isLoginError = false
    state.failMsg = ''
    state.userInfo = userInfo
  },
  // 로그인 실패
  SET_LOGIN_ERR(state) {
    state.isLogin = false
    state.failMsg = '로그인 정보가 맞지 않습니다.'
    state.isLoginError = false
  },
  // 로그아웃
  SET_LOGIN_OUT(state) {
    state.isLogin = false
    state.isLoginError = false
    if (state.userInfo.SOCIAL==='KAKAO') {
      // UserDataService.kakaoLogout()
      const apikey = `984e9d07d893775bfe09ed1ae9cbe0fe`
      const redirect = `http://localhost:3000/api/kakao_login/logout`
      const url = `https://kauth.kakao.com/oauth/logout?client_id=${apikey}&logout_redirect_uri=${redirect}`
      window.open(url)
    }
    state.userInfo = USER_INFO_DATA()
  },
  // failMsg 설정
  SET_FAIL_MSG(state, msg) {
    state.failMsg = msg
  },
  // 다시 로그인
  reLogin(state, userInfo) {
    state.userInfo = userInfo
  }


}

export const actions = {
  // 로그인
  async FETCH_USER_LOGIN({ state, commit }) {
    let userInfo = null
    let userId = state.userInfo.USER_ID
    let userPwd = state.userInfo.PAWD

    if (userId === '' || userPwd === '') {
      commit('SET_LOGIN_ERR')
      return
    }

    const response = await UserDataService.getUserInfo(userId)
    const status = response.status

    if (status === 200) {
      if (
        response.data[0].USER_ID === userId &&
        response.data[0].PAWD === userPwd
      ) {
        userInfo = response.data[0]
        commit('SET_LOGIN_SUCCESS', userInfo)
        $nuxt._router.push('/')
      } else {
        commit('SET_LOGIN_ERR')
      }
    } else {
      commit('SET_LOGIN_ERR')
    }
  },

  async FETCH_USER_LOGIN_KAKAO({ state, commit }) {
    const kakaoUserInfo = await UserDataService.getUserInfoKakao()
    if (kakaoUserInfo.status === 200) {
      const email = kakaoUserInfo.data.kakao_account.email
      const nickname = kakaoUserInfo.data.kakao_account.profile.nickname
      const dup = await UserDataService.duplicateEmailCheck(email)

      // db에 email 없을 때(추후 phone_num)
      if (dup.data.result) {
        await commit('SET_USER_NAME', nickname)
        await commit('SET_USER_EMAIL', email)
        await commit('SET_USER_SOCIAL', 'KAKAO')
        UserDataService.createUserInfo(state.userInfo)
      }
      // db에 있을 때
      const response = await UserDataService.getOneByEmail(email)
      const status = response.status
      if (status === 200) {
        const userInfo = response.data[0]
        commit('SET_LOGIN_SUCCESS', userInfo)

      } else {
        commit('SET_LOGIN_ERR')
      }
      $nuxt._router.push('/')
      return 0
    } else {
      alert('카카오 로그인을 먼저 해주세요')
      return -1
    }

  },

  FETCH_USER_LOGOUT({ commit }) {
    commit('SET_LOGIN_OUT')
    $nuxt._router.push('/')
  },

  // 사용자 정보 입력
  FETCH_CREATE_USER_INFO({ state }) {
    return UserDataService.createUserInfo(state.userInfo)
  },
  // 사용자 정보 수정
  FETCH_UPDATE_USER_INFO({ state }, userNo) {
    return UserDataService.updateUserInfo(userNo, state.userInfo)
  },
  // 사용자 정보 삭제
  FETCH_DELETE_USER_INFO({ state }, userNo) {
    return UserDataService.deleteUserInfo(userNo)
  },
  // 사용자 정보 중복 확인
  FETCH_DUPLICATE_USER_INFO({ state }, inputId) {
    if (inputId === 'id') {
      return UserDataService.duplicateIdCheck(state.userInfo.USER_ID)
    } else if (inputId === 'email') {
      return UserDataService.duplicateEmailCheck(state.userInfo.E_MAIL)
    } else if (inputId === 'phoneNum') {
      return UserDataService.duplicatePhoneNumCheck(state.userInfo.PHONE_NUM)
    }
  },

  // 회원정보 변경 시 사용자 정보 다시 가져오기
  async FETCH_USER_RE_LOGIN({ state, commit }, payload) {
    const response = await fetchCommonAxiosGet(payload.url)
    let datas = response.data
    const store_res = await fetchCommonAxiosGet(payload.url2)

    let store_id = null
    if (store_res.data.length !== 0) {
      store_id = store_res.data[0].STORE_ID
    }
    let selectedUser = datas
    selectedUser.STORE_ID = store_id
    commit('reLogin', selectedUser)
  },

  async FETCH_USER_STORE_INFO({ state, commit }) {
    // const store_res = await fetchCommonAxiosGet(payload.url)
    const store_res = await UserDataService.getUserInfo(state.userInfo.USER_ID)
    let store_id = null
    if (store_res.data.length !== 0) {
      store_id = await store_res.data[0].STORE_ID
    }
    commit('SET_STORE_ID', store_id)
  },

  FETCH_USER_BUILDING_INFO: async function({ state, commit }, payload) {
    const building_res = await fetchCommonAxiosGet(payload.url)
    let building_id = null
    if (building_res.data.length !== 0) {
      building_id = building_res.data[0].BUILDING_ID
    }
    commit('SET_BUILDING_ID', building_id)
  },

  // 사용자 정보 중복 확인 ( 사용자 수정 )
  FETCH_DUPLICATE_MODIFY_USER_INFO({ state }, inputId) {
    if (inputId === 'id') {
      return UserDataService.duplicateModifyIdCheck(state.userInfo.USER_ID, state.userInfo.USER_NO)
    } else if (inputId === 'email') {
      return UserDataService.duplicateModifyEmailCheck(state.userInfo.E_MAIL, state.userInfo.USER_NO)
    } else if (inputId === 'phoneNum') {
      return UserDataService.duplicateModifyPhoneNumCheck(state.userInfo.PHONE_NUM, state.userInfo.USER_NO)
    }
  },

}

export const getters = {
  GET_BOOL_SAVE_ID(state) {
    return state.boolSaveId
  },
  GET_BOOL_VALIDATE(state) {
    return state.boolValidate
  },
  fetchedUser(state) {
    return state.userInfo
  }
}
