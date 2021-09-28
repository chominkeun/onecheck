const service = require('../service/attach.service')

/* 첨부파일 테이블 - 상점ID로 전체 조회 */
exports.getAttachFile = (req, res) => {
  service.getAttachFile(req, res)
}

/* 첨부파일 테이블 - 등록 */
exports.createAttachFile = (req, res) => {
  service.createAttachFile(req, res)
}

/* 첨부파일 테이블 - 업데이트 */
exports.updateAttachFile = (req, res) => {
  service.updateAttachFile(req, res)
}

/* 첨부파일 테이블 - 삭제 */
exports.deleteAttachFile = (req, res) => {
  service.deleteAttachFile(req, res)
}

