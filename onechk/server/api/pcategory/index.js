const { Router } = require('express')
const router = Router()
const controller = require('./controller/prtCategory.controller')

/*
  상품 카테고리 조회 : 상점-ID 로 전체 조회
*/
router.get('/:store_id', controller.getProductCategoryList)


/*
  상품 카테고리 등록
  vue -> CategoryEditPopup :  createProductCategoryInfo
  store -> product :  FETCH_CREATE_PRODUCT_CATEGORY_INFO
  api -> pcategoryApi : createProductCategoryInfo
  server -> prtCategory.controller : createProductCategoryInfo
  server -> prtCategory.service : createProductCategoryInfo
*/
router.post('/', controller.createProductCategoryInfo)


/*
  상품 카테고리 수정
  vue -> CategoryEditPopup :  updateProductCategoryInfo
  store -> product :  FETCH_UPDATE_PRODUCT_CATEGORY_INFO
  api -> pcategoryApi : updateProductCategoryInfo
  server -> prtCategory.controller : updateProductCategoryInfo
  server -> prtCategory.service : updateProductCategoryInfo
*/
router.put('/:category_id', controller.updateProductCategoryInfo)


/*
  상품 카테고리 삭제
  vue -> CategoryEditPopup :  deleteProductCategoryInfo
  store -> product :  FETCH_DELETE_PRODUCT_CATEGORY_INFO
  api -> pcategoryApi : deleteProductCategoryInfo
  server -> prtCategory.controller : deleteProductCategoryInfo
  server -> prtCategory.service : deleteProductCategoryInfo
*/
router.delete('/:category_id', controller.deleteProductCategoryInfo)


// ============================== [ 미사용 ] =============================== //
/* 상품 카테고리 조회 - 카테고리ID로 조회 */
router.get('/category-id/:category_id', controller.getCategory)

/* 상품 카테고리 조회 - 상점ID&카테고리이름(unique key)으로 특정 카테고리 조회 */
router.get(
  '/store-id/:store_id/category-name/:category_name',
  controller.getSelectProductCategory
)

module.exports = router
