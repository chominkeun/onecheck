function PrtCategoryService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()


  /* 상품 카테고리 조회 - 상점ID로 전체 조회 */
  this.getProductCategoryList = function(req, res) {
    const store_id = parseInt(req.params.store_id, 10)
    db.PRT_CATEGORY.findAll({
      where: { STORE_ID: store_id }
    })
      .then((data) => {
        if (data.length == 0) {
          res.status(200).send({
            message: 'ERROR : NOT FOUND PRT_CATEGORY with store_id : ' + store_id
          })
          return
        }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(200).send({
          message: err.message ||
            `ERROR : 상품 카테고리 조회 중 오류 발생 STORE_ID : ${store_id}`
        })
      })
  }

  /* 상품 카테고리 등록 */
  this.createProductCategoryInfo = function(req, res) {
    // Validation Check - store_id, category_name 모두 받았는지 확인
    if (!req.body.STORE_ID || !req.body.CATEGORY_NAME) {
      res.status(400).send({
        message: 'ERROR : Must include \'store_id\', \'category_name\''
      })
      return
    }

    const store_id = parseInt(req.body.STORE_ID, 10)

    // 상품 카테고리 등록 후, 생성된 category_id 값을 리턴
    const prt_category_info = {
      STORE_ID: store_id,
      CATEGORY_NAME: req.body.CATEGORY_NAME,
      REG_NAME: req.body.NAME || 'SYS000',
      CHG_NAME: req.body.NAME || 'SYS000'
    }

    db.PRT_CATEGORY.create(prt_category_info)
      .then((data) => {
        res.status(201).send({
          message: 'SUCCESS : 상품 카테고리가 등록되었습니다.',
          data
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message ||
            'ERROR : Cannot create product category in PRT_CATEGORY'
        })
      })
  }

  /* 상품 카테고리 수정 */
  this.updateProductCategoryInfo = function(req, res) {
    // Validation Check - category_name을 입력 받았는지 확인
    if (!req.body.CATEGORY_NAME) {
      res.status(400).send({
        message: 'ERROR : Must include \'CATEGORY_NAME\''
      })
      return
    }
    const category_id = parseInt(req.params.category_id, 10)

    const prt_category = {
      CATEGORY_ID: category_id,
      CATEGORY_NAME: req.body.CATEGORY_NAME
    }

    db.PRT_CATEGORY.update(prt_category, {
      where: { CATEGORY_ID: category_id }
    })
      .then((result) => {
        if (result == 0) {
          res.status(404).send({
            message: `ERROR : 상품 카테고리의 ID ( ${category_id} )를 찾지 못하였습니다.`
          })
          return
        }
        res.status(201).send({
          message: 'SUCCESS : 상품 카테고리 정보 수정을 완료하였습니다.',
          data: prt_category
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : 상품 카테고리 수정 중 오류가 발생했습니다.'
        })
      })
  }

  /* 상품 카테고리 삭제 */
  this.deleteProductCategoryInfo = function(req, res) {
    const category_id = parseInt(req.params.category_id, 10)

    db.PRT_CATEGORY.destroy({
      where: { CATEGORY_ID: category_id }
    })
      .then((result) => {
        if (result == 0) {
          res.status(404).send({
            message: `ERROR : 상품 카테고리의 ID ( ${category_id} )를 찾지 못하였습니다.`
          })
          return
        }
        res.status(204).send({
          message: `SUCCESS : 상품 카테고리 정보 삭제를 완료하였습니다.`
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : 상품 카테고리 삭제 중 오류가 발생했습니다.'
        })
      })
  }

  // ============================== [ 미사용 ] =============================== //
  /* 상품 카테고리 조회 - 상점 ID 로 전체 조회) */
  this.getSelectProductCategory = function(req, res) {
    const store_id = parseInt(req.params.store_id, 10)
    const category_name = req.params.category_name

    const product_category = {
      STORE_ID: store_id,
      CATEGORY_NAME: category_name
    }

    db.PRT_CATEGORY.findOne({ where: product_category })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ERROR : NOT FOUND PRT_CATEGORY with store_id=${store_id}, category_name=${category_name}`
          })
          return
        }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message ||
            `ERROR: Cannot Get STORE_PRT store_id=${store_id}, category_name=${category_name}`
        })
      })
  }


  /* 상품 카테고리 조회 - 카테고리ID로 조회 */
  this.getCategory = function(req, res) {
    const category_id = parseInt(req.params.category_id, 10)

    db.PRT_CATEGORY.findOne({
      where: { CATEGORY_ID: category_id }
    })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ERROR : NOT FOUND PRT_CATEGORY with category_id=${category_id}`
          })
          return
        }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Get PRT_CATEGORY'
        })
      })
  }
}

module.exports = new PrtCategoryService()
