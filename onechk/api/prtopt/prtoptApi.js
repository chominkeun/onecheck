import Axios from '../index.js'

class PrtOptDataService {
    /******* 일괄 처리 - 상품 옵션(PRT_OPT) *******/

    /* 일괄 처리 - 생성, 수정, 삭제 */
    applyAll(data) {
        return Axios.post('/prtopt', data)
    }

    /* DB 데이터 조회 - 상품 옵션 : 가게별 조회(by 가게ID) */
    getAll(store_id) {
        return Axios.get(`/prtopt/${store_id}`)
    }

     /* DB 데이터 조회 - 상품 옵션 : 상품별 조회(by 상품ID) */
    getOne(prtId){
        return Axios.get(`/prtopt/inprt/${prtId}`)
    }
}

export default new PrtOptDataService()

// /* 참고!! 요청 body 형식 */
// 1. {"groupList":[]} 배열 안에 각 옵션 데이터들 넣기
// 2. 배열 원소들은 "G_NAME", "O_NAMES"(배열), "STORE_ID", "DEFAULT"(배열), "IS_MUTI_CUR" 키를 가짐

//  - G_NAME : 옵션 그룹명
//  - O_NAMES: G_NAME에 대한 선택 옵션 리스트 {"status", "O_NAME", "PRT_OPT_ID"(U/D에서만 필요)}
//                                          - status : L/C/D/U 中 1개, Create/Delete/Update (L: Loaded, 기존 데이터를 읽어오기만 한 상태)
//  - STORE_ID
//  - DEFAULT: IS_DEFAULT==='Y'인 옵션의 PRT_OPT_ID (DEFAULT는 최대 1개)
//  - IS_MUTI_CUR: 'N'(default) => 옵션 그룹(G_NAME) 내 하나의 옵션(O_NAME)만 선택 가능 / 'Y' => G_NAME 내의 O_NAME 다중선택 가능

// /* 예시 1. 추가 (groupList[i].O_NAMES[j].status = 'C') */
// {
//     "groupList": [{
//             "G_NAME": "새옵션",
//             "O_NAMES": [{
//                     "status": "C",
//                     "O_NAME": "선택1"
//                 },
//                 {
//                     "status": "C",
//                     "O_NAME": "선택2"
//                 }
//             ],
//             "STORE_ID": 2,
//             "DEFAULT": "선택1",
//             "IS_MUTI_CUR": "N"
//         }
//     ]
// }

// /* 예시 2. 수정 (groupList[i].O_NAMES[j].status = 'U') */
// {
//     "groupList": [{
//             "G_NAME": "수정해보셈",
//             "O_NAMES": [{
//                     "status": "U",
//                     "PRT_OPT_ID": 109,
//                     "O_NAME": "수정했지롱1"
//                 },
//                 {
//                     "status": "U",
//                     "PRT_OPT_ID": 110,
//                     "O_NAME": "수정했지롱2"
//                 }
//             ],
//             "STORE_ID": 2,
//             "DEFAULT": "수정했지롱1",
//             "IS_MUTI_CUR": "N"
//         }
//     ]
// }

// /* 예시 3. 삭제 (groupList[i].O_NAMES[j].status = 'D') */
// 다른 요소 넣어도 OK (삭제에서 사용하는 값은 O_NAMES.status, O_NAMES.PRT_OPT_ID 뿐)
// {
//     "groupList": [{
//             "G_NAME": "추가",
//             "O_NAMES": [{
//                     "status": "D",
//                     "PRT_OPT_ID": 117
//                 },
//                 {
//                     "status": "D",
//                     "PRT_OPT_ID": 118
//                 }
//             ]
//         }
//     ]
// }

// /* 예시 4. 조회 (by store_id) */
// 요청 body 없음