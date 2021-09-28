import Axios from '../index.js'

class StoreDataService {
  /**************** STORE_MANAGER CRUD ****************/

  /* 가게 목록 조회 (by user_no) */
  getAll(userNo) {
    return Axios.get(`/store/${userNo}`)
  }

  /* 가게 목록 조회 - 전체 (APP 사용) */
  getAllStore() {
    return Axios.get('/store/all/list')
  }
  /* 가게 카테고리 조회 */
  getCategoryInfo() {
    return Axios.get(`/store/category/list`)
  }

  /* 가게 조회 - 1개 (userNo, storeId) */
  getOneByPk(userNo, storeId) {
    return Axios.get(`/store/user-no/${userNo}/store-id/${storeId}`)
  }

  /* 가게 조회 - 1개 (storeId) */
  getOne(storeId) {
    return Axios.get(`/store/StoreOne/${storeId}`)
  }

  /* 가게 등록 */
  createStoreInfo(userNo, data) {
    return Axios.post(`/store/${userNo}`, data)
  }

  /* 가게 정보 수정 */
  updateStoreInfo(storeId, data) {
    return Axios.put(`/store/${storeId}`, data)
  }

  /* 가게 삭제 */
  deleteStoreInfo(storeId) {
    return Axios.delete(`/store/${storeId}`)
  }


}

export default new StoreDataService()
