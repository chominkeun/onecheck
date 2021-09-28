import Axios from '../index.js'

class ProductDataService {
  /**************** 상품 정보 CRUD ****************/

  /* 상품 등록 (storeId) */
  create(storeId, data) {
    return Axios.post(`/product/${storeId}`, data)
  }

  /* 상품 조회 - 전체 (storeId) */
  getAll(storeId) {
    return Axios.get(`/product/${storeId}`)
  }

  /* 상품 조회 - 1개 (storeId & productId) */
  getOne(storeId, productId) {
    return Axios.get(`/product/store-id/${storeId}/product-id/${productId}`)
  }

  /* 상품 수정 (productId) */
  update(productId, data) {
    return Axios.put(`/product/${productId}`, data)
  }

  /* 상품 삭제 */
  delete(productId) {
    return Axios.delete(`/product/${productId}`)
  }

  /* 상품 조회(주문 관리에서 사용) - 전체 (storeId) */
  getAllInOrder(storeId) {
    return Axios.get(`/product/getProductAll/${storeId}`)
  }

  /**************** 카테고리 관련 ****************/

  /* 카테고리 별 상품 조회 (categoryId) */
  getByCategory(storeId, categoryId) {
    return Axios.get(
      `/product/category/store-id/${storeId}/category-id/${categoryId}`
    )
  }

  /* 상품 카테고리 이동 */
  moveProductCategoryInfo(data) {
    return Axios.put('/product/prt/category', data)
  }

  /**************** 카운트 관련 ****************/

  /* 카테고리 별 상품 조회 (categoryId) */
  count(storeId) {
    return Axios.get(`/product/cnt/${storeId}`)
  }

  /* 카테고리 별 상품 조회 (categoryId) */
  countByCategory(storeId, categoryId) {
    return Axios.get(`/product/cnt/store-id/${storeId}/category-id/${categoryId}`)
  }

  /* 상품 조회 - 전체 (storeId) */
  getAll(storeId, limit, offset) {
    return Axios.get(`/product/${storeId}?limit=${limit}&offset=${offset}`)
  }

  /* 카테고리 별 상품 조회 (categoryId) */
  getByCategory(storeId, categoryId, limit, offset) {
    return Axios.get(
      `/product/category/store-id/${storeId}/category-id/${categoryId}?limit=${limit}&offset=${offset}`
    )
  }

  /* 생성 시 가게에 중복 상품명 검색 */
  duplicateCheck(storeId, productName) {
    return Axios.get(`/product/duplicate/store/${storeId}/value/${productName}`)
  }

  /* 수정 시 가게에 중복 상품명 검색 */
  duplicateCheckId(storeId, productId, productName) {
    return Axios.get(`/product/duplicate/store/${storeId}/product/${productId}/value/${productName}`)
  }

}

export default new ProductDataService()
