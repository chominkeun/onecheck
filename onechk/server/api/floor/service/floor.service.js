function floorService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()

  this.getFloorList = (req, res) => {
    const store_building_id = req.params.store_building_id
    const dv = req.params.dv
    if ( dv === 'STORE' ) {
      db.FLOOR_INFO_ATTACH_REL.findAll({
      where: { STORE_ID: store_building_id }
    })
      .then((data) => {
        data.sort((a, b) => {
          if (a.IS_GROUND.toLowerCase() < b.IS_GROUND.toLowerCase()) return 1
          if (a.IS_GROUND.toLowerCase() > b.IS_GROUND.toLowerCase()) return -1

          if (a.IS_GROUND === 'Y') {
            if (a.FLOOR_NO < b.FLOOR_NO) return 1
            if (a.FLOOR_NO > b.FLOOR_NO) return -1
          } else {
            if (a.FLOOR_NO > b.FLOOR_NO) return 1
            if (a.FLOOR_NO < b.FLOOR_NO) return -1
          }
          return 0
        })
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get floors in FLOOR_INFO_ATTACH_REL'
        })
      })
    } else if(dv === 'BUILDING'){
      db.FLOOR_INFO_ATTACH_REL.findAll({
      where: { BUILDING_ID: store_building_id }
    })
      .then((data) => {
        data.sort((a, b) => {
          if (a.IS_GROUND.toLowerCase() < b.IS_GROUND.toLowerCase()) return 1
          if (a.IS_GROUND.toLowerCase() > b.IS_GROUND.toLowerCase()) return -1

          if (a.IS_GROUND === 'Y') {
            if (a.FLOOR_NO < b.FLOOR_NO) return 1
            if (a.FLOOR_NO > b.FLOOR_NO) return -1
          } else {
            if (a.FLOOR_NO > b.FLOOR_NO) return 1
            if (a.FLOOR_NO < b.FLOOR_NO) return -1
          }
          return 0
        })
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get floors in FLOOR_INFO_ATTACH_REL'
        })
      })
    }
    
  }

  this.updateFloor = (req, res) => {
    const floor_id = parseInt(req.params.floor_id, 10)
    const attach_id = req.body.id
    const floor_update = {
      ATTACH_ID: attach_id
    }

    db.FLOOR_INFO_ATTACH_REL.update(floor_update, {
      where: { FLOOR_ID: floor_id }
    })

      .then((result) => {
        if (result == 0) {
          res.status(404).send({
            message: `Cannot Update FLOOR with id=${floor_id}. Unchanged Data or BUILDING Not Found`
          })
          return
        }
        res.status(201).send({
          message: `FLOOR with id=${floor_id} is updated successfully`
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: 'ERROR: Cannot Update FLOOR with id=' + floor_id
        })
      })
  }
}

module.exports = new floorService()
