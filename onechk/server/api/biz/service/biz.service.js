const axios = require('@nuxtjs/axios');

/* 사업자 등록정보 조회 */
function BizService() {
    const dbHelper = require('../../../util/dbHelper')
    const db = dbHelper.getConnectionSync()

    this.getBiz = async (req, res) => {
        const biz_num = parseInt(req.params.biz_num)
        const url = `http://apis.data.go.kr/1230000/UsrInfoService/getPrcrmntCorpBasicInfo?inqryDiv=3&ServiceKey=e1aHCey1zA4XBh3R3HKCeDrduxLReX%2Fa2C4dRkr9zl%2BUk%2ByXA0Sd0hvJP0nEOianEvWC%2F8PslLaLZ2VNlimxWQ%3D%3D&type=json&bizno=${biz_num}`
        const biz_data = await axios.get(url)
        res.status(biz_data.status).send(biz_data.data.response)
    }

    this.getDuplicateSearch = (req, res) => {
      const biz_num = req.params.biz_num
      const biz = {
        BIZ_NUM: biz_num
      } 
      db.BIZ_LICENSE.findAll({
        where: biz
      })
      .then(result => {
        var output = {}
        output.datas = result.length
        res.status(200).send(output)
      })
      .catch(err => {
        res.status(500).send({
          message: `ERROR : 중복 조회 중 오류 발생 biz_num : ${biz_num}`
        })
      })
    }

    this.createBiz = (req, res) => {
      const user_no = req.params.user_no
      // console.log(req.body)
      //Todo !req.body.ATTACH_ID 추가, attach_id not nul 설정
      if (!req.body.BIZ_NUM) {
      res.status(400).send({
        message: 'Must include \'BIZ_NUM\', \'ATTACH_ID\''
      })
      console.log('createBiz return')
      return
    }
    const biz = {
      BIZ_NUM: req.body.BIZ_NUM,
      S_LOCATION: req.body.S_LOCATION || null,
      M_LOCATION: req.body.M_LOCATION || null,
      TRADE_NM: req.body.TRADE_NM || null,
      BIZ_TEL: req.body.BIZ_TEL || null,
      ATTACH_ID: req.body.ATTACH_ID||null,
      USER_NO: user_no
    }

    db.BIZ_LICENSE.create(biz)
      .then((data) => {
        // 201 Created : 생성 성공 메시지(message) + 등록한 사업자 정보(store) 응답
        res.status(201).send({
          message: '사업자 등록이 완료되었습니다.',
          biz: data
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot create biz in BIZ_LICENSE'
        })
      })
  }

  this.deleteBiz = (req, res) => {
    const biz_num = parseInt(req.params.biz_num, 10)

    db.BIZ_LICENSE.destroy({
      where: {BIZ_NUM:biz_num}
    })
      .then((num) => {
        if (num == 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `BIZ with id=${biz_num} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `Cannot Delete BIZ with id=${biz_num}. BIZ not found`
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'ERROR: Cannot Delete BIZ with id=' + biz_num
        })
      })
  }

  this.getBizByUserNo = (req, res) => {
    
    const user_no = parseInt(req.params.user_no, 10)
    
    db.BIZ_LICENSE.findAll({
        where: {
          USER_NO: user_no
        }
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ERROR : NOT FOUND BIZ_LICENSE with user_no=${user_no}, store_id=${store_id}`
          })
          return
        }
        res.status(200).send(data)
      })
      .catch((err) => {
        res.status(500).send({
          msessage: err.message || 'ERROR : Cannot Get BIZ_LICENSE By User_no'
        })
      })
  }
}
module.exports = new BizService()