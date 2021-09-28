import Axios from '../index.js'

class ProductOptionRelService {
    RelCreate(PrtId, data){
        return Axios.post(`/productOptionRel/prtOptRelCreate/${PrtId}`, data)
    }

    RelDelete(prtId, data) {
        return Axios.post(`/productOptionRel/prtOptRelDelete/${prtId}`, data)
    }
}

export default new ProductOptionRelService()

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