const { Router } = require('express')
const router = Router()
const controller = require('./controller/product.controller')

const path = require('path')
const multer = require('multer')
const fs = require('fs')

try {
  fs.readdirSync('uploads')
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
  fs.mkdirSync('uploads')
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      console.log(file)
      if (file !== null || file !== 'undefined') {
        const ext = path.extname(file.originalname)
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
      }
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
})

/* 상품 조회 - 어플 이미지 포함*/
router.get('/get_all/:store_id', controller.getAllProducts)

/* 상품 조회 - 모두 */
router.get('/:store_id', controller.getProducts)

/* 상품 조회 - 1개 (with user_id) */
router.get('/store-id/:store_id/product-id/:product_id', controller.getProduct)

/* 상품 등록 */
router.post('/:store_id', upload.single('img'), controller.createProduct)

/* 상품 업데이트 - 상품정보수정 */
router.put('/:product_id', controller.updateProduct)

/* 상품 삭제 */
router.delete('/:product_id', controller.deleteProduct)

/* 스토어 내 해당되는 상품 MAX_ID 조회 */
router.get('/getMaxId/:store_id', controller.getMaxPrtId)

/*
  상품 카테고리 이동
  vue -> CategoryMovePopup :  moveProductCategoryInfo
  store -> product :  FETCH_MOVE_PRODUCT_CATEGORY_INFO
  api -> productApi : moveProductCategoryInfo
  server -> product.controller : moveProductCategoryInfo
  server -> product.service : moveProductCategoryInfo
*/
router.put('/prt/category', controller.moveProductCategoryInfo)

/* 상품 테이블 - 조회 (count) */
router.get('/cnt/:storeId', controller.getProductCnt)

/* 카테고리 -> 상품 테이블 (count) - 조회 */
router.get('/cnt/store-id/:storeId/category-id/:categoryId', controller.getCategoryProductCnt)

/* 카테고리 -> 상품 테이블 - 조회 */
router.get(
  '/category/store-id/:storeId/category-id/:categoryId',
  controller.getCategoryProduct
)

/* GET PRODUCT IN ORDER getProductAll. */
router.get('/getProductAll/:store_id', controller.getProductAll)

/* GET PRODUCT sequelize_get_Category_All. */
router.get('/Category_All', controller.sequelize_get_Category_All)

/* 생성 시 가게에 중복 상품명 검색 */
router.get('/duplicate/store/:storeId/value/:productName', controller.getDuplicateProductName)

/* 수정 시 가게에 중복 상품명 검색 */
router.get('/duplicate/store/:storeId/product/:productId/value/:productName', controller.getDuplicateProductIdName)

module.exports = router
