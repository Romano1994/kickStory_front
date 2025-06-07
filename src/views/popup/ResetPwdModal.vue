<template lang="">
    <div class="modal" v-if="visible">
        <div class="modal-inner">
            <div class="login-text">비밀번호를 입력해주세요.</div>
            <div class="input-div mt20">
                <input type="password" class="input-box" v-model="pwd" @keyup.enter="fnResetPwd">
            </div>
            <div class="pwd-valid-div" v-show="valid.pwd">
                영문, 숫자, 특수문자를 조합하여 입력해주세요.
            </div>
            <div class="modal-btn-div">
                <button class="button-box mt20" @click="fnResetPwd">변경</button>
                <button class="button-box mt20" @click="close()">닫기</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
        },
    },

    data() {
        return{
            pwd: "",
            valid: {
                pwd: false,
            },
        }
    },

    emits: ["close"],

    watch: {
        'pwd': function() {
            this.checkPwd();
        },
    },

    methods: {
        close() {
            this.$emit("close");
        },

        //비밀번호 형식 체크
        checkPwd() {
            //숫자, 영어 대 소문자, 특수문자 포함 8자리 이상
            const validatePwd = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;


            if(!validatePwd.test(this.pwd) || !this.pwd) {
                this.valid.pwd = true;
                return;

            } else {
                this.valid.pwd = false;
                return;
            }
        },

        // 비밀번호 변경
        fnResetPwd() {
            if(this.pwd =="" || this.valid.pwd) {
                return;
            }
            let mbr = {
                "email": this.email,
                "pwd": this.pwd
            };
            axios.post('/auth/resetPwd', mbr)
            .then(() => {
                alert("변경돼었습니다.");
                this.close();
            })
            .catch((result) => {
                const message = result.response.data;
                if(message) {
                    alert(message);
                } else {
                    alert('비밀번호 변경에 실패했습니다.');
                }
            });
        }
    }
}
</script>
<style>
    .modal{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-inner{
        background-color: var(--color3);
        width: 30rem;
        height: 15rem;
        padding: 20px;
        border-radius: 10px;
        border: 4px solid var(--color1);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .modal-btn-div {
        display: flex;
        width: 13rem;
        justify-content: space-around;
    }
    .pwd-valid-div{
        padding-top: 8px;
        color: var(--color4);
    }
</style>