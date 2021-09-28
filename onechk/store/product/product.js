import {
  fetchCommonAxiosGet,
  fetchCommonAxiosGetSync
} from '../../api/common/commonApi.js'
import PcategoryDataService from '../../api/pcategory/pcategoryApi'
import ProductDataService from '../../api/product/productApi'
import AttachDataService from '../../api/attach/attachApi'
import CONST from '../../constants/Product'
import ProductOptionRelService from '../../api/product_option_rel/productOptionRelApi'
import { cloneDeep } from 'lodash'
import UserDataService from '../../api/user/userApi'


const PRODUCT_DEFAULT_DATA = () => {
  return {
    PRT_ID: '',
    PRT_NAME: '',
    PRICE: '',
    PRT_QTY: '',
    DESC: '',
    CATEGORY_ID: ''
  }
}

export const state = () => ({
  prtList: [],
  catList: [],
  catList2: [],
  catEditMsg: {},
  storeId: 0,
  prtInfo: PRODUCT_DEFAULT_DATA()
})

export const mutations = {
  /* 상품 정보 목록 설정 */
  SET_PRT_LIST(state, data) {
    state.prtList = data
  },
  /* 단일 상품 정보 기본값 설정 */
  SET_DEFAULT_PRODUCT_INFO(state) {
    state.prtInfo = CONST.DEFAULT_PRODUCT_INFO
  },
  /* 단일 상품 정보 설정 */
  SET_PRT_INFO(state, productID) {
    const trgetProduct = state.prtList.filter(prt => {
      return prt.PRT_ID === productID
    })
    state.prtInfo = (trgetProduct === undefined) ? trgetProduct : trgetProduct[0]
  },
  /* 단일 상품 정보 초기화 */
  SET_PRT_CLEAR(state) {
    state.prtInfo = PRODUCT_DEFAULT_DATA()
  },
  /* 상품카테고리, 전체 포함 */
  SET_CAT_LIST(state, catList) {
    state.catList = catList
    state.catList.unshift({
      CATEGORY_ID: -1,
      CATEGORY_NAME: '전체',
      REG_DATE: new Date(),
      REG_NAME: 'SYS000',
      IS_USING_DATA: 'Y',
      CHG_DATE: new Date(),
      CHG_NAME: 'SYS000',
      STORE_ID: state.store_id
    })
  },
  /* 상품카테고리, 전체 제외 */
  SET_CAT_LIST2(state, catList) {
    state.catList2 = catList
  },
  /* */
  SET_CAT_PRODUCT_LIST(state, category_id) {
    state.prtList = state.prtList.filter(prt => {
      return prt.CATEGORY_ID === category_id
    })
  },
  /* */
  SET_CAT_EDIT_MSG(state, msg) {
    state.catEditMsg = msg
  },
  /* */
  SET_STORE_ID(state, storeId) {
    state.storeId = storeId
  },
  /* 상품 명칭 변경 */
  SET_PRT_NAME(state, prtName) {
    state.prtInfo.PRT_NAME = prtName
  },
  /* 상품 가격 변경 */
  SET_PRICE(state, price) {
    state.prtInfo.PRICE = price
  },
  /* 상품 수량 변경 */
  SET_PRT_QTY(state, prtQty) {
    state.prtInfo.PRT_QTY = prtQty
  },
  /* 상품 카테고리 변경 */
  SET_CATEGORY_ID(state, categoryId) {
    state.prtInfo.CATEGORY_ID = categoryId
  },
  /* 상품 상세설명 변경 */
  SET_DESC(state, desc) {
    state.prtInfo.DESC = desc
  },
  /* 상품 첨부파일 ID 변경 */
  SET_ATTACH_ID(state, attachId) {
    state.prtInfo.ATTACH_ID = attachId
  },
  /* 상품 옵션 변경 */
  SET_OPTIONS(state, options) {
    state.prtInfo.options = options
  },
  /* 카테고리, 상품 리스트 초기화 */
  SET_CLEAR_LIST(state) {
    state.prtList = [];
    state.catList = [];
  }
}

