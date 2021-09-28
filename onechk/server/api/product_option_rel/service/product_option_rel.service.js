/* 사업자 등록정보 조회 */
function ProductOptionRelService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()
  const Op =  db.sequelize.Sequelize.Op
 
  this.RelCreate = (req, res) => {
    const PRT_ID = parseInt(req.params.prtId, 10)
    const bodys = req.body
    const PRODUCT_OPTION_REL = db.PRODUCT_OPTION_REL
    let targetInserts = []
    bodys.forEach(optInfos => {
      optInfos.forEach(option => {
      let PRT_OPT_ID = option.PRT_OPT_ID
        targetInserts.push(
          {PRT_ID,
           PRT_OPT_ID}
          )
      })
    });
    PRODUCT_OPTION_REL.bulkCreate(targetInserts, {validate: true})
    .then(insert_data => {
      res.status(204).send({
        messge: `SUCCESS : PRODUCT_OPTION_REL Inserts`
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: `Internal Server Error In product_option_rel RelCreate Service`
      })
    })
    
  }

  this.RelDelete = (req, res) => {
    const PRT_ID = parseInt(req.params.prtId, 10)
    const bodys = req.body
    const PRODUCT_OPTION_REL = db.PRODUCT_OPTION_REL
    let targetIds = [];
   
    bodys.forEach(optInfos => {
      optInfos.forEach(option => {
        console.log(option.PRT_OPT_ID);
        targetIds.push(option.PRT_OPT_ID)
      })
    });

    let condition = {where : {
      PRT_ID,
      PRT_OPT_ID : {[Op.in] : targetIds}
    }}
    console.log(condition);
    PRODUCT_OPTION_REL.destroy(condition)
    .then(delete_data => {
      console.log('delet_data');
      console.log(delete_data);
      res.status(204).send({
        messge: `SUCCESS : PRODUCT_OPTION_REL destorys`
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: `Internal Server Error In product_option_rel RelDelete Service`
      })
    })
}

}
module.exports = new ProductOptionRelService()