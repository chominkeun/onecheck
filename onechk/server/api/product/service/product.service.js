function ProductService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()
  const fs = require('fs')
  const Op =  db.sequelize.Sequelize.Op

  /* 상품 조회 - 어플 이미지 포함 모두 조회 */
  this.getAllProducts = (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)
    db.sequelize.query(
      `SELECT  STORE_PRT.PRT_ID, STORE_PRT.PRT_NAME, STORE_PRT.PRICE, STORE_PRT.DESC, STORE_PRT.ATTACH_ID,
                ATTACHMENT_FILE.ATTACHMENT_FILE, ATTACHMENT_FILE.ATTACHMENT_FILE_TYPE
            FROM    STORE_PRT LEFT OUTER JOIN
                    ATTACHMENT_FILE ON
                    STORE_PRT.ATTACH_ID = ATTACHMENT_FILE.ATTACH_ID
            WHERE   STORE_PRT.STORE_ID = ${store_id}`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let store_list = data
        store_list.forEach((value, index) => {
          if (value.ATTACH_ID === null) {
            value.IMG_SRC = ''
          } else {
            const bufferBase64 = value.ATTACHMENT_FILE.toString('base64')
            const fileType = value.ATTACHMENT_FILE_TYPE
            const chgImg = `data:${fileType};base64,` + bufferBase64
            value.IMG_SRC = chgImg
            value.ATTACHMENT_FILE = ''
            value.ATTACHMENT_DATA_URL = ''
          }
        })

        res.status(200).send(store_list)

      })

  },

    /* 상품 등록 */
    this.createProduct = async (req, res) => {
      const store_id = parseInt(req.params.store_id, 10)
      const t = await db.sequelize.transaction()
      const fileData = req.file
      let attach_id

      try {
        // 첨부파일 확인
        if (fileData !== undefined) {
          // 첨부파일ID 가져오기
          const id = await db.ATTACHMENT_FILE.prototype.getAttachId()
          const imgFile = fs.readFileSync(fileData.path)
          const prt_attach_info = {
            ATTACHMENT_FILE_NM: fileData.originalname,
            ATTACHMENT_FILE_TYPE: fileData.mimetype,
            ATTACHMENT_FILE_SIZE: fileData.size,
            ATTACHMENT_FILE: imgFile,
            ATTACHMENT_DATA_URL: req.body.image_data,
            ATTACH_ID: id
          }
          // 첨부파일 DB입력
          await db.ATTACHMENT_FILE.create(prt_attach_info, { transaction: t })
            .then(data => {
              attach_id = id
            })
            .catch(err => {
              // 파일 삭제
              fs.unlink(fileData.path, (err) => {
              })
              throw new Error()
            })
          // 파일 삭제
          fs.unlink(fileData.path, (err) => {
          })
        }
        // 상품 정보 설정
        const product_info = {
          PRT_NAME: req.body.prt_name,
          PRICE: req.body.price,
          PRT_QTY: req.body.prt_qty,
          DESC: req.body.desc || null,
          CATEGORY_ID: req.body.category_id || null,
          IS_USING_DATA: 'Y',
          ATTACH_ID: attach_id || null,
          STORE_ID: store_id
        }
        // 상품정보 DB 입력
        await db.STORE_PRT.create(product_info, { transaction: t })
          .then(async data => {
            // 상품 등록 완료시 연결해야 할 옵션 목록을 위해 STORE_ID 조건을 설정하여
            // MAX_PRT_ID 값을 가져옴
            res.status(201).send({
              message: 'SUCCESS : 상품 등록이 완료되었습니다.'
            })
          })
          .catch(err => {
            throw new Error()
          })
        await t.commit()
      } catch (error) {
        console.log(error)
        res.status(222).send({ message: 'ERROR : Cannot Process Transection' })
        await t.rollback()
      }
    }

  /* 상품 조회 - 모두 */
  this.getProducts = (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)
    const limit = parseInt(req.query.limit) || 10
    const offset = (parseInt(req.query.offset) || 0) * limit
    let condition = {
      offset: offset,
      limit: limit,
      where: { STORE_ID: store_id }
    }

    db.STORE_PRT.findAll(condition)
      .then(data => {
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get users in USER'
        })
      })
  }

  /* 상품 조회 - 1개 (with user_id) */
  this.getProduct = (req, res) => {
    const product_id = parseInt(req.params.product_id, 10)
    const product = { PRT_ID: product_id }

    db.STORE_PRT.findOne({ where: product })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: 'ERROR : NOT FOUND STORE_PRT with id=' + product_id
          })
        }
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err + 'ERROR : Cannot Get STORE_PRT with id=' + product_id
        })
      })
  }

  /* 상품 업데이트 - 상품정보수정 */
  this.updateProduct = (req, res) => {
    const product_id = parseInt(req.params.product_id, 10)
    // Validation Check - prt_name, price, prt_qty 모두 입력 받았는지 확인
    if (!req.body.PRT_NAME || !req.body.PRICE || !req.body.PRT_QTY) {
      res.status(210).send({
        result: false,
        code: 400,
        message: 'ERROR : Must include \'prt_name\', \'price\', \'prt_qty\''
      })
      return
    }
    // DB에 맞게 column이름 변경(소문자 -> 대문자)
    const product_update = {
      PRT_NAME: req.body.PRT_NAME,
      PRICE: req.body.PRICE,
      PRT_QTY: req.body.PRT_QTY,
      DESC: req.body.DESC || null,
      CATEGORY_ID: req.body.CATEGORY_ID || null,
      ATTACH_ID: req.body.ATTACH_ID || null
    }
    // 상품 정보 변경
    db.STORE_PRT.update(product_update, {
      where: { PRT_ID: product_id }
    })
      .then(num => {
        if (num == 1) {
          res.status(201).send({
            result: true,
            code: 201,
            message: `SUCCESS : PRODUCT with id=${product_id} is updated successfully`
          })
        } else {
          res.status(201).send({
            result: false,
            code: 404,
            message: `ERROR : Cannot Update PRODUCT with id=${product_id}`
          })
        }
      })
      .catch(err => {
        res.status(201).send({
          result: false,
          code: 500,
          message: `ERROR: ERROR Cannot Update PRODUCT with id= ${product_id}`
        })
      })
  }

  /* 상품 삭제 */
  this.deleteProduct = (req, res) => {
    const product_id = parseInt(req.params.product_id, 10)
    db.STORE_PRT.destroy({
      where: { PRT_ID: product_id }
    })
      .then(num => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `SUCCESS : PRODUCT with id=${product_id} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `ERROR : Cannot Delete PRODUCT with id=${product_id}. PRODUCT not found`
          })
        }
      })
      .catch(err => {
        res.status(500).send({
          message: 'ERROR : Cannot Delete PRODUCT with id=' + product_id
        })
      })
  }

  /* 상품 테이블 - 조회 (count) */
  this.getProductCnt = function(req, res) {
    const sotreId = req.params.storeId
    db.STORE_PRT.count({
      where: { STORE_ID: sotreId }
    })
      .then(result => {
        var output = {}
        output.count = result
        dbHelper.sendJSON(res, 200, output)
      })
      .catch(err => {
        console.log(err)
      })
  }

  /* 카테고리 -> 상품 테이블 - 조회 */
  this.getCategoryProduct = function(req, res) {
    const store_id = parseInt(req.params.storeId, 10)
    const category_id = parseInt(req.params.categoryId, 10)
    const limit = parseInt(req.query.limit) || 10
    const offset = (parseInt(req.query.offset) || 0) * limit

    let condition = {
      offset: offset,
      limit: limit,
      where: {
        STORE_ID: store_id,
        CATEGORY_ID: category_id
      }
    }

    db.STORE_PRT.findAll(condition)
      .then(result => {
        res.status(200).send(result)
      })
      .catch(err => {
        res.status(500).send({
          message: err + 'ERROR : Cannot Get STORE_PRT '
        })
      })
  }

  /* 카테고리 -> 상품 테이블 (count) - 조회 */
  this.getCategoryProductCnt = function(req, res) {
    const sotreId = req.params.storeId
    const categoryId = req.params.categoryId
    db.STORE_PRT.count({
      where: {
        STORE_ID: sotreId,
        CATEGORY_ID: categoryId
      }
    })
      .then(result => {
        var output = {}
        output.count = result
        dbHelper.sendJSON(res, 200, output)
      })
      .catch(err => {
        console.log(err)
      })
  }


  /* 상품 카테고리 이동 */
  this.moveProductCategoryInfo = function(req, res) {
    const data = req.body
    const prt_update = { CATEGORY_ID: data.CATEGORY_ID }

    db.STORE_PRT.update(prt_update, {
      where: { PRT_ID: data.PRT_ID }
    })
      .then(num => {
        if (num == 1) {
          res.status(201).send({
            message: `SUCCESS : PRODUCT with id=${data.PRT_ID} is updated successfully`
          })
        } else {
          res.status(404).send({
            message: `ERROR : Cannot Update PRODUCT with id=${data.PRT_ID}. PRODUCT not found`
          })
        }
      })
      .catch(err => {
        res.status(500).send({
          message: 'ERROR: Cannot Update PRODUCT with id=' + data.PRT_ID
        })
      })
  }

  /* 상품 전체 조회(주문 관리 내 상품 조회시 limit 제외) */
  this.getProductAll = function(req, res) {
    const store_id = parseInt(req.params.store_id, 10)

    let condition = {
      where: { STORE_ID: store_id }
    }

    db.STORE_PRT.findAll(condition)
      .then(data => {
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get Store_products in STORE_PRT'
        })
      })
  }

  this.getMaxPrtId = function(req, res) {
    const store_id = parseInt(req.params.store_id, 10)
    let condition = {
      where: { STORE_ID: store_id }
    }
    db.STORE_PRT.max('PRT_ID', condition)
      .then(maxPrtId => {
        res.status(200).send({ maxPrtId })
      })
      .catch(err => {
        res.status(500).send({
          message: err.message
        })
      })
  }

  /* 생성 시 가게에 중복 상품명 검색 */
  this.getDuplicateProductName = (req, res) => {
    const STORE_ID = parseInt(req.params.storeId, 10)
    const PRT_NAME = req.params.productName
    const condition = {
      where: {
        STORE_ID,
        PRT_NAME
      }
    }
    let result
    let code
    let message

    db.STORE_PRT.count(condition)
      .then(data => {
        if ( data === 0 ){
          result = true
          code = 200
          message = `SUCCESS : getDuplicateProductName with PRT_ID: ${PRT_NAME}`
        } else {
          result = false
          code = 200
          message = `ERROR : getDuplicateProductName with COUNT : ${data}`
        }
        res.status(200).send({
          result,
          code,
          message
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: `ERROR : 중복 조회 중 오류 발생`
        })
      })
  }

  /* 수정 시 가게에 중복 상품명 검색 */
  this.getDuplicateProductIdName = (req, res) => {
    const storeId = parseInt(req.params.storeId, 10)
    const prtName = req.params.productName
    const prtId = parseInt(req.params.productId, 10)

    const condition = {
      where: {
        PRT_ID: { [Op.ne]: prtId },
        STORE_ID: storeId,
        PRT_NAME: prtName
      }
    }

    let result
    let code
    let message

    db.STORE_PRT.count(condition)
      .then(data => {
        if ( data === 0 ){
          result = true
          code = 200
          message = `SUCCESS : getDuplicateProductName with PRT_ID: ${prtName}`
        } else {
          result = false
          code = 200
          message = `ERROR : getDuplicateProductName with COUNT : ${data}`
        }
        res.status(200).send({
          result,
          code,
          message
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: `ERROR : 중복 조회 중 오류 발생`
        })
      })

  }
}


//Sequelize 테스트용도
this.sequelize_getProductAll = function(request, response) {
  sequelize_db = dbHelper.getConnectionSync()
  //select
  sequelize_db.STORE_PRT.findAll({})
    .then(result => {
      var output = {}
      output.datas = result
      dbHelper.sendJSON2(response, 200, output)
    })
    .catch(err => {
      var output = {}
      output.datas = err
      console.log(err)
    })
}

this.sequelize_get_Category_All = function(request, response) {
  sequelize_db = dbHelper.getConnectionSync()
  //select
  sequelize_db.PRT_CATEGORY.findAll({})
    .then(result => {
      var output = {}
      output.datas = result
      dbHelper.sendJSON2(response, 200, output)
    })
    .catch(err => {
      var output = {}
      output.datas = err
      console.log(err)
    })
}


module.exports = new ProductService()
