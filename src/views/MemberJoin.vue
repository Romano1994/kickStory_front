<template lang="">
    <div id="join-window">
        <div class="join-text">
            회원가입
        </div>
        <div id="join-container">
            <div class="text-div">
                이메일
            </div>
            <div class="input-div">
                <input class="input-box" v-model="inputEmail">
                <div class="valid-div" v-show="valid.email">
                    이메일을 확인해주세요.
                </div>
                <div class="valid-div" v-show="!valid.email && inputEmail != ''">
                    <button class="button-box" @click="fnVerifRequest">이메일 인증</button>
                </div>
            </div>
            <div class="text-div">
                비밀번호
            </div>
            <div class="input-div">
                <input type="password" class="input-box" v-model="inputPwd">
                <div class="valid-div" v-show="valid.pwd">
                    영문, 숫자, 특수문자를 조합하여 입력해주세요.
                </div>
            </div>
            <div class="text-div">
                확인 비밀번호
            </div>
            <div class="input-div">
                <input type="password" class="input-box" v-model="inputPwdChk">
                <div class="valid-div" v-show="valid.pwdChk">
                    입력된 비밀번호가 다릅니다.
                </div>
            </div>
            <div class="text-div">
                이름
            </div>
            <div class="input-div">
                <input class="input-box" v-model="inputNm">
            </div>
            <div class="button-div">
                <button class="button-box" @click="fnConfirmJoin">
                    확인
                </button>
            </div>
        </div>
        <JoinVerifModal :visible="joinVerifModalOpen" :email="inputEmail" @originEmail="setOriginEmail" @close="joinVerifModalOpen=false"/>
    </div>
</template>
<script>
import JoinVerifModal from "./popup/JoinVerifModal.vue";
export default {
    components: {
        JoinVerifModal,
    },

    data() {
        return {
            valid: {
                email:  false,
                pwd:    false,
                pwdChk: false,
            },
            inputEmail:  "",
            inputPwd:    "",
            inputPwdChk: "",
            inputNm:     "",
            joinVerifModalOpen: false,
            originEmail: "",
        }
    },

    watch: {
        'inputEmail': function() {
            this.checkEamil();
        },
        'inputPwd': function() {
            this.checkPwd();
        },
        'inputPwdChk': function() {
            this.checkPwdChk();
        }
    },

    methods: {
        //이메일 형식 체크
        checkEamil() {
            //xxx@xxx.xxx 형식
            const validateEmail = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;

            if(!validateEmail.test(this.inputEmail) || !this.inputEmail) {
                this.valid.email = true;
                return;

            } else {
                this.valid.email = false;
                return;
            }
        },

        //비밀번호 형식 체크
        checkPwd() {
            //숫자, 영어 대 소문자, 특수문자 포함 8자리 이상
            const validatePwd = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;

            if(!validatePwd.test(this.inputPwd) || !this.inputPwd) {
                this.valid.pwd = true;
                return;

            } else {
                this.valid.pwd = false;
                return;
            }
        },

        //비밀번호 확인 체크
        checkPwdChk() {
            if(this.inputPwd != this.inputPwdChk) {
                this.valid.pwdChk = true;
                return;
            } else {
                this.valid.pwdChk = false;
                return;
            }
        },

        // 이메일 인증 코드 팝업
        fnVerifRequest() {
            if(this.inputEmail == '' || this.valid.email) {
                alert('이메일을 다시 입력해주세요.');
                return;
            }

            this.joinVerifModalOpen = true;

            let mbr ={
                "email" : this.inputEmail
            }

            this.postApi('/auth/joinVerifRequest',
                mbr,            // param
                () => {},       // success
                (result) => {   // fail
                    this.joinVerifModalOpen = false;
                    const message = result.response.data;
                    if(message) {
                        alert(message);
                    } else {
                        alert('이메일 인증에 실패했습니다.');
                    }
                }
            )
        },

        //회원 가입
        fnConfirmJoin() {
            if(this.inputEmail == '' || this.valid.email) {
                alert('이메일을 다시 입력해주세요.');
                return;
            }

            if(this.inputpwd == '' || this.valid.pwd) {
                alert('비밀번호를 다시 입력해주세요.');
                return;
            }

            if(this.originEmail !== this.inputEmail) {
                alert('이메일을 인증해주세요.');
                return;
            }

            var joinInfo = {
                "email": this.inputEmail    //이메일
                , "pwd": this.inputPwd      //비밀번호
                , "regNm": this.inputNm     //사용자 이름
            }
            
            this.postApi('/auth/signup', joinInfo, this.success, this.fail);
        },

        //회원가입 성공
        success(result) {
            let resultCode = result.data[0].resultCode;

            if(resultCode === 'S') {
                alert("회원가입됐습니다.");
                this.$router.push('/login');

            } else if(resultCode === 'F') {
                alert("이미 존재하는 이메일입니다.");

                if(confirm('로그인 화면으로 이동하시겠습니까?')) {
                    this.$router.push('/login');
                }
            }
        },

        //회원가입 실패
        fail(message) {
            alert(message);
        },

        // 인증받은 이메일 세팅
        setOriginEmail(paramEamil) {
            this.originEmail = paramEamil;
        }
    }
}
</script>
<style>
    #join-window{
        height: 40rem;
        align-content: center;
    }
    .join-text{
        text-align: center;
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--color4);
    }
    #join-container {
        display: grid;
        height: 30rem;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 10px;
    }
    .text-div {
        text-align: end;
        font-size: 1.2rem;
        grid-column-start: 2;
        align-content: center;
        padding-right: 30px;
        color: var(--color4);
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
    .valid-div{
        position: absolute;
        padding-top: 8px;
        color: var(--color4);
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