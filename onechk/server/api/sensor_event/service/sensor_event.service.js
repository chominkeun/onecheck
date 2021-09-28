function SensorEventService() {
    const dbHelper = require('../../../util/dbHelper')
    const db = dbHelper.getConnectionSync()

    this.getAllEvent = (req, res) => {
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0
        let condition = { offset: offset, limit: limit }

        db.SENSOR_EVENT.findAll(condition)
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                message: err.message || 'ERROR : Cannot Get sensor_events from SENSOR_EVENT'
            })
    }

    this.getEventOption = (req, res) => {
        const dv_cd = req.params.dv_cd
        const id = parseInt(req.params.id)

        db.sequelize.query(
          `SELECT * FROM SENSOR_EVENT_LIST
          WHERE DV_CD = '${dv_cd}' and ID = ${id}`,
          {
            type: db.sequelize.QueryTypes.SELECT
          }
        )
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'ERROR : Cannot Get eventOption from SENSOR_EVENT_LIST'
                })
            })
    }

  
  this.deleteSensorEvent = (req, res) => {
    const sensor_event_rel_id = parseInt(req.params.sensor_event_rel_id, 10)

    db.SENSOR_EVENT_REL.destroy({
      where: { SENSOR_EVENT_REL_ID: sensor_event_rel_id}
    })
      .then((num) => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `SENSOR_EVENT_REL with id=${sensor_event_rel_id} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `Cannot Delete SENSOR_EVENT_REL with id=${sensor_event_rel_id}. Not found`
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Delete SENSOR_EVENT_REL with id=' + sensor_event_rel_id
        })
      })
  }

  this.updateEventList = (req, res) => {
    const event_list_id = parseInt(req.body.EVENT_LIST_ID, 10)
    const update_event = {
      EVENT_LIST_NAME: req.body.EVENT_LIST_NAME,
      EVENT_LIST_DESC: req.body.EVENT_LIST_DESC
    }
      db.SENSOR_EVENT_LIST.update(update_event, {
      where: { EVENT_LIST_ID: event_list_id }
    })
    .then((result) => {
      res.status(201).send({
        message: `SENSOR_EVENT_LIST with id=${event_list_id} is updated successfully`
        })
    })
    .catch((err) => {
      res.status(201).send({
        result: false,
        code: 404,
        message: 'ERROR: Cannot Update SENSOR_EVENT_LIST with id=' + event_list_id
        })
      })
  }

  this.deleteEventList = (req, res) => {
    const event_list_id = parseInt(req.params.event_list_id, 10)

    db.SENSOR_EVENT_LIST.destroy({
      where: { EVENT_LIST_ID: event_list_id}
    })
      .then((num) => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `SENSOR_EVENT_LIST with id=${event_list_id} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `Cannot Delete SENSOR_EVENT_LIST with id=${event_list_id}. Not found`
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Delete SENSOR_EVENT_LIST with id=' + event_list_id
        })
      })
  }

  this.createEvent = (req, res) => {
    const eventData = req.body
    db.SENSOR_EVENT_LIST.create(eventData)
      .then((data) => {
        res.status(201).send({
          SENSOR_ID: data.SENSOR_ID,
          message: `SENSOR_EVENT_LIST is created successfully`
        })
    })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot create event in SENSOR_EVENT_LIST'
        })
      })
  }
}

module.exports = new SensorEventService()