<template>
    <!-- login-box -->
    <div class="login-box">
        <h2><img src="~assets/images/logo-login.png" alt="" /></h2>
        <ul>
            <li>
                <VInput type="email" v-model="email" />
            </li>
            <li>
                <VInput type="password" v-model="password" />
            </li>
        </ul>
        <div class="id-save">
            <VCheckbox v-model="save">아이디 저장</VCheckbox>
        </div>
        <div class="login-btn">
            <VBtn class="btn-type1 st1 full" @click="login()">로그인</VBtn>
        </div>
        <div class="login-menu">
            <VBtn type="nlink" to="/">아이디 찾기</VBtn>
            <VBtn type="nlink" to="/">비밀번호 찾기</VBtn>
        </div>
        <modal v-if="showModal" @close="showModal = false">
            <h3 slot="header">
                로그인
            </h3>
            <div slot="body">
                {{ModalMsg}}
            </div>
            <div slot="footer">
                <button class="modal-default-button" @click="showModal = false">
                    OK
                </button>
            </div>
        </modal>
    </div>
    <!-- // login-box -->
</template>


<script>
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import Modal from '../components/common/UserModal.vue'
export default {
    components: {
        Modal : Modal
    },
    //
    data() {
        return {
            email: '',
            password: '',
            save: false,
            showModal: false,
            ModalMsg: ''
        }
    },
    //
    methods: {
        //
        async login(){
            const poolData = {
                UserPoolId: 'ap-northeast-2_h9ywi4hj6',
                ClientId:'157vct13rj5t2qae997l8rd070',
            };
            const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            let attributeList = [];
            const email = this.email;
            const password = this.password;

            const dataEmail = {
                Name: 'email',
                Value : email
            };
            const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
            attributeList.push(attributeEmail);
            userPool.signUp(email, password, attributeList, null, function (err, result) {
                if (err) {
                    alert(err.message);
                    return;
                }
                console.log('user name is ' + result.user.getUsername());
                console.log('call result: ' + result);
            });
        },
    }
}
</script>
