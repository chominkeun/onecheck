import Axios from '../index.js'

class UserDataService {
  /**************** 사용자 정보  ****************/

  /* 사용자 조회 - 1개 전체 (userId) */
  getOne(userId) {
    return Axios.get(`/user/${userId}`)
  }
  /* 사용자 조회 (email) - 가게정보 포함 */
  async getOneByEmail(email) {
    return await Axios.get(`/user/email/${email}`)
  }

  /* 사용자 조회 (userId) - 가게정보 포함 */
  async getUserInfo(userId) {
    return await Axios.get(`/user/store/${userId}`)
  }

  async getUserInfoKakao(){
    return await Axios.get(`/kakao_login/user`)
  }

  kakaoLogout(){
    return Axios.post(`/kakao_login/logout`)
  }
  // 사용자 정보 입력
  createUserInfo(data) {
    return Axios.post(`/user`, data)
  }

  // 사용자 정보 수정
  updateUserInfo(userNo, data) {
    return Axios.put(`/user/${userNo}`, data)
  }

  // 사용자 정보 삭제
  deleteUserInfo(userNo) {
    return Axios.delete(`/user/${userNo}`)
  }

  // 사용자 아이디 중복 확인
  duplicateIdCheck(userId) {
    return Axios.get(`/user/name/USER_ID/value/${userId}`)
  }

  // 사용자 이메일 중복 확인
  duplicateEmailCheck(email) {
    return Axios.get(`/user/name/E_MAIL/value/${email}`)
  }

  // 사용자 전화번호 중복 확인
  duplicatePhoneNumCheck(telNum) {
    return Axios.get(`/user/name/PHONE_NUM/value/${telNum}`)
  }

  // 사용자 아이디 중복 확인
  duplicateModifyIdCheck(userId, userNo) {
    return Axios.get(`/user/name/USER_ID/value/${userId}/user/${userNo}`)
  }

  // 사용자 이메일 중복 확인
  duplicateModifyEmailCheck(email, userNo) {
    return Axios.get(`/user/name/E_MAIL/value/${email}/user/${userNo}`)
  }

  // 사용자 전화번호 중복 확인
  duplicateModifyPhoneNumCheck(telNum, userNo) {
    return Axios.get(`/user/name/PHONE_NUM/value/${telNum}/user/${userNo}`)
  }

}

export default new UserDataService()
