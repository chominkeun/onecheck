const service = require('../service/prtCategory.service')

/* 상품 카테고리 테이블 - 상점ID로 전체 조회 */
exports.getProductCategoryList = (req, res) => {
  service.getProductCategoryList(req, res)
}

/* 상품 카테고리 등록 */
exports.createProductCategoryInfo = (req, res) => {
  service.createProductCategoryInfo(req, res)
}

/* 상품 카테고리 수정 */
exports.updateProductCategoryInfo = (req, res) => {
  service.updateProductCategoryInfo(req, res)
}

/* 상품 카테고리 삭제 */
exports.deleteProductCategoryInfo = (req, res) => {
  service.deleteProductCategoryInfo(req, res)
}

// ============================== [ 미사용 ] =============================== //
/* 상품 카테고리 조회 - 상점 ID 로 전체 조회 */
exports.getSelectProductCategory = (req, res) => {
  service.getSelectProductCategory(req, res)
}

/* 상품 카테고리 조회 - 카테고리ID로 조회 */
exports.getCategory = (req, res) => {
  service.getCategory(req, res)
}
