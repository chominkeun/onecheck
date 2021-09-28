const { matchesProperty } = require('lodash')

function BuildingService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()

  /* 건물 등록 */
  this.createBuilding = (req, res) => {
    const user_no = req.params.user_no

    // Validation Check - building name 입력 받았는지 확인
    if (!req.body.BUILDING_NAME) {
      res.status(400).send({
        message: 'Must include \'BUILDING_NAME\''
      })
      return
    }

    // 생성할 정보 - DB 데이터 형식에 맞게 저장
    const building = {
      USER_NO: user_no,
      BUILDING_NAME: req.body.BUILDING_NAME,
      ATTACH_ID: req.body.ATTACH_ID || null,
      BUILDING_ADDRESS: req.body.BUILDING_ADDRESS || null,
      BUILDING_DESC: req.body.BUILDING_DESC || null,
      BUILDING_FLOORS: req.body.BUILDING_FLOORS || null,
      BUILDING_BASEMENT_FLOORS: req.body.BUILDING_BASEMENT_FLOORS || null,
      BUILDING_LAT: req.body.BUILDING_LAT || null,
      BUILDING_LOT: req.body.BUILDING_LOT || null
    }

    db.BUILDING.create(building)
      .then((data) => {
        // 201 Created : 생성 성공 메시지(message) + 등록한 건물 정보(building) 응답
        res.status(201).send({
          message: '건물 등록이 완료되었습니다.',
          building: data
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot create building in BUILDING'
        })
      })
  }

  /* 건물 목록 조회 - 전체 (APP에서 사용) */
  this.getAllBuilding = (req, res) => {
    db.sequelize.query(
      `SELECT  *
            FROM BUILDING LEFT OUTER JOIN
                 ATTACHMENT_FILE ON
            BUILDING.ATTACH_ID = ATTACHMENT_FILE.ATTACH_ID`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let building_list = data
        building_list.forEach((value, index) => {
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

        res.status(200).send(building_list)

      })
  }

  /* 건물 목록 조회 - (by user_no) */
  this.getBuildings = (req, res) => {
    const user_no = req.params.user_no
    db.sequelize.query(
      `SELECT BUILDING.BUILDING_NAME, BUILDING.BUILDING_ADDRESS, BUILDING.BUILDING_ID, BUILDING.BUILDING_DESC, BUILDING.BUILDING_FLOORS, BUILDING.ATTACH_ID, BUILDING.USER_NO, BUILDING.BUILDING_BASEMENT_FLOORS, BUILDING_LAT, BUILDING_LOT 
      FROM BUILDING, USER 
      WHERE USER.USER_NO = BUILDING.USER_NO AND USER.USER_NO = ${user_no}`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'ERROR : Cannot Get buildings in BUILDING'
      })
    })
  }

  /* 건물 정보 수정 */
  this.updateBuilding = (req, res) => {
    const building_id = parseInt(req.params.building_id, 10)
    if (!req.body.BUILDING_NAME) {
      res.status(400).send({
        message: 'Must include \'BUILDING_NAME\''
      })
      return
    }

    // 변경 후 정보 - DB 데이터 형식에 맞추기
    const building_update = {
      BUILDING_NAME: req.body.BUILDING_NAME,
      ATTACH_ID: req.body.ATTACH_ID || null,
      BUILDING_ADDRESS: req.body.BUILDING_ADDRESS || null,
      BUILDING_DESC: req.body.BUILDING_DESC || null,
      BUILDING_FLOORS: req.body.BUILDING_FLOORS || null,
      BUILDING_BASEMENT_FLOORS: req.body.BUILDING_BASEMENT_FLOORS || null,
      BUILDING_LAT: req.body.BUILDING_LAT || null,
      BUILDING_LOT: req.body.BUILDING_LOT || null
    }
    // const building_update = req.body
    
    db.BUILDING.update(building_update, {
      where: { BUILDING_ID: building_id }
    })
      .then((result) => {
        console.log(result)
        if (result == 0) {
          // 여기에 2가지 상황이 걸림 - 1: Building NOT FOUND(404), 2: Unchanged Data(update by same data)(204)
          // Q. 위 2가지 경우를 나누어 처리해주려면 어떻게 해야할지
          res.status(201).send({
            result: false,
            code: 404,
            message: `Cannot Update BUILDING with id=${building_id}. Unchanged Data or BUILDING Not Found`
          })
          return
        }
        res.status(201).send({
          result: true,
          code: 201,
          message: `BUILDING with id=${building_id} is updated successfully`
        })
      })
      .catch((err) => {
        res.status(201).send({
          result: false,
          code: 500,
          message: 'ERROR: Cannot Update BUILDING with id=' + building_id
        })
      })
  }

    /* 건물 삭제 */
    this.deleteBuilding = (req, res) => {
      const building_id = parseInt(req.params.building_id, 10)
  
      db.BUILDING.destroy({
        where: { BUILDING_ID: building_id }
      })
        .then((num) => {
          if (num == 1) {
            res.status(204).send({
              // 204 No Content : 삭제 성공 -> No Content
              message: `BUILDING with id=${building_id} is deleted successfully!`
            })
          } else {
            res.status(404).send({
              message: `Cannot Delete BUILDING with id=${building_id}. BUILDING not found`
            })
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'ERROR: Cannot Delete BUILDING with id=' + building_id
          })
        })
    }

    this.getOneBuilding = (req, res) => {
      const building_id = parseInt(req.params.building_id, 10)
      db.sequelize.query(
        `SELECT  STORE_MANAGER.STORE_ID, STORE_MANAGER.STORE_NAME, STORE_MANAGER.ZIP_CODE, STORE_MANAGER.ADDRESS, STORE_MANAGER.EXTRA_ADDRESS,
                  STORE_MANAGER.STORE_LAT, STORE_MANAGER.STORE_LOT, STORE_MANAGER.DESC, STORE_MANAGER.STORE_FLOORS, STORE_MANAGER.STORE_BASEMENT_FLOORS,
                  ATTACHMENT_FILE.ATTACHMENT_FILE, ATTACHMENT_FILE.ATTACHMENT_FILE_TYPE
              FROM STORE_MANAGER LEFT OUTER JOIN
                  ATTACHMENT_FILE ON
              STORE_MANAGER.ATTACH_ID = ATTACHMENT_FILE.ATTACH_ID
              WHERE STORE_ID = :target_building_id`,
        {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: { target_building_id: building_id },
          raw: true
        }
      )
      .then((data) => {
        let buildingInfo = data[0]
        if (!storeInfo.ATTACHMENT_FILE) {
          buildingInfo.IMG_SRC = ''
        } else {
          const bufferBase64 = buildingInfo.ATTACHMENT_FILE.toString('base64')
          const fileType = buildingInfo.ATTACHMENT_FILE_TYPE
          const chgImg = `data:${fileType};base64,` + bufferBase64
          buildingInfo.IMG_SRC = chgImg
          buildingInfo.ATTACHMENT_FILE = ''
        }
        res.status(200).send(buildingInfo)
      })
    }
}

module.exports = new BuildingService()
