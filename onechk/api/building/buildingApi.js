import Axios from '../index.js'

class BuildingDataService {
    /* 건물 등록 */
    create(userNo, data) {
        return Axios.post(`/building/${userNo}`, data)
    }

    /* 건물 목록 조회 - 전체 (APP에서 사용) */
    getAllBuilding() {
        return Axios.get('/building')
    }

    /* 건물 목록 조회 - (by user_no) */
    getBuildings(userNo) {
        return Axios.get(`/building/${userNo}`)
    }

    /* 건물 정보 수정 */
    update(buildingId, data) {
        return Axios.put(`/building/${buildingId}`, data)
    }

    /* 건물 삭제 */
    delete(buildingId) {
        return Axios.delete(`/building/${buildingId}`)
    }

    getOneBuilding(buildingId) {
        return Axios.get(`/building/${buildingId}`)
    }


}

export default new BuildingDataService()

/* 사용 방법 */
/* <script>
 *  import StoreDataService from "경로에맞게"
 *
 *  export default {
 *    data() {
 *      return {
 *        stores: [],
 *      }
 *    }
 *    methods: {
 *      storeExample() {
 *        const userId = 2
 *        StoreDataService.getAll(userId)
 *          .then(response => {
 *            this.stores = response.data;
 *          })
 *          .catch(error => {
 *            console.log(error)
 *          })
 *      }
 *    }
 *  }
 */