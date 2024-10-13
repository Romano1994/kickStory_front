<template lang="">
    <div id="login-window">
        <div id="login-text">
            로그인
        </div>
        <div id="login-container">
            <div class="text-div">
                이메일
            </div>
            <div class="input-div">
                <input class="input-box" v-model="email">
                <div class="valid-div" v-show="valid.email">
                    이메일을 확인해주세요.
                </div>
            </div>
            <div class="text-div">
                비밀번호
            </div>
            <div class="input-div">
                <input type="password" class="input-box" v-model="mbrPwd">
            </div>
            <div class="button-div">
                <button class="button-box" @click="fnConfirmLogin">
                    확인
                </button>
                <button class="button-box">
                    비밀번호 찾기
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            email:  "",
            mbrPwd: "",
            valid: {
                email: false,
            }
        }
    },

    watch: {
        'email': function() {
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
        fnConfirmLogin() {
            if(this.email == '' || this.valid.email) {
                alert('이메일을 다시 입력해주세요.');
                return;
            }
            var loginInfo = {
                "email": this.email         //이메일
                , "mbrPwd": this.mbrPwd     //비밀번호
            }

            console.log(loginInfo);

            this.postApi('/login', loginInfo, this.success, this.fail);
        },

        //회원가입 성공
        success() {
            

            
        },

        //회원가입 실패
        fail(message) {
            alert(message);
        }
    }
}
</script>
<style>
   #login-window {
        height: 30rem;
        align-content: center;
    }
    #login-text {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 1rem;
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
        background-color: var(--color1);
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
</style>