import Axios from '../index.js'

class PcategoryDataService {
  /**************** PRT_CATEGORY CRUD ****************/

  /* 상품 카테고리 조회 - 상점ID로 전체 조회 */
  getProductCategoryList(storeId) {
    return Axios.get(`/pcategory/${storeId}`)
  }
  /* 상품 카테고리 등록 */
  createProductCategoryInfo(data) {
    return Axios.post('/pcategory', data)
  }
  /* 상품 카테고리 수정 */
  updateProductCategoryInfo(categoryId, data) {
    return Axios.put(`/pcategory/${categoryId}`, data)
  }
  /* 상품 카테고리 삭제 */
  deleteProductCategoryInfo(categoryId) {
    return Axios.delete(`/pcategory/${categoryId}`)
  }


  // ============================== [ 미사용 ] =============================== //
  /* 상품 카테고리 조회 - 카테고리ID로 조회 */
  getOneByPk(categoryId) {
    return Axios.get(`/pcategory/category-id/${categoryId}`)
  }
  /* 상품 카테고리 조회 - 상점ID&카테고리이름(unique key)으로 특정 카테고리 조회  */
  getOne(storeId, categoryName) {
    return Axios.get(
      `/pcategory/store-id/${storeId}/category-name/${categoryName}`
    )
  }
}

export default new PcategoryDataService()
