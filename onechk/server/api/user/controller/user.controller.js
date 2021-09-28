const service = require('../service/user.service')

/* 유저 조회 - 모두 */
exports.getUsers = (req, res, next) => {
  service.getUsers(req, res)
}

/* 유저 조회 - 1명 (with user_id) */
exports.getUser = (req, res, next) => {
  service.getUser(req, res)
}
/* 유저 조회 - 1명 (with user_email) */
exports.getUserByEmail = (req, res, next) => {
  service.getUserByEmail(req, res)
}

/* 유저 조회 - 1명 (with user_id) */
exports.getUserStore = (req, res, next) => {
  service.getUserStore(req, res)
}

/* 사용자 테이블 - ID, email, phone 중복 조회 */
exports.getDuplicateSearch = (req, res, next) => {
  service.getDuplicateSearch(req, res)
}

/* 유저 등록 - 회원가입 */
exports.createUserInfo = (req, res, next) => {
  service.createUserInfo(req, res)
}

/* 유저 업데이트 - 회원정보수정 */
exports.updateUserInfo = (req, res, next) => {
  service.updateUserInfo(req, res)
}

/* 유저 삭제 - 회원탈퇴 */
exports.deleteUserInfo = (req, res, next) => {
  service.deleteUserInfo(req, res)
}

/* 사용자 테이블 - ID, email, phone 중복 조회 */
exports.getDuplicateSearchUserNo = (req, res, next) => {
  service.getDuplicateSearchUserNo(req, res)
}

