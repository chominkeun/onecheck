import Axios from '../index.js'

class OrderDataService {
    /**************** STORE_ORDER CRUD ****************/
    /* 매장 내 주문목록 조회 (userId) */
    getAll(store_id) {
        return Axios.get(`/order/getOrderList/${store_id}`)
    }

    getAllCount(store_id){
        
    }

    getDateCount(store_id, st_date, et_date){
        return Axios.get(`/order/getDateCnt/${store_id}/${st_date}/${et_date}`)
    }
}

export default new OrderDataService()

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