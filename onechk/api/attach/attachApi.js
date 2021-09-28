import Axios from '../index.js'

class AttachDataService {
  /**************** 첨부파일 정보  ****************/

  /* 첨부파일 등록 (storeId) */
  create(data, config) {
    return Axios.post(`/attach`, data, config)
  }

  /* 첨부파일 조회 - 1개 전체 (attachId) */
  getOne(attachId) {
    return Axios.get(`/attach/${attachId}`)
  }

  /* 첨부파일 수정 (productId) */
  update(attachId, data, config) {
    return Axios.put(`/attach/${attachId}`, data, config)
  }

  /* 첨부파일 삭제 */
  delete(attachId) {
    return Axios.delete(`/attach/${attachId}`)
  }

}

export default new AttachDataService()
