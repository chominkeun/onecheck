const QueryString = require('querystring');
const request = require('async-request');

function KaKaoLoginService() {
    const dbHelper = require('../../../util/dbHelper')
    const db = dbHelper.getConnectionSync()
    var accessToken = null

    //카카오 토큰 발급 기능
    this.getToken = async (req, res) => {

        console.log('token start')
        const code = req.query.code
        const apikey = `984e9d07d893775bfe09ed1ae9cbe0fe`
        const redirect_uri = `http://localhost:3000/api/kakao_login/oauth/authorize`
        var data = QueryString.stringify({
            grant_type: "authorization_code",
            client_id: apikey,
            redirect_uri: redirect_uri,
            code: code
        })

        const response = await request("https://kauth.kakao.com/oauth/token",{
            method: 'POST',
            data: data,
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        })

        console.log(response.body)
        if (response.statusCode >= 400) {
            return res.status(400).send("카카오 로그인 실패");
        }
        else{
            const tokenToJson = JSON.parse(response.body);
            accessToken=tokenToJson.access_token
            console.log("Token get: ",accessToken)
            return res.status(200).send("<script>self.close();</script > ");

        }
    }
    //token으로 유저정보 조회(추가 정보 권한요청 필요)
    this.getUserInfoKakao = async (req,res) => {
        console.log('fetchinfo start',accessToken)
        if(accessToken){
            const response = await request('https://kapi.kakao.com/v2/user/me',{
                method: 'GET',
                // data: {
                //     property_keys: ["kakao_account.email"]
                // },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // console.log(response)
            if(response.statusCode >= 400){
                res.status(400).send("카카오 유저 조회 실패")
            } else{
                
                const resToJson = JSON.parse(response.body);
                // console.log(resToJson)
                res.status(200).send(resToJson)
            }
            
            return 0
            // .then((response) => {
            //     console.log(response)
            //     res.status(200).send(response)
            // })
            // .catch((err) => {
            //     res.status(500).send(err)
            // })
        }
        else{
            
            // console.log(accessToken)
            res.status(201).send({
                message: 'ERROR : Token Not Found'
            })
        }
    }
    //카카오 로그아웃기능
    this.logout = (req,res) => {
        console.log("logout start: ",accessToken)
        if(accessToken){

            accessToken = null
            return res.status(200).send("<script>window.close();</script > ");

            
            // const response = axios({
            //     method: 'post',
            //     url: 'https://kapi.kakao.com/v1/user/logout',
            //     // data: {
            //     //     property_keys: ["kakao_account.email"]
            //     // },
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // })

            // if(response.statusCode >= 400){
            //     res.status(400).send("카카오 로그아웃 실패")
            // } else{
            //     res.status(200).send(response)
            //     accessToken = null
            // }

        } else{
            res.status(404).send({
                message: 'ERROR : Token Not Found'
            })
        }
    }

}
module.exports = new KaKaoLoginService()
