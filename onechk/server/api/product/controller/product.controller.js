const service = require('../service/product.service')

/* 상품 조회 - 어플 이미지포함 */
exports.getAllProducts = (req, res, next) => {
  service.getAllProducts(req, res)
}

/* 상품 등록 */
exports.createProduct = (req, res, next) => {
  service.createProduct(req, res)
}

/* 상품 조회 - 모두 */
exports.getProducts = (req, res, next) => {
  service.getProducts(req, res)
}

/* 상품 조회 - 1개 (with user_id) */
exports.getProduct = (req, res, next) => {
  service.getProduct(req, res)
}

/* 상품 업데이트 - 상품정보수정 */
exports.updateProduct = (req, res, next) => {
  service.updateProduct(req, res)
}

/* 상품 삭제 */
exports.deleteProduct = (req, res, next) => {
  service.deleteProduct(req, res)
}

exports.getMaxPrtId = (req, res, next) => {
  service.getMaxPrtId(req, res)
}

//#############################################################

/* 상품 테이블 - 조회 (count) */
exports.getProductCnt = (req, res) => {
  service.getProductCnt(req, res)
}

/* 카테고리 -> 상품 테이블 - 조회 */
exports.getCategoryProduct = (req, res) => {
  service.getCategoryProduct(req, res)
}

/* 카테고리 -> 상품 테이블 (count) - 조회 */
exports.getCategoryProductCnt = (req, res) => {
  service.getCategoryProductCnt(req, res)
}

/* 상품 카테고리 테이블 - 조회 */
exports.getCategory = (req, res) => {
  service.getCategory(req, res)
}

/* 상품 카테고리 이동 */
exports.moveProductCategoryInfo = (req, res) => {
  service.moveProductCategoryInfo(req, res)
}

/* 상품 조회 주문 관리에서 사용 */
exports.getProductAll = (req, res) => {
  service.getProductAll(req, res)
}

//Sequelize test용도
exports.sequelize_getProductAll = (req, res, next) => {
  service.sequelize_getProductAll(req, res)
}

exports.sequelize_get_Category_All = (req, res, next) => {
  service.sequelize_get_Category_All(req, res)
}

exports.getDuplicateProductName = (req, res, next) => {
  service.getDuplicateProductName(req, res)
}


exports.getDuplicateProductIdName = (req, res, next) => {
  service.getDuplicateProductIdName(req, res)
}
