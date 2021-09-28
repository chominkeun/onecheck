const { Router } = require('express')
const router = Router()
const controller = require('./controller/attach.controller')

const path = require('path')
const multer = require('multer')
const fs = require('fs')

try {
  fs.readdirSync('uploads')
} catch (error) {
  fs.mkdirSync('uploads')
}

const upload = multer({
  dest: 'uploads/'
});


// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename(req, file, cb) {
//       const name = String(Date.now())
//       const ext = path.extname(file.originalname)
//       cb(null, name + ext)
//     }
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 }
// })


/* 첨부파일 테이블 - 등록 */
router.post('/', upload.single('img'), controller.createAttachFile)

/* 첨부파일 테이블 - ATTACH ID로 조회 */
router.get('/:attach_id', controller.getAttachFile)

/* 상첨부파일 테이블 - 업데이트 */
router.put('/:attach_id', upload.single('img'), controller.updateAttachFile)

/* 첨부파일 테이블 - 삭제 */
router.delete('/:attach_id', controller.deleteAttachFile)


module.exports = router
