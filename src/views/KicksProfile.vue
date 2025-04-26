<template>
    <div class="page-container kp-container">
        <!-- 유저 정보 섹션-->
        <div class="info-div">
            <div class="user-info">
                <div class="info-row">
                    <span class="info-label">이메일</span>
                    <span class="info-value">email</span>
                </div>
                <div class="info-row">
                    <span class="info-label">아이디</span>
                    <span class="info-value">{{mbrId}}</span>
                </div>
            </div>
        </div>
        <!-- 히스토리 수정 내역 섹션-->
        <div class="info-div">

        </div>
        <!-- 커뮤니티 정보 섹션-->
        <div class="info-div">

        </div>
    </div>
</template>
<script>
import userUtils from "@/js/userUtils";
export default {
    data() {
        return {
            mbrId: "",
        }
    },
    mounted() {
        this.mbrId = userUtils.getMbrId();
    },
    methods: {
        // 멤버별 히스토리 조회
        getHstry() {
            // 멤버 번호
            this.mbrNo = this.sessioUtil("mbrNo");

            // 히스토리 내역 조회
            this.getApi("/kcksHstry/getHstryWithMbrNo", {"mbrNo" : this.mbrNo}, getHstrySuccess, getHstryFail)

            // 히스토리 조회 성공 콜백
            const getHstrySuccess = (result) => {
                console.log("success", result);
            };
            
            // 히스토리 조회 실패 콜백
            const getHstryFail = (result) => {
                console.log("fail", result);
            };
        },

        // 멤버별 커뮤니티 조회
        getCommunity() {
            // 멤버 번호
            this.mbrNo = this.sessioUtil("mbrNo");

            // 커뮤니티 내역 조회
            this.getApi("/psts/getPstsWithMbrNo", {"mbrNo" : this.mbrNo}, getPstsSuccess, getPstsFail);

            // 히스토리 조회 성공 콜백
            const getPstsSuccess = (result) => {
                console.log("psts success", result);
            };
            
            // 히스토리 조회 실패 콜백
            const getPstsFail = (result) => {
                console.log("psts fail", result);
            };
            
        }
    }
}
</script>
<style>
    .kp-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
    }
    .info-div {
        display: flex;
        border: 1px solid white;
        width: 40rem;
        height: 10rem;
        margin-top: 50px;
    }
    .info-label {
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        border: 1px solid black;
    }
    .info-value {
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        border: 1px solid black;
    }
</style>