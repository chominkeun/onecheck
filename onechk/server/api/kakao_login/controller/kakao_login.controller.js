const service = require('../service/kakao_login.service')

// 토큰 발급
exports.getToken = (req, res, next) => {
    service.getToken(req, res)
}

exports.getUserInfoKakao = (req, res, next) => {
    service.getUserInfoKakao(req, res)
}

exports.logout = (req, res, next) => {
    service.logout(req, res)
}