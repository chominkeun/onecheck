function attachService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()
  const fs = require('fs')


  /* 첨부파일 테이블 - 첨부파일ID로 조회 */
  this.getAttachFile = (req, res) => {
    const attach_id = req.params.attach_id
    db.ATTACHMENT_FILE.findAll({
      attributes: ['ATTACHMENT_FILE', 'ATTACHMENT_FILE_TYPE'],
      where: { ATTACH_ID: attach_id }
    })
      .then(result => {
        const bufferBase64 = result[0].ATTACHMENT_FILE.toString('base64')
        const fileType = result[0].ATTACHMENT_FILE_TYPE
        const chgImg = `data:${fileType};base64,` + bufferBase64
        const resData = { IMG_SRC: chgImg }
        res.status(200).send(resData)
      })
      .catch(err => {
        res.status(222).send({
          message: `ERROR : 첨부파일 조회 중 오류 발생`
        })
      })
  }


  /* 첨부파일 테이블 - 등록 */
  this.createAttachFile = async (req, res) => {
    const fileData = req.file
    if (fileData === undefined || fileData === 'undefined') {
      res.status(222).send({ message: 'ERROR : 이미지가 선택되지 않았습니다.' })
      return
    }
    const attachId = await db.ATTACHMENT_FILE.prototype.getAttachId()
    const imgFile = fs.readFileSync(fileData.path)
    const prt_attach_info = {
      ATTACHMENT_FILE_NM: fileData.originalname,
      ATTACHMENT_FILE_TYPE: fileData.mimetype,
      ATTACHMENT_FILE_SIZE: fileData.size,
      ATTACHMENT_FILE: imgFile,
      ATTACH_ID: attachId
    }
    // 첨부파일 INSERT
    db.ATTACHMENT_FILE.create(prt_attach_info)
      .then(data => {
        res.status(201).send({
          message: 'SUCCESS : 첨부파일이 등록되었습니다.',
          attach_id: attachId
        })
      })
      .catch(err => {
        res.status(222).send({
          message: err.message ||
            'ERROR : Cannot create ATTACHMENT_FILE'
        })
      })
    // 파일 삭제
    fs.unlink(fileData.path, (err) => {
    })
  }


  /* 첨부파일 테이블 - 업데이트 */
  this.updateAttachFile = (req, res) => {
    const attach_id = req.params.attach_id
    const fileData = req.file
    if (fileData === undefined || fileData === 'undefined') {
      res.status(222).send({ message: 'ERROR : 이미지가 선택되지 않았습니다.' })
      return
    }
    console.log('fileData.path  ==>  ', fileData.path)
    const imgFile = fs.readFileSync(fileData.path)
    const prt_attach_info = {
      ATTACHMENT_FILE_NM: fileData.originalname,
      ATTACHMENT_FILE_TYPE: fileData.mimetype,
      ATTACHMENT_FILE_SIZE: fileData.size,
      ATTACHMENT_FILE: imgFile
    }
    // 첨부파일 UPDATE
    db.ATTACHMENT_FILE.update(prt_attach_info, {
      where: { ATTACH_ID: attach_id }
    })
      .then(data => {
        res.status(201).send({
          message: 'SUCCESS : 첨부파일이 수정되었습니다.',
          attach_id: attach_id
        })
      })
      .catch(err => {
        res.status(222).send({
          message: err.message ||
            'ERROR : Cannot MODIFY ATTACHMENT_FILE'
        })
      })
    // 파일 삭제
    fs.unlink(fileData.path, (err) => {
    })
  }


  /* 첨부파일 테이블 - 삭제 */
  this.deleteAttachFile = (req, res) => {
    const attach_id = req.params.attach_id
    // 첨부파일 DELETE
    db.ATTACHMENT_FILE.destroy({
      where: { ATTACH_ID: attach_id }
    })
      .then((result) => {
        if (result == 0) {
          res.status(404).send({
            message: `ERROR : 첨부파일의 ID ( ${attach_id} )를 찾지 못하였습니다.`
          })
          return
        }
        res.status(204).send({
          message: `SUCCESS : 첨부파일의 정보 삭제를 완료하였습니다.`
        })
      })
      .catch((err) => {
        res.status(222).send({
          message: err.message || 'ERROR : 첨부파일 삭제 중 오류가 발생했습니다.'
        })
      })
  }

}

module.exports = new attachService()