export const actions = {
  /* */
  FETCH_PRT_LIST: function(context, payload) {
    fetchCommonAxiosGet(payload.url)
      .then(response => {
        context.commit('SET_PRT_LIST', response.data)
        // state.prtList = response.data;
      })
      .catch(error => {
        console.log(error)
      })
  },
  /* 상품 목록 조회 */
  FETCH_PRODUCT_LIST(context, storeId) {
    return ProductDataService.getAll(storeId)
  },
  /* 상품 정보 생성 */
  CREATE_PRODUCT_INFO({ state }, storeId) {
    ProductDataService.create(storeId, state.prtInfo)
  },
  /* 상품 정보 수정 */
  UPDATE_PRODUCT_INFO({ state }, productId) {
    try {
      return ProductDataService.update(productId, state.prtInfo)
    } catch (error) {
    }
  },
  /* 상품 정보 삭제 */
  DELETE_PRODUCT_INFO(context, productId) {
    return ProductDataService.delete(productId)
  },
  /* 상품 카테고리 이동 */
  FETCH_MOVE_PRODUCT_CATEGORY_INFO(context, product_info) {
    return ProductDataService.moveProductCategoryInfo(product_info)
  },
  /* 주문 관리 내 상품 조회(페이징 처리가 없어 스토어 내 전체 Get) */
  async FETCH_PRT_LIST_ORDER(context, payload) {
    let prt_data = []
    await ProductDataService.getAllInOrder(payload.store_id)
      .then(async response => {
        prt_data = response.data
        // 이미지 정보 셋팅
        for (let menu_idx in prt_data) {
          let menu = prt_data[menu_idx]
          menu.IMAGE_SRC = ''
          if (!(menu.ATTACH_ID === undefined || menu.ATTACH_ID === null)) {
            let attach_res = await AttachDataService.getOne(menu.ATTACH_ID)
            let IMG_SRC = attach_res.data.IMG_SRC
            if (!(IMG_SRC === undefined || IMG_SRC === null)) {
              menu.IMAGE_SRC = IMG_SRC
            }
          }
        }
        context.commit('SET_PRT_LIST', prt_data)
      })
      .catch(err => {
        console.log(err.response.status)
      })
  },
  /* */
  async FETCH_OPTION_REL(context, payload) {
    const PRT_ID = payload.PRT_ID
    const options = payload.options
    const originOpts = options.originOpts
    const removeOpts = options.removeOpts
    let originGnames = []
    let optionGnames = []
    let removeGnames = []
    let inserts = []
    let deletes = []
    // DB 입력, 삭제 대상 추출하기 위해
    // G_NAMES들을 담아서 includes 사용
    options.forEach(item => {
      optionGnames.push(item.G_NAME)
    })

    originOpts.forEach(item => {
      originGnames.push(item.G_NAME)
    })

    removeOpts.forEach(item => {
      removeGnames.push(item.G_NAME)
    })

    let ItargetGnames = optionGnames.filter(x => !originGnames.includes(x))
    let RtargetGnames = removeGnames.filter(x => originGnames.includes(x))

    // DB 데이터 입력 처리 대상
    ItargetGnames.forEach(Gname => {
      let find = options.find(item => {
        return Gname === item.G_NAME
      })
      if (find) {
        inserts.push(find.O_NAMES)
      }
    })

    // DB 데이터 삭제 처리 대상
    RtargetGnames.forEach(Gname => {
      let find = originOpts.find(item => {
        return Gname === item.G_NAME
      })

      if (find) {
        deletes.push(find.O_NAMES)
      }
    })

    let resCode1, resCode2
    try {
      // 데이터 처리에 대한 확인
      // console.log('inserts');
      // console.log(inserts);
      // console.log('deletes');
      // console.log(deletes);
      if (inserts.length) {
        // DB 데이터 입력
        let res = await ProductOptionRelService.RelCreate(PRT_ID, inserts)
        resCode1 = res.status
      } else {
        resCode1 = 204
      }

      if (deletes.length) {
        // Db 데이터 삭제
        let res2 = await ProductOptionRelService.RelDelete(PRT_ID, deletes)
        resCode2 = res2.status
      } else {
        resCode2 = 204
      }
    } catch (error) {
      console.log(error)
    }
    if (resCode1 === 204 && resCode2 === 204) {
      options.originOpts = cloneDeep(options)
      options.removeOpts = []
      context.commit('SET_OPTIONS', options)
    }
  },
  /* 상품 카테고리 조회 - 상점 ID 로 전체 조회
  *  all 추가(상품 주문, 상품 편집 화면에따라 '전체' 포함에 대한 설정 필요) */
  async FETCH_PRODUCT_CATEGORY_LIST(context, storeId) {
    context.commit('SET_STORE_ID', storeId)
    let category_data = []
    try {
      const response = await PcategoryDataService.getProductCategoryList(storeId)
      if (!response.data.message) {
        category_data = response.data
      } else {
        console.log('FETCH_PRODUCT_CATEGORY_LIST => ', response.data.message)
      }
    } catch (err) {
      console.log(err.response.status)
    }
    context.commit('SET_CAT_LIST', category_data)
  },
  /* */
  async FETCH_PRODUCT_CATEGORY_LIST2(context, storeId) {

    let category_data = []
    try {
      const response = await PcategoryDataService.getProductCategoryList(storeId)
      if (!response.data.message) {
        category_data = response.data
      } else {
        console.log('FETCH_PRODUCT_CATEGORY_LIST => ', response.data.message)
      }
    } catch (err) {
      console.log(err.response.status)
    }
    context.commit('SET_CAT_LIST2', category_data)
  },
  /* 상품 카테고리 등록 */
  async FETCH_CREATE_PRODUCT_CATEGORY_INFO({ commit, state, dispatch }, payload) {
    let status = 0
    let isSuccess = true
    let msgText = `카테고리 (${payload.CATEGORY_NAME})`
    const data = {
      STORE_ID: state.storeId,
      CATEGORY_NAME: payload.CATEGORY_NAME,
      NAME: payload.NAME
    }
    try {
      const response = await PcategoryDataService.createProductCategoryInfo(data)
      status = response.status
    } catch (err) {
      status = err.response.status
      msgText += ' 생성을 실패했습니다.'
      isSuccess = false
    }
    switch (status) {
      case 201:
        msgText += '가 생성되었습니다 !'
        dispatch('FETCH_PRODUCT_CATEGORY_LIST', state.storeId)
        break
      case 400:
        msgText += '카테고리 이름을 입력해주세요.'
        break
      case 500:
        msgText += '이미 존재하는 카테고리 이름입니다.'
        break
      default:
        msgText += '알 수 없는 오류 입니다.'
    }
    const msg = { msgText, isSuccess }
    commit('SET_CAT_EDIT_MSG', msg)
  },
  /* 상품 카테고리 수정 */
  async FETCH_UPDATE_PRODUCT_CATEGORY_INFO({ commit, state, dispatch }, payload) {
    const CATEGORY_ID = payload.CATEGORY_ID
    const CATEGORY_NAME = payload.CATEGORY_NAME
    const updateName = payload.updateName

    const data = { CATEGORY_NAME: updateName }

    let status = 0
    let isSuccess = true
    let msgText = `카테고리 (${CATEGORY_NAME} -> ${updateName}) 변경을 `

    try {
      const response = await PcategoryDataService.updateProductCategoryInfo(CATEGORY_ID, data)
      status = response.status
    } catch (err) {
      status = err.response.status
      msgText += '실패 했습니다.'
      isSuccess = false
    }

    switch (status) {
      case 201:
        msgText += '성공 했습니다.'
        dispatch('FETCH_PRODUCT_CATEGORY_LIST', state.storeId)
        break
      case 400:
        msgText += '카테고리 이름을 입력해주세요 !'
        break
      case 404:
        msgText += '이전과 동일한 이름으로 바꿀 수 없습니다 !'
        break
      case 500:
        msgText += '이미 존재하는 카테고리 이름입니다 !'
        break
      default:
        msgText += '알 수 없는 오류 입니다.'
    }

    const msg = { msgText, isSuccess }
    commit('SET_CAT_EDIT_MSG', msg)
  },
  /* */
  async FETCH_DELETE_PRODUCT_CATEGORY_INFO({ commit, state, dispatch }, category) {
    const CATEGORY_ID = category.CATEGORY_ID
    const CATEGORY_NAME = category.CATEGORY_NAME

    let status = 0
    let isSuccess = true
    let msgText = `카테고리 (${CATEGORY_NAME}) 삭제 `

    try {
      const response = await PcategoryDataService.deleteProductCategoryInfo(CATEGORY_ID)
      status = response.status
    } catch (err) {
      status = err.response.status
      msgText += '실패 했습니다.'
      isSuccess = false
    }

    switch (status) {
      case 204:
        msgText += '성공 했습니다.'
        dispatch('FETCH_PRODUCT_CATEGORY_LIST', state.storeId)
        break
      default:
        msgText += '알 수 없는 오류 입니다.'
    }

    const msg = { msgText, isSuccess }
    commit('SET_CAT_EDIT_MSG', msg)
  },
  /* 생성 시 가게에 중복 상품명 검색 */
  async FETCH_DUPLICATE_PRODUCT_NAME({ state }) {
    return await ProductDataService.duplicateCheck(state.storeId, state.prtInfo.PRT_NAME)
  },
  /* 수정 시 가게에 중복 상품명 검색 */
  async FETCH_DUPLICATE_PRODUCT_ID_NAME({ state }) {
    return await ProductDataService.duplicateCheckId(state.storeId, state.prtInfo.PRT_ID, state.prtInfo.PRT_NAME)
  },
}

export const getters = {
  fetchedCategoryAll(state) {
    return state.catListAll
  },
  fetchedCategory(state) {
    return state.catList
  },
  GET_CATEGORY_NAME(state) {
    let categoryName = ''
    //Myproduct(상품 화면) 내 상품카테고리가 vue Render로 수정시 state.prtInfo.CATEGORY_ID값은 String 타입으로 되어 있어 Number(숫자) 값으로 형변환 필요
    state.catList.filter(catInfo => {
      if (catInfo.CATEGORY_ID === Number(state.prtInfo.CATEGORY_ID)) {
        categoryName = catInfo.CATEGORY_NAME
      }
    })
    return categoryName
  },
  GET_DESC_LENGTH(state) {
    if (state.prtInfo.DESC) {
      return state.prtInfo.DESC.length
    } else {
      return 0
    }
  }

}
