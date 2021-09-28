function UserService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()
  const Op =  db.sequelize.Sequelize.Op

  /* 유저 조회 - 모두 */
  this.getUsers = (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0
    let condition = { offset: offset, limit: limit }

    db.USER.findAll(condition)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get users in USER'
        })
      })
  }


  /* 유저 조회 - 1명 (with user_id) */
  this.getUser = (req, res) => {
    const user_id = req.params.user_id
    const user = {
      USER_ID: user_id
    }
    db.USER.findOne({
      attributes: [
        'USER_NO',
        'USER_ID',
        'PAWD',
        'NAME',
        'E_MAIL',
        'PHONE_NUM',
        'IS_AUTH',
        'USER_CLCD',
        'ONE_POINT',
        'IS_BIZ',
        'IS_BLOCK',
        'IS_USING_DATA'
      ],
      where: user
    })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: 'ERROR : NOT FOUND USER with id=' + user_id
          })
        }
        res.status(200).send(data)
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: 'ERROR : Get USER with id=' + user_id
        })
      })
  }

  this.getUserStore = (req, res) => {
    const user_id = String(req.params.user_id)
    db.sequelize
      .query(
        `SELECT USER.USER_NO, USER.USER_ID, USER.PAWD, USER.NAME, USER.E_MAIL, USER.PHONE_NUM, STORE_MANAGER.STORE_ID, BUILDING.BUILDING_ID,USER.SOCIAL
        FROM USER
          LEFT OUTER JOIN STORE_MANAGER
            ON USER.USER_NO = STORE_MANAGER.USER_NO
          LEFT OUTER JOIN BUILDING
            ON USER.USER_NO = BUILDING.USER_NO
        WHERE USER.USER_ID = :user`,
        {
          replacements: { user: user_id },
          type: db.sequelize.QueryTypes.SELECT
        }
      )
      .then(data => {
        if (data.length === 1) {
          res.status(200).send(data)
        } else {
          res.status(222).send({
            message: 'ERROR : Cannot find USER with id=' + user_id
          })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(222).send({
          message: 'ERROR :  USER with id=' + user_id
        })
      })
  }

  /* 사용자 테이블 - ID, email, phone 조회 */
  this.getDuplicateSearch = (req, res) => {
    const name = req.params.name
    const value = req.params.value

    let condition
    if (name === 'USER_ID') {
      condition = {
        where: {
          USER_ID: value,
        }
      }
    } else if (name === 'E_MAIL') {
      condition = {
        where: {
          E_MAIL: value,
        }
      }
    } else if (name === 'PHONE_NUM') {
      condition = {
        where: {
          PHONE_NUM: value,
        }
      }
    } else {
      // 바로 끝내도록 변경
      condition = { 1: 1 }
    }

    let result
    let code
    let message

    db.USER.count(condition)
      .then(data => {
        if ( data === 0 ){
          result = true
          code = 200
          message = `SUCCESS : getDuplicateSearch with ${name} VALUE : ${value}`
        } else {
          result = false
          code = 200
          message = `ERROR : getDuplicateSearch with COUNT : ${data}`
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
          message: `ERROR : 중복 조회 중 오류 발생 NAME : ${name} VALUE : ${value}`
        })
      })
  }

  /* 사용자 테이블 NO로 검색 - ID, email, phone 조회 */
  this.getDuplicateSearchUserNo = (req, res) => {
    const name = req.params.name
    const value = req.params.value
    const userNo = req.params.userNo

    let condition

    if (name === 'USER_ID') {
      condition = {
        where: {
          USER_NO: { [Op.ne]: userNo },
          USER_ID: value,
        }
      }
    } else if (name === 'E_MAIL') {
      condition = {
        where: {
          USER_NO: { [Op.ne]: userNo },
          E_MAIL: value,
        }
      }
    } else if (name === 'PHONE_NUM') {
      condition = {
        where: {
          USER_NO: { [Op.ne]: userNo },
          PHONE_NUM: value,
        }
      }
    } else {
      // 바로 끝내도록 변경
      condition = {  where: {1: 1} }
    }

    let result
    let code
    let message

    db.USER.count(condition)
      .then(data => {
        if ( data === 0 ){
          result = true
          code = 200
          message = `SUCCESS : getDuplicateSearchUserNo with ${name} : ${value}`
        } else {
          result = false
          code = 200
          message = `ERROR : getDuplicateSearchUserNo with COUNT : ${data}`
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
          message: `ERROR : 중복 조회 중 오류 발생 NAME : ${name} VALUE : ${value}`
        })
      })
  }

  this.createUserInfo = async (req, res) => {
    const user = req.body

    // console.log("attachId ==> ",attachId)
    // console.log("user ==> ",user)
    if (user.SOCIAL === 'KAKAO'){
      const kakaoId = await db.USER.prototype.getKakaoId()
      const headId = 'KAKAO_'
      user.USER_ID = headId+kakaoId
      user.PAWD = headId+kakaoId
      //카카오 계정정보에 user phonenum을 받아올 수 없기 때문에 에러가 발생(unique때문, 카카오 인가 필요), 임시로 empty값을 넣었다.
      if(!user.PHONE_NUM){
        user.PHONE_NUM = 'empty'+kakaoId
      }
    }

    console.log("user ==> ",user)
    // Validation Check - id, pawd, name, e_mail, phone_num 모두 입력 받았는지 확인
    if (
      !user.USER_ID ||
      // !user.PAWD ||
      // !user.NAME ||
      !user.E_MAIL //||
      // !user.PHONE_NUM
    ) {
      res.status(400).send({
        message:
          "ERROR : Must include 'user_id', 'pawd', 'name', 'e_mail', 'phone_num'"
      })
      return
    }
    db.USER.create(user)
      .then(data => {
        // 201 Created : 생성 성공 + 등록한 유저 정보(data) 응답
        res.status(201).send(data)
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: err.message || 'ERROR : Error occured while creating USER'
        })
      })
  }

  this.getUserByEmail = (req, res) => {
    const user_email = req.params.user_email

    db.sequelize
      .query(
        `SELECT USER.USER_NO, USER.USER_ID, USER.PAWD, USER.NAME, USER.E_MAIL, USER.PHONE_NUM, STORE_MANAGER.STORE_ID, BUILDING.BUILDING_ID, USER.SOCIAL
        FROM USER
          LEFT OUTER JOIN STORE_MANAGER
            ON USER.USER_NO = STORE_MANAGER.USER_NO
          LEFT OUTER JOIN BUILDING
            ON USER.USER_NO = BUILDING.USER_NO
        WHERE USER.E_MAIL = :email`,
        {
          replacements: { email: user_email },
          type: db.sequelize.QueryTypes.SELECT
        }
      )
      .then(data => {
        if (data.length === 1) {
          res.status(200).send(data)
        } else {
          res.status(222).send({
            message: 'ERROR : Cannot find USER with email=' + user_email
          })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(222).send({
          message: 'ERROR :  USER with email=' + user_email
        })
      })
  }


  /* 유저 업데이트 - 회원정보수정 */
  this.updateUserInfo = (req, res) => {
    console.log('updateUserInfo  user_no ==> ', req.params.user_no)
    console.log('updateUserInfo  req.body ==> ', req.body)
    const user_no = parseInt(req.params.user_no)
    const user = req.body
    // Validation Check - pawd, name, e_mail, phone_num 모두 입력 받았는지 확인
    if (
      !user.PAWD ||
      !user.NAME ||
      !user.E_MAIL ||
      !user.PHONE_NUM
    ) {
      res.status(400).send({
        message: "ERROR : Must include 'pawd', 'name', 'e_mail', 'phone_num'"
      })
      return
    }

    // DB에 맞게 column이름 변경(소문자 -> 대문자)
    const user_update = {
      PAWD: user.PAWD,
      NAME: user.NAME,
      E_MAIL: user.E_MAIL,
      PHONE_NUM: user.PHONE_NUM
    }

    db.USER.update(user_update, {
      where: { USER_NO: user_no }
    })
      .then(num => {
        res.status(201).send({
          message: `SUCCESS : USER with id=${user_no} is ${num} updated successfully`
        })
        // if (num === 1) {
        //   res.status(201).send({
        //     message: `SUCCESS : USER with id=${user_no} is updated successfully`
        //   })
        // } else {
        //   res.status(224).send({
        //     message: `ERROR : Cannot Update USER with id=${user_no}. USER not found or not modify`
        //   })
        // }
      })
      .catch(err => {
        console.log(err);
        res.status(222).send({
          message: 'ERROR : Cannot Update USER with id=' + user_no
        })
      })
  }

  /* 유저 삭제 - 회원탈퇴 */
  this.deleteUserInfo = (req, res) => {
    const user_no = req.params.user_no

    db.USER.destroy({
      where: { USER_NO: user_no }
    })
      .then(num => {
        if (num === 1) {
          res.status(204).send({
            // 204 No Content : 삭제 성공 -> No Content
            message: `SUCCESS : USER with id=${user_no} is deleted successfully!`
          })
        } else {
          res.status(404).send({
            message: `ERROR : Cannot Delete USER with id=${user_no}. USER not found`
          })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: 'ERROR : Cannot Delete USER with id=' + user_no
        })
      })
  }

  /* 유저 조회 - 1명 (with user_id) */
  this.getUserStore2 = (req, res) => {
    const user_id = String(req.params.user_id)

    db.USER.findAll({
      include: [
        {
          model: db.STORE_MANAGER,
          attributes: ['STORE_ID']
        }
      ],
      attributes: [
        'USER_NO', 'USER_ID', 'PAWD', 'NAME', 'E_MAIL', 'PHONE_NUM'
      ],
      where: { USER_ID: user_id }
    })
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'ERROR : Cannot Get users in USER'
        })
      })
  }


}

module.exports = new UserService()
