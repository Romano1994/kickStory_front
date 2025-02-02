<template lang="">
    <div class="modal" v-if="visible">
        <div class="modal-inner">
            <div class="login-text">인증 번호를 입력해주세요.</div>
            <div class="input-div mt20">
                <input class="input-box" v-model="verifCode">
            </div>
            <div class="modal-btn-div">
                <button class="button-box mt20" @click="findPwdConfirm">인증</button>
                <button class="button-box mt20" @click="close()">닫기</button>
            </div>
        </div>
    </div>
    <ResetPwdModal :visible="resetPwdModalOpen" :email="email" @close="resetPwdModalOpen=false"/>
</template>
<script>
import axios from "axios";
import ResetPwdModal from "./ResetPwdModal.vue";
export default {
    components: {
        ResetPwdModal
    },

    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String
        }
    },

    data() {
        return {
            resetPwdModalOpen : false,
            verifCode: "",
        }
    },
    emits: ["close"],
    methods: {
        close() {
            this.$emit("close");
        },

        // 비밀번호 찾기 인증
        findPwdConfirm() {
            let mbr = {
                "email": this.email,
                "verifCode" : this.verifCode
            };

            axios.post('/auth/findPwdConfirm', mbr)
            .then(() => {
                this.close();
                this.resetPwdModalOpen = true;
            })
            .catch((result) => {
                console.log(result);
                const message = result.response.data;
                if(message) {
                    alert(message);
                } else {
                    alert('비밀번호 찾기에 실패했습니다.');
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