import apiSvc from '../index.js'

function fetchCommonAxiosGet(addUrl) {
    return apiSvc.get(`${addUrl}`);;
};

function fetchCommonAxiosPut(addUrl) {
    return apiSvc.put(`${addUrl}`);;
};

function fetchCommonAxiosPost(addUrl) {
    return apiSvc.post(`${addUrl}`);;
};

//전송 할 데이터가 있어 param로 인자로 받는 함수 추가
function fetchCommonAxiosPostOpt(addUrl, params) {
    return apiSvc.post(`${addUrl}`, params);;
};


export {
    fetchCommonAxiosGet,
    fetchCommonAxiosPut,
    fetchCommonAxiosPost,
    fetchCommonAxiosPostOpt
}