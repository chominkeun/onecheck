const { Router } = require('express')
const router = Router()
const controller = require('./controller/user.controller')

/* 유저 조회 - 모두 */
router.get('/', controller.getUsers)

/* 유저 조회 - 1명 (with user_id) */
router.get('/:user_id', controller.getUser)

/* 유저 조회 - 1명 (with user_email) */
router.get('/email/:user_email', controller.getUserByEmail)

/* 유저 조회 - 가게 / 사용자 조회 */
router.get('/store/:user_id', controller.getUserStore)

/*
  사용자 테이블 - ID, email, phone 조회 ( 신규 가입 )
  vue -> MyJoin :  checkDuplicate
  store -> user :  FETCH_DUPLICATE_USER_INFO
  api -> userApi : duplicateIdCheck , duplicateEmailCheck , duplicatePhoneNumCheck
  server -> user.controller : getDuplicateSearch
  server -> user.service : getDuplicateSearch
*/
router.get('/name/:name/value/:value', controller.getDuplicateSearch)

/*
  유저 등록 - 회원가입
  vue -> MyJoin :  createUserInfo
  store -> user :  FETCH_CREATE_USER_INFO
  api -> userApi : createUserInfo
  server -> user.controller : createUserInfo
  server -> user.service : createUserInfo
*/
router.post('/', controller.createUserInfo)

/*
  유저 업데이트 - 회원정보수정
  vue -> MyJoin :  updateUserInfo
  store -> user :  FETCH_UPDATE_USER_INFO
  api -> userApi : updateUserInfo
  server -> user.controller : updateUserInfo
  server -> user.service : updateUserInfo
*/
router.put('/:user_no', controller.updateUserInfo)
/*
  유저 삭제 - 회원탈퇴
  vue -> MyJoin :  deleteUserInfo
  store -> user :  FETCH_DELTE_USER_INFO
  api -> userApi : deleteUserInfo
  server -> user.controller : deleteUserInfo
  server -> user.service : deleteUserInfo
*/
router.delete('/:user_no', controller.deleteUserInfo)

/*
  사용자 테이블 - ID, email, phone 조회 ( 사용자 수정 )
  vue -> MyJoin :  checkDuplicate
  store -> user :  FETCH_DUPLICATE_USER_INFO
  api -> userApi : duplicateIdCheck , duplicateEmailCheck , duplicatePhoneNumCheck
  server -> user.controller : getDuplicateSearch
  server -> user.service : getDuplicateSearch
*/
router.get('/name/:name/value/:value/user/:userNo', controller.getDuplicateSearchUserNo)

module.exports = router
