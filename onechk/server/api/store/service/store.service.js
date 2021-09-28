function StoreService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()

  /* 가게 목록 조회 - 전체 (APP 사용) */
  this.getAll = (req, res) => {
    db.sequelize.query(
      `SELECT  STORE_MANAGER.STORE_ID, STORE_MANAGER.STORE_NAME, STORE_MANAGER.ZIP_CODE, STORE_MANAGER.ADDRESS, STORE_MANAGER.EXTRA_ADDRESS,
                STORE_MANAGER.STORE_LAT, STORE_MANAGER.STORE_LOT, STORE_MANAGER.DESC, STORE_MANAGER.STORE_FLOORS, STORE_MANAGER.STORE_BASEMENT_FLOORS,
                ATTACHMENT_FILE.ATTACHMENT_FILE, ATTACHMENT_FILE.ATTACHMENT_FILE_TYPE
            FROM STORE_MANAGER LEFT OUTER JOIN
                 ATTACHMENT_FILE ON
            STORE_MANAGER.ATTACH_ID = ATTACHMENT_FILE.ATTACH_ID`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let store_list = data
        store_list.forEach((value, index) => {
          if (value.ATTACHMENT_FILE === null) {
            value.IMG_SRC = ''
          } else {
            const bufferBase64 = value.ATTACHMENT_FILE.toString('base64')
            const fileType = value.ATTACHMENT_FILE_TYPE
            const chgImg = `data:${fileType};base64,` + bufferBase64
            value.IMG_SRC = chgImg
            value.ATTACHMENT_FILE = ''
          }
        })

        res.status(200).send(store_list)

      })
  }

  /* 가게 조회 - 모두 (by user_no) */
  this.getStores = (req, res) => {
    const user_no = req.params.user_no
    const limit = parseInt(req.query.limit) || 10
    const offset = (parseInt(req.query.offset) || 0) * limit
    let condition = {
      offset: offset,
      limit: limit,
      where: { USER_NO: user_no }
    }

    db.STORE_MANAGER.findAll(condition)
      .then((data) => {
        // if (data.length == 0) {
        //   res.status(404).send({
        //     message:
        //       'ERROR : NOT FOUND stores in STORE_MANAGER with user_no=' +
        //       user_no
        //   })
        //   return
        // }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get stores in STORE_MANAGER'
        })
      })
  }


  /* 가게 조회 - 1개 (with user_no, store_id) */
  this.getStore = (req, res) => {
    const user_no = req.params.user_no
    const store_id = parseInt(req.params.store_id, 10)

    const store = {
      USER_NO: user_no,
      STORE_ID: store_id
    }

    db.STORE_MANAGER.findOne({
      attributes: [
        'STORE_ID', 'STORE_NAME', 'STORE_CODE', 'ZIP_CODE', 'ADDRESS', 'EXTRA_ADDRESS', 'STORE_TEL_NUM',
        'STORE_FORM', 'ATTACH_ID', 'STORE_LAT', 'STORE_LOT', 'DESC', 'STORE_FLOORS', 'STORE_BASEMENT_FLOORS'
      ],
      where: store
    })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ERROR : NOT FOUND STORE_PRT with user_no=${user_no}, store_id=${store_id}`
          })
          return
        }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err + 'ERROR: Cannot Get STORE_PRT with id=' + store_id
        })
      })
  }

  this.getOneStore = (req, res) => {
    //store_id로 단건 조회 Sensor에서 활용
    const store_id = parseInt(req.params.store_id, 10)
    db.sequelize.query(
      `SELECT  STORE_MANAGER.STORE_ID, STORE_MANAGER.STORE_NAME, STORE_MANAGER.ZIP_CODE, STORE_MANAGER.ADDRESS, STORE_MANAGER.EXTRA_ADDRESS,
                STORE_MANAGER.STORE_LAT, STORE_MANAGER.STORE_LOT, STORE_MANAGER.DESC, STORE_MANAGER.STORE_FLOORS, STORE_MANAGER.STORE_BASEMENT_FLOORS,
                ATTACHMENT_FILE.ATTACHMENT_FILE, ATTACHMENT_FILE.ATTACHMENT_FILE_TYPE
            FROM STORE_MANAGER LEFT OUTER JOIN
                 ATTACHMENT_FILE ON
            STORE_MANAGER.ATTACH_ID = ATTACHMENT_FILE.ATTACH_ID
            WHERE STORE_ID = :target_store_id`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { target_store_id: store_id },
        raw: true
      }
    )
      .then((data) => {
        let storeInfo = data[0]
        if (!storeInfo.ATTACHMENT_FILE) {
          storeInfo.IMG_SRC = ''
        } else {
          const bufferBase64 = storeInfo.ATTACHMENT_FILE.toString('base64')
          const fileType = storeInfo.ATTACHMENT_FILE_TYPE
          const chgImg = `data:${fileType};base64,` + bufferBase64
          storeInfo.IMG_SRC = chgImg
          storeInfo.ATTACHMENT_FILE = ''
        }
        res.status(200).send(storeInfo)
      })
  }

  /* 가게 등록 */
  this.createStoreInfo = (req, res) => {
    const user_no = req.params.user_no

    // 생성할 정보 - DB 데이터 형식에 맞게 저장
    const store = {
      USER_NO: user_no,
      STORE_NAME: req.body.STORE_NAME,
      STORE_CODE: String(req.body.STORE_CODE) || null,
      STORE_TEL_NUM: req.body.STORE_TEL_NUM,
      STORE_FORM: req.body.STORE_FORM || null,
      ATTACH_ID: req.body.ATTACH_ID || null,
      STORE_FLOORS: req.body.STORE_FLOORS || 1,
      STORE_BASEMENT_FLOORS: req.body.STORE_BASEMENT_FLOORS || 0,
      ADDRESS: req.body.ADDRESS || null,
      EXTRA_ADDRESS: req.body.EXTRA_ADDRESS || null,
      STORE_LAT: req.body.STORE_LAT || null,
      STORE_LOT: req.body.STORE_LOT || null,
      DESC: req.body.DESC || null
    }
    // DB INSERT
    db.STORE_MANAGER.create(store)
      .then((data) => {
        // 201 Created : 생성 성공 메시지(message) + 등록한 가게 정보(store) 응답
        res.status(201).send({
          message: '가게 등록이 완료되었습니다.',
          store: data
        })
      })
      .catch((err) => {
        console.log('createStore INSERT  err', err)
        res.status(500).send({
          message: err.message || 'ERROR : Cannot create store in STORE_MANAGER'
        })
      })
  }

  /* 가게 정보 수정 */
  this.updateStoreInfo = (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)
    // Validation Check - storeName, storeTelNum 모두 입력 받았는지 확인
    if (!req.body.STORE_NAME || !req.body.STORE_TEL_NUM) {
      res.status(400).send({
        message: 'Must include \'STORE_NAME\', \'STORE_TEL_NUM\''
      })
      return
    }

    // 변경 후 정보 - DB 데이터 형식에 맞추기
    const store_update = {
      STORE_NAME: req.body.STORE_NAME,
      STORE_TEL_NUM: req.body.STORE_TEL_NUM,
      STORE_CODE: req.body.STORE_CODE || null,
      STORE_FORM: req.body.STORE_FORM || null,
      ATTACH_ID: req.body.ATTACH_ID || null,
      ADDRESS: req.body.ADDRESS || null,
      STORE_FLOORS: req.body.STORE_FLOORS || 1,
      STORE_BASEMENT_FLOORS: req.body.STORE_BASEMENT_FLOORS || 0,
      EXTRA_ADDRESS: req.body.EXTRA_ADDRESS || null,
      STORE_LAT: req.body.STORE_LAT || null,
      STORE_LOT: req.body.STORE_LOT || null,
      DESC: req.body.DESC || null
    }
    db.STORE_MANAGER.update(store_update, {
      where: { STORE_ID: store_id }
    })
      .then((result) => {
        if (result == 0) {
          // 여기에 2가지 상황이 걸림 - 1: Store NOT FOUND(404), 2: Unchanged Data(update by same data)(204)
          // Q. 위 2가지 경우를 나누어 처리해주려면 어떻게 해야할지
          res.status(404).send({
            message: `Cannot Update STORE_MANAGER with id=${store_id}. Unchanged Data or Store Not Found`
          })
          return
        }
        res.status(201).send({
          message: `STORE_MANAGER with id=${store_id} is updated successfully`
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: 'ERROR: Cannot Update STORE_MANAGER with id=' + store_id
        })
      })
  }

  /* 가게 삭제 */
  this.deleteStoreInfo = (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)

    db.STORE_MANAGER.destroy({
      where: { STORE_ID: store_id }
    })
      .then((num) => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `STORE with id=${store_id} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `Cannot Delete STORE with id=${store_id}. STORE not found`
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Delete STORE with id=' + store_id
        })
      })
  }

  /* 가게 카테고리 조회 */
  this.getStoreCategory = (req, res) => {
    const condition = {
      attributes: ['STORE_CATEGORY_ID', 'STORE_KND'],
      where: { IS_USING_DATA: 'Y' }
    }
    db.STORE_CATEGORY.findAll(condition)
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get Store Category in STORE_CATEGORY'
        })
      })
  }

}

module.exports = new StoreService()
