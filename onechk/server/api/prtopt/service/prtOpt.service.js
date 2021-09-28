const { CognitoAccessToken } = require('amazon-cognito-identity-js')
const { sequelize } = require('../../../../models')
const Op = sequelize.Sequelize.Op

function PrtOptService() {
  const dbHelper = require('../../../util/dbHelper')
  const db = dbHelper.getConnectionSync()

  /******* 1. 일괄 처리 - 상품 옵션 *******/
  /* 일괄 처리 - 모두 (생성, 수정, 삭제) */
  this.applyAll = async (req, res) => {
    //const groupData = req.body.groupList // Grouped Data
    const groupData = req.body
    const ungroupData = ungroup(groupData) // 데이터 변환 : Ungrouping (Front -> DB)

    // 작업 별 필수 데이터 목록
    /* 1. Create - G_NAME, O_NAME
     * 2. Update - PRT_OPT_ID,
     *             (G_NAME, O_NAME, IS_DEFAULT, IS_MUTI_CUR : 필수는 아니지만, 안 넣어주면 해당 속성들은 default 값으로 설정됨)
     * 3. Delete - PRT_OPT_ID
     */
    
    // 수행할 작업(C/U/D) 별로 데이터 분류
    let create_data = []
    let update_data = []
    let delete_id = []
    ungroupData.forEach(item => {
      if (item.status === 'D') {
        delete_id.push(item.option.PRT_OPT_ID)
      }
      if (item.status === 'U') {
        update_data.push(item.option)
      }
      if (item.status === 'C') {
        create_data.push(item.option)
      }
    })

    // 트랜잭션(Delete, Update, Create) 처리하기
    const t = await sequelize.transaction()
    try {
      let create_result = 0
      let update_result = 0
      let delete_result = 0
      // create,update,delete_result 값을 0으로 초기화한 이유 : 트랜잭션이 실패했을 때
      if (delete_id) {
        delete_result = await bulkDelete(delete_id, { transaction: t })
      }
      if (update_data) {
        update_result = await bulkUpdate(update_data, { transaction: t })
      }
      if (create_data) {
        // create_data 내 내 가상으로 채번한 PRT_OPT_ID 제거
        for(const data of create_data){
          delete data.PRT_OPT_ID;
        }
        create_result = await bulkCreate(create_data, { transaction: t })
      }

      await t.commit()

      const total_changed =
        create_result.length + update_result.length + delete_result

      res.status(200).send({
        message: '저장 완료',
        changed: {
          total: total_changed,
          create: create_result.length + '개 생성',
          update: update_result.length + '개 수정',
          delete: delete_result + '개 삭제'
        }
      })
    } catch (error) {
      await t.rollback()

      res.status(500).send({
        message: error || '저장 실패'
      })
    }
  }

  /* 1-1. 일괄 처리 - 생성 */
  async function bulkCreate(create_data) {
    // [참고] 필수 데이터 - G_NAME, O_NAME
    return await db.PRT_OPT.bulkCreate(create_data)
      .then(data => {
        return data
      })
      .catch(err => {
        return err
      })
  }

  /* 1-2. 일괄 처리 - 수정 */
  async function bulkUpdate(update_data) {
    // [참고] 필수 데이터 - PRT_OPT_ID (PK)
    //        => bulkCreate : 데이터의 PK가 DB에 존재하면 수정, 아니면 생성
    // [주의] 기존 데이터(존재한다면 필수) - G_NAME, O_NAME, IS_DEFAULT, IS_MUTI_CUR
    //        왜? => 넘겨주지 않으면 데이터가 default값(null/null/'N'/'N')으로 변경되어, 기존 데이터를 잃을 수 있음

    return await db.PRT_OPT.bulkCreate(update_data, {
      updateOnDuplicate: ['G_NAME', 'O_NAME', 'IS_DEFAULT', 'IS_MUTI_CUR']
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return err
      })
  }

  /* 1-3. 일괄 처리 - 삭제 */
  async function bulkDelete(delete_id) {
    // [참고] 필수 데이터 - PRT_OPT_ID

    return await db.PRT_OPT.destroy({
      where: { PRT_OPT_ID: delete_id }
    })
      .then(result => {
        // result: 삭제된 데이터 수
        return result
      })
      .catch(err => {
        return err
      })
  }

  /******* 2. DB 데이터 조회 - 상품 옵션 *******/
  /* DB 데이터 조회 - 상품 옵션 : 가게별 조회(by 가게ID) */
  this.getOpts = async (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)
    try {
      const optionList = await getOptionList(store_id)

      let groupList = []
      if (optionList.length) {
        // 데이터 형태 변환 : DB -> Front 사용
        groupList = await group(optionList, true)
      } 
      
      let result = true;
      let code = 200;
      let message = '';
      if(!groupList.length){
        result = false
        code = 400
        message = 'ERROR : NOT FOUND PRT_OPT with STORE_ID : ' + store_id
      } else {
        message = 'SUCCESS : getOpts with STORE_ID'
      }
     
      res.status(code).send({
        groupList,
        result,
        message
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || 'ERROR : CANNOT FIND Product Option in PRT_OPT'
      })
    }
  }

  /* DB 데이터 조회 - 상품 옵션 : 상품별 조회(by 상품 ID) */
  this.getPrtOpts = async (req, res) => {
    const prtId = parseInt(req.params.prtId, 10)
    try {
      const optionList = await getPrtOptionList(prtId)
      let groupList = []
      if (optionList.length) {
        groupList = await group(optionList, false) // 데이터 형태 변환 : DB -> Front 사용
      }
      let result
      let code
      let message
      if (groupList.length == 0) {
        result = false
        code = 400
        message = `ERROR : NOT FOUND PRT_OPT with PRT_ID: ${prtId}`
      } else {
        result = true
        code = 200
        message = `SUCCESS : getPrtOpts with PRT_ID: ${prtId}`
      }
      res.status(200).send({
        result,
        code,
        message,
        groupList
      })
    } catch (error) {
      console.log(error.message);
      res.status(200).send({
        result: false,
        code: 500,
        message: error.message || 'ERROR : CANNOT FIND Product Option in PRT_OPT'
      })
    }
  }

  /* DB 데이터 카운트 조회 - (by 매장 ID) */
  this.getOptCount = (req, res) => {
    const store_id = parseInt(req.params.store_id, 10)
    const condition = {
      where: { STORE_ID: store_id }
    }
    db.PRT_OPT.count(condition)
      .then(count => {
        res.status(200).send({ count })
      })
      .catch(err => {
        res.status(500).send({
          message: err.message
        })
      })
  }

  /* 2-1. DB 데이터 조회 - 상품 옵션 전체 */
  async function getOptionList(store_id) {
    return await db.PRT_OPT.findAll({
      where: { STORE_ID: store_id },
      order: ['G_NAME'] // ORDER_BY G_NAME 하는 이유 : countByGName()의 결과와 매칭하기 위해
    })
      .then(data => {
        return data
      })
      .catch(err => {
        console.log(err.message)
        return err
      })
  }

  function getPrtOptionList(prtId) {
    const POR = db.PRODUCT_OPTION_REL
    let POR_condition = { where: { PRT_ID: prtId } }

    // 1. 상품 ID로 PRODUCT_OPTION_REL
    let rsList = POR.findAll(POR_condition)
      .then(async PORLIST => {
        const PO = db.PRT_OPT
        let optIds = []

        // 2. 상품ID로 조회 된 옵션 ID들 저장
        PORLIST.forEach(item => {
          optIds.push(item.PRT_OPT_ID)
        })
        // 3. PRODUCT_OPTION_REL 연결 된 옵션 ID들로 옵션 정보 GET
        let PO_condition = {
          where: {
            PRT_OPT_ID: { [Op.in]: optIds }
          }
        }
        let POLIST = await PO.findAll(PO_condition)
          .then(rsData => {
            return rsData
          })

        return POLIST
      })

    return rsList
  }

  /* 2-2. DB 데이터 조회 - 옵션그룹 별 선택옵션 개수 카운팅(for Grouping) : COUNT(O_NAME) GROUP BY G_NAME */
  async function countByGName(store_id) {
    return await db.PRT_OPT.findAll({
      where: { STORE_ID: store_id },
      attributes: [
        'G_NAME', [sequelize.fn('count', sequelize.col('O_NAME')), 'num'],
        'STORE_ID',
        'IS_MUTI_CUR'
      ],
      group: ['G_NAME'],
      order: ['G_NAME']
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return err
      })
  }

  // Q. 아래의 "3. 데이터 형태 변환 과정"이 필요한 이유 ?
  // A. 상품 옵션 데이터에 대해, DB에서 저장하는 구조와 프론트 단에서 사용하는 구조가 다름 -> 사용 편의성을 위해 서버 단에서 재구조 후 응답

  /******* 3. 데이터 형태 변환 *******/

  /* 3-1. 데이터 형태 변환 - Grouping (DB -> Front) */
  async function group(data, all) {
    const optionList = data // 파라미터로 넘겨받은 데이터 (DB에서 조회-getAll한 데이터)
    const store_id = optionList[0].STORE_ID
    const groupList = [] // 변환 완료한 데이터 저장
    const groupCount = await countByGName(store_id) // Grouping을 위한 데이터
    let start = 0,
      end = 0 // 전체 옵션목록(optionList)에서 G_NAME별 O_NAME의 시작, 끝 인덱스
    groupCount.forEach(group => {
      //all
      //true : (옵션에 대한 전체 검색으로 인한 생략)
      //false : (상품에 해당되는 옵션들만 존재 할 수 있어 체크 후 스킵)
      if (!all) {
        let findIndex = optionList.findIndex(item => {
          return item.G_NAME === group.G_NAME
        })

        if (findIndex === -1) {
          return
        }
      }
      const O_NAMES = []
      let DEFAULT

       // G_NAME별로 O_NAME 분류하기
      const groupFilterOpts = optionList.filter((option) => {
        return group.G_NAME === option.G_NAME
      })
      
      for(const optInfo of groupFilterOpts){
          const option = {
          PRT_OPT_ID: optInfo.PRT_OPT_ID,
          O_NAME: optInfo.O_NAME
        }

        // IS_DEFAULT: 'Y/N' 속성 => DEFAULT: 옵션ID(PRT_OPT_ID)
        if (optInfo.IS_DEFAULT === 'Y') {
          DEFAULT = optInfo.PRT_OPT_ID
        }
        O_NAMES.push(option)
      }
     
      // end += group.dataValues.num
      // for (let i = start; i < end; i++) {
      //   const option = {
      //     PRT_OPT_ID: optionList[i].PRT_OPT_ID,
      //     O_NAME: optionList[i].O_NAME
      //   }

      //   // IS_DEFAULT: 'Y/N' 속성 => DEFAULT: 옵션ID(PRT_OPT_ID)
      //   if (optionList[i].IS_DEFAULT === 'Y') {
      //     DEFAULT = optionList[i].PRT_OPT_ID
      //   }
      //   O_NAMES.push(option)
      // }
      // start = end

      // 결과 리스트에 push하기 전, 필요한 데이터 형식 맞추기
      const optionGroup = {
        G_NAME: group.G_NAME,
        O_NAMES,
        STORE_ID: group.STORE_ID,
        DEFAULT,
        IS_MUTI_CUR: group.IS_MUTI_CUR
      }
      groupList.push(optionGroup)
    })

    return groupList
  }

  /* 3-2. 데이터 형태 변환 - Ungrouping (Front -> DB) */
  function ungroup(data) {
    const groupList = data
    const optionList = []
    groupList.forEach(group => {
      const options = group.O_NAMES
      const defaultId = parseInt(group.DEFAULT) || 0
      options.forEach(option => {
        const optionUngroup = {
          status: option.status,
          option: {
            PRT_OPT_ID: option.PRT_OPT_ID,
            G_NAME: group.G_NAME,
            O_NAME: option.O_NAME,
            STORE_ID: group.STORE_ID,
            IS_MUTI_CUR: group.IS_MUTI_CUR,
            IS_DEFAULT: defaultId === option.PRT_OPT_ID ? 'Y' : 'N'
          }
        }

        optionList.push(optionUngroup)
      })
    })
    return optionList
  }

  /******* 테스트용 (지워도 됩니당) *******/
  // /* 개별 기능(생성, 수정, 삭제) - 테스트 완료 */
  // /* 1. 일괄 생성 - 상품 옵션 - 개별 테스트 완료 */
  // this.bulkCreate = (req, res) => {
  //     const datas = req.body.datas
  //     let create_data = []

  //     datas.forEach(item => {
  //         if (item.status === 'C') {
  //             create_data.push(item.option)
  //         }
  //     })

  //     db.PRT_OPT.bulkCreate(create_data)
  //         .then(data => {
  //             res.status(201).send({
  //                 message: 'bulkCreate 성공',
  //                 data
  //             })
  //         })
  //         .catch(err => {
  //             res.status(500).send({
  //                 message: err || 'bulkCreate 실패'
  //             })
  //         })
  // }

  // /* 2. 일괄 수정 - 상품 옵션 - 개별 테스트 완료 */
  // this.bulkUpdate = (req, res) => {
  //     const datas = req.body.datas
  //     let update_data = []

  //     datas.forEach(item => {
  //         if (item.status === 'U') {
  //             update_data.push(item.option)
  //         }
  //     })

  //     db.PRT_OPT.bulkCreate(update_data, {
  //             updateOnDuplicate: ['G_NAME', 'O_NAME']
  //         })
  //         .then(result => {
  //             res.status(201).send({
  //                 message: 'bulkUpdate 성공',
  //                 result
  //             })
  //         })
  //         .catch(err => {
  //             res.status(500).send({
  //                 message: err || 'bulkUpdate 실패'
  //             })
  //         })
  // }

  // /* 3. 일괄 삭제 - 상품 옵션 - 개별 테스트 완료 */
  // this.bulkDelete = (req, res) => {
  //     const datas = req.body.datas
  //     let delete_id = []

  //     datas.forEach(item => {
  //         if (item.status === 'D') {
  //             delete_id.push(item.option.PRT_OPT_ID)
  //         }
  //     })

  //     return db.PRT_OPT.destroy({
  //             where: { PRT_OPT_ID: delete_id }
  //         })
  //         .then(result => {
  //             res.status(204).send({
  //                 message: 'bulkDelete 성공',
  //                 result
  //             })
  //         })
  //         .catch(err => {
  //             res.status(500).send({
  //                 message: err || 'bulkDelete 실패'
  //             })
  //         })
  // }
}

module.exports = new PrtOptService()
