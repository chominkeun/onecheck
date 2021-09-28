const { Router } = require('express')
const router = Router()
const controller = require('./controller/kakao_login.controller.js')

/* 토큰발급 */
router.get('/oauth/authorize', controller.getToken)

router.get('/user', controller.getUserInfoKakao)

router.get('/logout', controller.logout)

module.exports = router