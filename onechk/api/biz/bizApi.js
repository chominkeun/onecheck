import Axios from '../index.js'

class BizDataService {

  //입력한 사업자 등록번호의 가게정보 조회
  getBizStoreInfo(biz_num) {
    return Axios.get(`/biz/${biz_num}`)
  }

  //가게테이블에 사업자등록번호가 이미 있는지 확인
  getIsDataInTable(biz_num) {
    return Axios.get(`/biz/check/${biz_num}`)
  }

  //사업자 등록
  create(userNo, data) {
    return Axios.post(`/biz/${userNo}`, data)
  }

  //사업자 정보 삭제
  delete(biz_num) {
    return Axios.delete(`/biz/${biz_num}`)
  }

  //사업자정보 가져오기 by user_no
  getBizInfo(user_no) {
    return Axios.get(`/biz/user/${user_no}`)
  }
}

export default new BizDataService()
