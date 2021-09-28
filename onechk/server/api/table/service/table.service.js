function TableService() {
    const dbHelper = require('../../../util/dbHelper')
    const db = dbHelper.getConnectionSync()

    /* TABLE 등록 */
    this.createTable = (req, res) => {
        const store_id = req.params.store_id

        res.status(222).send({
            params :  store_id
            , message : 'createTable'
        })
    }
    /* TABLE 정보 수정 */
    this.updateTable = (req, res) => {
        const t_seat_id = req.params.t_seat_id 

        res.status(222).send({
            params :  t_seat_id
            , message : 'updateTable'            
        })        
    }  
    /* TABLE 정보 삭제 */
    this.deleteTable = (req, res) => {
        const t_seat_id = req.params.t_seat_id

        res.status(222).send({
            params :  t_seat_id
            , message : 'deleteTable'            
        })         
    }
    /* TABLE 정보 조회 */
    this.getTables = (req, res) => {
        const store_id = req.params.store_id

        res.status(222).send({
            params :  store_id 
            , message : 'getTables'
        })         
    }                  

}

module.exports = new TableService()