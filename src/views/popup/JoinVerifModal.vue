<template lang="">
    <div class="modal" v-if="visible">
        <div class="modal-inner">
            <div class="join-text">인증 번호를 입력해주세요.</div>
            <div class="input-div mt20">
                <input class="input-box" v-model="verifCode">
            </div>
            <div class="modal-btn-div">
                <button class="button-box mt20" @click="fnJoinVerifConfirm">인증</button>
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
            type: String
        },
    },

    data() {
        return {
            verifCode   : "",
            originEmail : "",
        }
    },
    
    emits: ["close"],

    methods: {
        close() {
            this.$emit("close");
            this.$emit("originEmail", this.originEmail);
        },

        // 회원가입 인증
        fnJoinVerifConfirm() {
            let mbr = {
                "email": this.email,
                "verifCode" : this.verifCode
            };

            this.resetPwdModalOpen = true;

            axios.post('/auth/joinVerifConfirm', mbr)
            .then(() => {
                alert("인증됐습니다.");
                console.log(this.email);
                this.originEmail = this.email;
                console.log(this.originEmail);
                this.close();
            })
            .catch((result) => {
                const message = result.response.data;
                if(message) {
                    alert(message);
                } else {
                    alert('이메일 인증에 실패했습니다.');
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
</style>