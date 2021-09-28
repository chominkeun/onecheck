const { debounce } = require('lodash')

function SensorService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()


  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.getSensorInfo = (req, res) => {

    db.sequelize.query(
      `SELECT
         SEN.SENSOR_ID,
         SEN.SENSOR_NAME,
         SEN.SENSOR_DESC,
         SEN.FLOOR_ID,
         SEN.BOUND,
         SEN.SENSOR_LOC_X,
         SEN.SENSOR_LOC_Y,
         SEN.SENSOR_DV,
         SEN.IS_ACTIVATE,
         REL.SENSOR_EVENT_ID,
         E.SENSOR_EVENT_NAME,
         LIST.EVENT_LIST_NAME,
         LIST.EVENT_LIST_DESC,
         LIST.EVENT_LIST_ID,
         REL.SENSOR_EVENT_REL_ID
        FROM SENSOR SEN
                LEFT OUTER JOIN SENSOR_EVENT_REL REL on SEN.SENSOR_ID = REL.SENSOR_ID
                 LEFT OUTER JOIN SENSOR_EVENT_LIST LIST on LIST.EVENT_LIST_ID = REL.EVENT_LIST_ID
                 LEFT OUTER JOIN SENSOR_EVENT E on E.SENSOR_EVENT_ID = REL.SENSOR_EVENT_ID
        WHERE SEN.FLOOR_ID = ${req.params.floorId}
        ORDER BY SENSOR_ID`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let sensorList = []
        let chgData
        let arr
        let aEvent
        data.forEach((element) => {
          arr = []
          arr.push(element.SENSOR_EVENT_ID)
          chgData = {
            SENSOR_ID: element.SENSOR_ID,
            SENSOR_NAME: element.SENSOR_NAME,
            SENSOR_DESC: element.SENSOR_DESC,
            FLOOR_ID: element.FLOOR_ID,
            BOUND: element.BOUND,
            SENSOR_LOC_X: element.SENSOR_LOC_X,
            SENSOR_LOC_Y: element.SENSOR_LOC_Y,
            SENSOR_DV: element.SENSOR_DV,
            IS_ACTIVATE: element.IS_ACTIVATE,
            DRAGGABLE: false,
            VISIBLE: false,
            CONDITION: 'NORMAL',
            POSITION: { lat: element.SENSOR_LOC_X, lng: element.SENSOR_LOC_Y },
            SENSOR_EVENT_LIST: []
          }
          aEvent = {
            EVENT_LIST_ID: element.EVENT_LIST_ID,
            SENSOR_EVENT_ID: element.SENSOR_EVENT_ID,
            SENSOR_EVENT_NAME: element.SENSOR_EVENT_NAME,
            EVENT_LIST_NAME: element.EVENT_LIST_NAME,
            EVENT_LIST_DESC: element.EVENT_LIST_DESC,
            SENSOR_EVENT_REL_ID: element.SENSOR_EVENT_REL_ID
          }
          chgData.SENSOR_EVENT_LIST.push(aEvent)
          sensorList.push(chgData)
        })

        let uniqueData = []
        sensorList.forEach((element) => {
          if (uniqueData.length === 0) {
            uniqueData.push(element)
          } else {
            let dup = false
            for (let i = 0; i < uniqueData.length; i++) {
              if (uniqueData[i].SENSOR_ID === element.SENSOR_ID) {
                dup = true
                uniqueData[i].SENSOR_EVENT_LIST.push(...element.SENSOR_EVENT_LIST)
              }
            }
            if (!dup) {
              uniqueData.push(element)
            }
          }
        })
        res.status(200).send(uniqueData)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })
  }


  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.getSensorList = (req, res) => {
    db.sequelize.query(
      `SELECT SENSOR.SENSOR_ID,SENSOR.SENSOR_NAME,SENSOR.SENSOR_DESC, SENSOR.FLOOR_ID,SENSOR_EVENT_REL.SENSOR_EVENT_ID,
      SENSOR.BOUND,SENSOR.SENSOR_LOC_X,SENSOR_LOC_Y,SENSOR.IS_ACTIVATE FROM SENSOR, SENSOR_EVENT_REL
      WHERE SENSOR_EVENT_REL.SENSOR_ID = SENSOR.SENSOR_ID `,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })
  }

  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.getOneSensor = (req, res) => {
    const sensor_id = req.params.sensor_id
    db.sequelize.query(
      `SELECT
         SEN.SENSOR_ID,
         SEN.SENSOR_NAME,
         SEN.SENSOR_DESC,
         SEN.FLOOR_ID,
         SEN.BOUND,
         SEN.SENSOR_LOC_X,
         SEN.SENSOR_LOC_Y,
         SEN.SENSOR_DV,
         SEN.IS_ACTIVATE,
         REL.SENSOR_EVENT_ID,
         E.SENSOR_EVENT_NAME,
         LIST.EVENT_LIST_NAME,
         LIST.EVENT_LIST_DESC,
         LIST.EVENT_LIST_ID,
         REL.SENSOR_EVENT_REL_ID
        FROM SENSOR SEN
                LEFT OUTER JOIN SENSOR_EVENT_REL REL on SEN.SENSOR_ID = REL.SENSOR_ID
                 LEFT OUTER JOIN SENSOR_EVENT_LIST LIST on LIST.EVENT_LIST_ID = REL.EVENT_LIST_ID
                 LEFT OUTER JOIN SENSOR_EVENT E on E.SENSOR_EVENT_ID = REL.SENSOR_EVENT_ID
        WHERE SEN.SENSOR_ID = ${sensor_id}
        ORDER BY SENSOR_ID`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let sensorList = []
        let chgData
        let arr
        let aEvent
        data.forEach((element) => {
          arr = []
          arr.push(element.SENSOR_EVENT_ID)
          chgData = {
            SENSOR_ID: element.SENSOR_ID,
            SENSOR_NAME: element.SENSOR_NAME,
            SENSOR_DESC: element.SENSOR_DESC,
            FLOOR_ID: element.FLOOR_ID,
            BOUND: element.BOUND,
            SENSOR_LOC_X: element.SENSOR_LOC_X,
            SENSOR_LOC_Y: element.SENSOR_LOC_Y,
            SENSOR_DV: element.SENSOR_DV,
            IS_ACTIVATE: element.IS_ACTIVATE,
            DRAGGABLE: false,
            VISIBLE: false,
            CONDITION: 'NORMAL',
            POSITION: { lat: element.SENSOR_LOC_X, lng: element.SENSOR_LOC_Y },
            SENSOR_EVENT_LIST: []
          }
          aEvent = {
            EVENT_LIST_ID: element.EVENT_LIST_ID,
            SENSOR_EVENT_ID: element.SENSOR_EVENT_ID,
            SENSOR_EVENT_NAME: element.SENSOR_EVENT_NAME,
            EVENT_LIST_NAME: element.EVENT_LIST_NAME,
            EVENT_LIST_DESC: element.EVENT_LIST_DESC,
            SENSOR_EVENT_REL_ID: element.SENSOR_EVENT_REL_ID
          }
          chgData.SENSOR_EVENT_LIST.push(aEvent)
          sensorList.push(chgData)
        })

        let uniqueData = []
        sensorList.forEach((element) => {
          if (uniqueData.length === 0) {
            uniqueData.push(element)
          } else {
            let dup = false
            for (let i = 0; i < uniqueData.length; i++) {
              if (uniqueData[i].SENSOR_ID === element.SENSOR_ID) {
                dup = true
                uniqueData[i].SENSOR_EVENT_LIST.push(...element.SENSOR_EVENT_LIST)
              }
            }
            if (!dup) {
              uniqueData.push(element)
            }
          }
        })
        res.status(200).send(uniqueData)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })
  }
  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.updateSensor = (req, res) => {
    const sensor_id = parseInt(req.params.sensor_id, 10)
    const sensor_update = req.body
    //센서 table -> 가공,
    db.SENSOR.update(sensor_update, {
      where: { SENSOR_ID: sensor_id }
    })

      .then((result) => {

        if (result == 0) {
          res.status(201).send({
            result: false,
            code: 404,
            message: `Cannot Update SENSOR with id=${sensor_id}. Unchanged Data or SENSOR Not Found`
          })
          return
        }
        res.status(201).send({
          message: `SENSOR with id=${sensor_id} is updated successfully`
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: 'ERROR: Cannot Update SENSOR with id=' + sensor_id
        })
      })
  }

  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.updateSensorEvent = (req, res) => {
    const resLen = req.body.length
    let resCnt = 0
    for (let i = 0; i < req.body.length; i++) {
      const sensor_event_rel_id = parseInt(req.body[i].SENSOR_EVENT_REL_ID, 10)
      const sensor_update = {
        SENSOR_EVENT_ID: req.body[i].SENSOR_EVENT_ID,
        EVENT_LIST_ID: req.body[i].EVENT_LIST_ID
      }
      //센서 table -> 가공,
      db.SENSOR_EVENT_REL.update(sensor_update, {
        where: { SENSOR_EVENT_REL_ID: sensor_event_rel_id }
      })

        .then((result) => {
          resCnt = resCnt + 1
          if (resLen === resCnt) {
            res.status(201).send({
              message: `SENSOR with id=${sensor_event_rel_id} is updated successfully`
            })
          }

        })
        .catch((err) => {
          res.status(500).send({
            message: 'ERROR: Cannot Update SENSOR with id=' + sensor_event_rel_id
          })
        })
    }
  }
  /**
   * 센서 조회 - floor (floorId)
   * 실내도 관리에서 선택된 실내도의 센서 정보를 조회한다.
   * @date : 2021-07-28
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return { floor_id 검색 결과 }
   * @exception  error message 처리
   **/
  this.searchSensor = (req, res) => {
    const search_param = req.params.search_param
    const limit = req.params.limit
    db.sequelize.query(
      `SELECT SENSOR.SENSOR_ID,SENSOR.SENSOR_NAME,SENSOR.FLOOR_ID,SENSOR.SENSOR_DV,
      FLOOR_INFO_ATTACH_REL.FLOOR_NO,SENSOR.IS_USING_DATA ,FLOOR_INFO_ATTACH_REL.IS_GROUND
      FROM FLOOR_INFO_ATTACH_REL,SENSOR WHERE SENSOR_NAME
      LIKE '%${search_param}%'AND SENSOR.FLOOR_ID = FLOOR_INFO_ATTACH_REL.FLOOR_ID AND SENSOR.SENSOR_DV = 'IN'
      LIMIT ${limit},10`
      , {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })
  }

  this.searchOutSensor = (req, res) => {

    const search_param = req.params.search_param
    const limit = req.params.limit
    db.sequelize.query(
      `SELECT SENSOR.SENSOR_ID,SENSOR.SENSOR_NAME,SENSOR.FLOOR_ID,SENSOR.SENSOR_DV,
      FLOOR_INFO_ATTACH_REL.FLOOR_NO,SENSOR.IS_USING_DATA ,FLOOR_INFO_ATTACH_REL.IS_GROUND
      FROM FLOOR_INFO_ATTACH_REL,SENSOR WHERE SENSOR_NAME
      LIKE '%${search_param}%'AND SENSOR.FLOOR_ID = FLOOR_INFO_ATTACH_REL.FLOOR_ID AND SENSOR.SENSOR_DV = 'OUT'
      LIMIT ${limit},10`
      , {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })
  }

  this.createSensorEvent = (req, res) => {
    
    const sensor_id = req.params.sensor_id
    const resLen = req.body.length
    let resCnt = 0

    for (var i = 0; i < req.body.length; i++) {
      if (!req.body[i].SENSOR_EVENT_ID) {
        res.status(400).send({
          message: 'Must include \'SENSOR_EVENT_ID\''
        })
        return
      }

      const sensorEvent = req.body[i]
      db.SENSOR_EVENT_REL.create(sensorEvent)
        .then((data) => {

          resCnt = resCnt + 1
          if (resLen === resCnt) {
            res.status(201).send({
              message: `SENSOR with id=${sensor_id} is updated successfully`
            })
          }

        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'ERROR : Cannot create sensor_event in SENSOR_EVENT_REL'
          })
        })
    }
  }

  this.createOneSensor = (req, res) => {
    if (!req.body.SENSOR_NAME) {
      res.status(400).send({
        message: 'Must include \'SENSOR_EVENT_ID\''
      })
      return
    }

    const sensorData = req.body
    db.SENSOR.create(sensorData)
      .then((data) => {
        res.status(201).send({
          SENSOR_ID: data.SENSOR_ID,
          message: `SENSOR is created successfully`
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot create sensor in SENSOR'
        })
      })
  }

  this.deleteOneSensor = (req, res) => {
    const sensor_id = parseInt(req.params.sensor_id, 10)
    db.SENSOR.destroy({
      where: { SENSOR_ID: sensor_id }
    })
      .then((num) => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `SENSOR_ with id=${sensor_id} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `Cannot Delete SENSOR with id=${sensor_id}. Not found`
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Delete SENSOR with id=' + sensor_id
        })
      })
  }

  /**
   * 지도 영역안의 센서 조회  - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG)
   * 실외도 관리에서 지도 화면 내의 센서를 조회한다.
   * @date : 2021-08-13
   * @author : 이화용
   * @version : 1.0, 센서 조회 추가
   * @param { req }
   * @param { res }
   * @return {검색 결과}
   * @exception  error message 처리
   **/
  this.getSensorBoundsInfo = async (req, res) => {
    await db.sequelize.query(
      `SELECT
         SEN.SENSOR_ID,
         SEN.SENSOR_NAME,
         SEN.SENSOR_DESC,
         SEN.FLOOR_ID,
         SEN.BOUND,
         SEN.SENSOR_LOC_X,
         SEN.SENSOR_LOC_Y,
         SEN.IS_ACTIVATE,
         REL.SENSOR_EVENT_ID,
         E.SENSOR_EVENT_NAME,
         LIST.EVENT_LIST_NAME,
         LIST.EVENT_LIST_DESC,
         LIST.EVENT_LIST_ID,
         REL.SENSOR_EVENT_REL_ID,
         LIST.DV_CD,
         LIST.ID
        FROM SENSOR SEN
                LEFT OUTER JOIN SENSOR_EVENT_REL REL on SEN.SENSOR_ID = REL.SENSOR_ID
                 LEFT OUTER JOIN SENSOR_EVENT_LIST LIST on LIST.EVENT_LIST_ID = REL.EVENT_LIST_ID
                 LEFT OUTER JOIN SENSOR_EVENT E on E.SENSOR_EVENT_ID = REL.SENSOR_EVENT_ID
        WHERE SEN.FLOOR_ID = 42168135
        AND   SEN.SENSOR_LOC_Y BETWEEN ${req.params.sw_lat} AND ${req.params.ne_lat}
        AND   SEN.SENSOR_LOC_X BETWEEN ${req.params.sw_lng} AND ${req.params.ne_lng}
        ORDER BY SENSOR_ID`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    )
      .then((data) => {
        let sensorList = []
        let chgData
        let arr
        let aEvent
        data.forEach((element) => {
          arr = []
          arr.push(element.SENSOR_EVENT_ID)
          chgData = {
            SENSOR_ID: element.SENSOR_ID,
            SENSOR_NAME: element.SENSOR_NAME,
            SENSOR_DESC: element.SENSOR_DESC,
            FLOOR_ID: element.FLOOR_ID,
            BOUND: element.BOUND,
            SENSOR_LOC_X: element.SENSOR_LOC_X,
            SENSOR_LOC_Y: element.SENSOR_LOC_Y,
            SENSOR_TARGET_DV_CD: element.DV_CD,
            SENSOR_TARGET_ID: element.ID,
            IS_ACTIVATE: element.IS_ACTIVATE,
            DRAGGABLE: false,
            VISIBLE: false,
            CONDITION: 'NORMAL',
            POSITION: { lat: element.SENSOR_LOC_X, lng: element.SENSOR_LOC_Y },
            SENSOR_EVENT_LIST: []
          }
          aEvent = {
            EVENT_LIST_ID: element.EVENT_LIST_ID,
            SENSOR_EVENT_ID: element.SENSOR_EVENT_ID,
            SENSOR_EVENT_NAME: element.SENSOR_EVENT_NAME,
            EVENT_LIST_NAME: element.EVENT_LIST_NAME,
            EVENT_LIST_DESC: element.EVENT_LIST_DESC,
            SENSOR_EVENT_REL_ID: element.SENSOR_EVENT_REL_ID
          }
          chgData.SENSOR_EVENT_LIST.push(aEvent)
          sensorList.push(chgData)
        })

        let uniqueData = []
        sensorList.forEach((element) => {
          if (uniqueData.length === 0) {
            uniqueData.push(element)
          } else {
            let dup = false
            for (let i = 0; i < uniqueData.length; i++) {
              if (uniqueData[i].SENSOR_ID === element.SENSOR_ID) {
                dup = true
                uniqueData[i].SENSOR_EVENT_LIST.push(...element.SENSOR_EVENT_LIST)
              }
            }
            if (!dup) {
              uniqueData.push(element)
            }
          }
        })
        res.status(200).send(uniqueData)
      })
      .catch((err) => {
        console.log('catch err ==>  ', err)
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get sensors in SENSOR'
        })
      })

  }
}

module.exports = new SensorService()
