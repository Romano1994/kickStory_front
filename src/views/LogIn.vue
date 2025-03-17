<template lang="">
    <div id="login-window">
        <div class="login-text">
            로그인
        </div>
        <div id="login-container">
            <div class="text-div">
                이메일
            </div>
            <div class="input-div">
                <input class="input-box" v-model="email" @keyup.enter="fnConfirmLogin">
                <div class="valid-div" v-show="valid.email">
                    이메일을 확인해주세요.
                </div>
            </div>
            <div class="text-div">
                비밀번호
            </div>
            <div class="input-div">
                <input type="password" class="input-box" v-model="mbrPwd" @keyup.enter="fnConfirmLogin">
            </div>
            <div class="button-div">
                <button class="button-box" @click="fnConfirmLogin">
                    확인
                </button>
                <button class="button-box" @click="fnFindPwdRequest" style="color: black;">
                    비밀번호 찾기
                </button>
            </div>
        </div>
        <FindPwdModal :visible="findPwdModalOpen" :email="email" @close="findPwdModalOpen=false"/>
    </div>
</template>
<script>
import FindPwdModal from "./popup/FindPwdModal.vue";
import auth from "../js/auth"
import axios from "axios";
export default {
    components: {
        FindPwdModal,
    },
    data() {
        return {
            email:  "",
            mbrPwd: "",
            valid: {
                email: false,
            },
            findPwdModalOpen: false,
        }
    },

    watch: {
        'email': function() {
            // 이메일 형식 검증
            this.checkEamil();
        }
    },

    methods: {
         //이메일 형식 체크
         checkEamil() {
            //xxx@xxx.xxx 형식
            const validateEmail = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;

            if(!validateEmail.test(this.email) || !this.email) {
                this.valid.email = true;
                return;

            } else {
                this.valid.email = false;
                return;
            }
        },

        //로그인
        async fnConfirmLogin() {
            if(this.email == '' || this.valid.email) {
                alert('이메일을 다시 입력해주세요.');
                return;
            }

            let formData = new FormData();
            formData.append('username', this.email);
            formData.append('password', this.mbrPwd);

            const response = await axios.post('/login', formData);

            const access = response.headers['authorization']?.split(' ')[1];
            sessionStorage.setItem('access', access);
            // Axios 기본 헤더에 Access Token 설정
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // 토큰 재발급 예약
            auth.scheduleTokenReissue();

            // 홈으로 이동
            this.$router.push('/')
            .then(() => {
                window.location.reload();
            }); 
        },

        // 비밀번호 찾기 요청
        fnFindPwdRequest() {
            if(!confirm("입력하신 이메일로 인증번호를 전송하시겠습니까?")) {
                return;
            }

            if(this.email == '' || this.valid.email) {
                alert('이메일을 다시 입력해주세요.');
                return;
            }

            this.findPwdModalOpen = true;
            
            let mbr = {"email": this.email};

            this.postApi('/auth/findPwdRequest',
                mbr,        // param
                () => {     // success
                    alert("인증번호가 발송됐습니다.");
                },
                (result) => {   //fail
                    const message = result.response.data;
                    if(message) {
                        alert(message);
                    } else {
                        alert('비밀번호 찾기에 실패했습니다.');
                    }
                }
            )
        },
    }
}
</script>
<style>
   #login-window {
        height: 30rem;
        align-content: center;
    }
    .login-text {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--color1);
    }
    #login-container {
        display: grid;
        height: 20rem;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 10px;
    }
    .text-div {
        text-align: end;
        font-size: 1.2rem;
        grid-column-start: 2;
        align-content: center;
        padding-right: 30px;
        color: var(--color1);
    }
    .input-div{
        grid-column-start: 3;
        grid-column-end: 5;
        margin-left: 2rem;
        align-content: center;
    }
    .input-box{
        width: 18rem;
        height: 1.5rem;
    }
    .button-div{
        grid-column-start: 2;
        grid-column-end: 5;
        display: flex;
        justify-content: space-evenly;
        padding-right: 1rem;
    }
    .button-box{
        min-width: 5rem;
        height: 2rem;
        color: var(--color2);
        font-size: 1.2rem;
    }
    .button-box:hover{
        transform: scale(1.14);
        background-color: white;
        box-shadow: 0px 15px 20px rgba(27, 39, 63, 0.4);
    }
    input[type="password"] {
        font: small-caption;
        font-size: 20px;
    }
    .valid-div{
        position: absolute;
        padding-top: 8px;
        color: var(--color4);
    }
</style>