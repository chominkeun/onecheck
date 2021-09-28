import Axios from '../index.js'

class TableDataService {

    /* 테이블 등록 */
    create(storeId, data) {
        return Axios.post(`/table/${storeId}`, data)
    }
    /* 테이블 정보 수정 */
    update(tSeatId, data) {
        return Axios.put(`/table/${tSeatId}`, data)
    }
    /* 테이블 삭제 */
    delete(tSeatId) {
        return Axios.delete(`/table/${tSeatId}`)
    }    
    /* 테이블 목록 조회 - 가게 내 전체 테이블 */
    getTables(storeId) {
        return Axios.get(`/table/${storeId}`)
    }    
}

export default new TableDataService()
