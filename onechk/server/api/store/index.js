const { Router } = require('express')
const router = Router()
const controller = require('./controller/store.controller')



/* 가게 목록 조회 (by user_no) */
router.get('/:user_no', controller.getStores)

/* 가게 조회 - 1개 (storeId) StoreId에 속한 1개의 가게 목록*/
router.get('/StoreOne/:store_id', controller.getOneStore)

/* 가게 목록 조회 - 전체 (APP에서 사용) */
router.get('/all/list', controller.getAll)

/*
  가게 카테고리 목록 조회
  vue -> MyStore :  createInfoFinished
  store -> store :  CREATE_STORE_INFO
  api -> storeApi : createStoreInfo
  server -> store.controller : createStore
  server -> store.service : createStore
*/
router.get('/category/list', controller.getStoreCategory)

/* 가게 조회 - 1개 (userNo, storeId) User가 속한 1개의 가게 목록*/
router.get('/user-no/:user_no/store-id/:store_id', controller.getStore)



/*
  가게 등록
  vue -> MyStore :  createInfoFinished
  store -> store :  CREATE_STORE_INFO
  api -> storeApi : createStoreInfo
  server -> store.controller : createStore
  server -> store.service : createStore
*/
router.post('/:user_no', controller.createStoreInfo)

/*
  가게 정보 수정
  vue -> MyStore :  modifyInfoFinished
  store -> store :  UPDATE_STORE_INFO
  api -> storeApi : updateStoreInfo
  server -> store.controller : updateStoreInfo
  server -> store.service : updateStoreInfo
*/
router.put('/:store_id', controller.updateStoreInfo)

/*
  가게 삭제
  vue -> MyStore :  deleteInfo
  store -> store :  DELETE_STORE_INFO
  api -> storeApi : deleteStoreInfo
  server -> store.controller : updateStoreInfo
  server -> store.service : updateStoreInfo
*/
router.delete('/:store_id', controller.deleteStoreInfo)




module.exports = router
